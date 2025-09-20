import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest3Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest3({ onComplete, onBack }: Quest3Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [choiceSelectionTime, setChoiceSelectionTime] = useState<number | null>(null);
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 3 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    const selectionTime = Date.now();
    setChoiceSelectionTime(selectionTime);
    
    // Track choice selection with detailed context
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 3 Choice Selected`, {
      choice: choice,
      selectionTime: selectionTime - questStartTime, // Time to decide in ms
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  };

  const handleSubmit = async () => {
    if (!selectedChoice || !currentTrainer) return;

    // Quest3 is always "correct" (scenario-based choice)
    // Apply stats and update quest progress
    let newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 };
    
    if (selectedChoice === 'approach') {
      newStatChanges = { bravery: 3, wisdom: 2, curiosity: 1, empathy: 2 };
    } else if (selectedChoice === 'wait') {
      newStatChanges = { bravery: 1, wisdom: 4, curiosity: 2, empathy: 3 };
    } else if (selectedChoice === 'cookies') {
      newStatChanges = { bravery: 2, wisdom: 1, curiosity: 3, empathy: 4 };
    }
    
    setStatChanges(newStatChanges);

    const newStats = {
      bravery: currentTrainer.stats.bravery + newStatChanges.bravery,
      wisdom: currentTrainer.stats.wisdom + newStatChanges.wisdom,
      curiosity: currentTrainer.stats.curiosity + newStatChanges.curiosity,
      empathy: currentTrainer.stats.empathy + newStatChanges.empathy,
    };

    try {
      // Update stats and quest progress in a single Firebase call
      await updateStatsAndQuestProgress(newStats, 3, selectedChoice);
      
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      const readingTime = choiceSelectionTime ? choiceSelectionTime - questStartTime : null;
      const decisionTime = choiceSelectionTime ? completionTime - choiceSelectionTime : null;
      
      // Save attempt to Firestore
      await saveAttempt({
        trainerId: currentTrainer.uid,
        issueId: currentTrainer.currentIssue,
        questNumber: 3,
        answer: selectedChoice,
        answerType: 'scenario_choice',
        isCorrect: true,
        questStartTime: new Date(questStartTime).toISOString(),
        submittedAt: new Date(completionTime).toISOString(),
        timeSpent: totalQuestTime,
        statsBefore: currentTrainer.stats,
        statsAfter: newStats
      });
      
      // Track quest completion
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 3 Completed`, { 
        choice: selectedChoice,
        statsGained: newStatChanges,
        totalQuestTime: totalQuestTime,
        readingTime: readingTime,
        decisionTime: decisionTime,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerBirthday: currentTrainer.birthday,
        trainerStatsBefore: currentTrainer.stats,
        trainerStatsAfter: newStats,
        questStartTime: questStartTime,
        completionTime: completionTime
      });

      // Show result
      setShowResult(true);
    } catch (error) {
      console.error('Failed to update trainer stats or quest progress:', error);
      // Still show result even if Firebase fails
      setShowResult(true);
    }
  };

  const handleNext = () => {
    // Just move to the next quest (no Firebase updates)
    onComplete();
  };


  const getResultText = (choice: string) => {
    switch (choice) {
      case 'approach': 
        return 'The Lumino looks at you with curious eyes. It takes a step forward, then another. Your gentle approach has shown it that you mean no harm. The creature\'s trust begins to grow as it realizes you are a friend.';
      case 'wait': 
        return 'You sit quietly in the snow, showing patience and respect for the Lumino\'s space. After a few moments, the creature slowly approaches you. Your wisdom in letting it choose has earned its trust.';
      case 'cookies': 
        return 'The Lumino\'s eyes light up at the sight of cookies! It eagerly comes closer, accepting your gift of friendship. Your kindness and generosity have won its heart completely.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Quest 3: Gaining Trust</h1>
            <p className="text-slate-300">Help the lost Lumino by earning its trust</p>
          </div>
        </div>

        {/* Quest Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        >
          {!showResult ? (
            <>
              {/* Question */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-6">The Lost Lumino</h2>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <img 
                    src="/kowai/lumino.png" 
                    alt="Lumino"
                    className="w-32 h-32 mx-auto mb-4 rounded-lg object-contain"
                  />
                  <p className="text-slate-300 text-lg leading-relaxed">
                    You want to help the lost and helpless young Lumino. But first, you need to gain its trust. What would you do?
                  </p>
                </div>
              </div>

              {/* Choice Options */}
              <div className="space-y-4 mb-8">
                {[
                  { id: 'approach', text: 'Slowly approach the Lumino with your hands open to show you\'re friendly.' },
                  { id: 'wait', text: 'Sit in the snow and let Lumino decide if it wants to come closer.' },
                  { id: 'cookies', text: 'Take out cookies from your backpack to share as a friendship gift.' }
                ].map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoiceSelect(option.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      selectedChoice === option.id
                        ? 'bg-green-600 border-2 border-green-500'
                        : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-white font-medium">{option.text}</p>
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedChoice}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-2xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Trust Gained!</h3>
                <div className="mb-6">
                  <img 
                    src="/kowai/lumino.png" 
                    alt="Lumino"
                    className="w-20 h-20 mx-auto mb-3 rounded-lg object-contain"
                  />
                  <p className="text-slate-300 text-lg mb-6">
                    {getResultText(selectedChoice!)}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                  <span className="text-xl">📘</span>
                  <span>Go back and keep reading until you reach the next quest!</span>
                </div>
              </div>

              {/* Stats Gained */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Stats Gained:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(statChanges).map(([stat, value]) => {
                    const numValue = value as number;
                    return numValue > 0 && (
                      <div key={stat} className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                        <span className={
                          stat === 'bravery' ? 'text-blue-400' :
                          stat === 'wisdom' ? 'text-yellow-400' :
                          stat === 'curiosity' ? 'text-green-400' :
                          'text-pink-400'
                        }>
                          {stat === 'bravery' ? '🛡️' :
                           stat === 'wisdom' ? '⭐' :
                           stat === 'curiosity' ? '🔍' :
                           '❤️'}
                        </span>
                        <span className="text-white">
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}: +{numValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Continue to the next quest
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
