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
      newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 5 };
    } else if (selectedChoice === 'wait') {
      newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 5 };
    } else if (selectedChoice === 'cookies') {
      newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 5 };
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
        return 'You slowly walk toward Lumino with your hands held open, showing that you\'re not carrying anything dangerous.\n\nAt first, Lumino seems curious about your gentle approach. It tilts its head and watches you carefully, not running away like you expected.\n\nBut as you get closer, Lumino suddenly sees your shadow stretching across the snow toward it. In the wild, shadows often mean danger - predators swooping down from above.\n\nLumino panics! It leaps backward with a frightened yelp, stumbles in the deep snow, and tumbles tail-over-head into a small snowbank.\n\nYou stop immediately and step back, feeling terrible. But slowly, as Lumino brushes the snow off its fur, it seems to realize that you didn\'t mean to hurt it.\n\nYou were trying to be gentle. Even if it didn\'t work out perfectly, Lumino understands you.';
      case 'wait': 
        return 'You decide that the best approach is to be patient. You sit down gently in the snow, cross your legs, and stay very still.\n\nAt first, your plan seems to work perfectly. Lumino tilts its head curiously and begins walking in a slow circle around you, keeping a safe distance but clearly studying you.\n\nBut as the minutes pass, sitting in the freezing snow becomes really uncomfortable. The cold snow soaks through your pants, making your legs numb and stiff.\n\nYou can\'t take it anymore, so you start to extend one leg very slowly and carefully. But the sudden movement startles Lumino!\n\nIn its panic, Lumino slips on a patch of smooth ice and goes sliding, until it crashes into a pile of soft snow with a surprised squeak.\n\nWell, the good thing is that it doesn\'t seem scared of you anymore. Your patience showed kindness.';
      case 'cookies': 
        return 'You slowly pull out some cookies from your backpack and hold them out toward Lumino.\n\nThe little creature tilts its head curiously, watching you with those big, sparkling eyes.\n\nLumino takes a few careful steps closer, sniffing the air. It looks at the cookies, then at you, then back at the cookies.\n\nFinally, Lumino darts forward quickly, grabs one cookie in its mouth, and runs back to a safe distance.\n\nBut then Lumino starts coughing and spits out the cookie! It shakes its head and makes a disgusted face. Clearly, magical creatures can\'t eat the same food as humans.\n\nYou feel a little disappointed that your gift didn\'t work. But at least Lumino isn\'t running away, and its eyes look softer now, less afraid.\n\nYou\'ve made your first small step toward friendship.';
      default: return '';
    }
  };

  const getResultPicture = (choice: string) => {
    switch (choice) {
      case 'approach': 
        return '/issues/issue1/lumino shakes snow off.gif';
      case 'wait': 
        return '/issues/issue1/lumino-sliding.gif';
      case 'cookies': 
        return '/issues/issue1/lumino coughs cookie.gif';
      default: return '/kowai/lumino.png';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6 mt-4">
        <Button 
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Quest Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-sky-200/90 via-blue-100/80 to-cyan-100/70 rounded-3xl p-8 shadow-2xl border-2 border-blue-200/40"
        >
          {!showResult ? (
            <>
              {/* Quest Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  Quest 3: Build Trust with Lumino
                </h2>
              </div>

              {/* Question */}
              <div className="text-center mb-12">
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl font-semibold">
                    You want to help the lost and helpless young Lumino. But first, you need to gain its trust. What would you do?
                  </h2>
                </div>
              </div>

              {/* Choice Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { 
                    id: 'approach', 
                    text: 'Slowly approach the Lumino with your hands open to show you\'re friendly.',
                    image: '/issues/issue1/mittens.png'
                  },
                  { 
                    id: 'wait', 
                    text: 'Sit in the snow and let Lumino decide if it wants to come closer.',
                    image: '/issues/issue1/sitting.png'
                  },
                  { 
                    id: 'cookies', 
                    text: 'Take out cookies from your backpack to share as a friendship gift.',
                    image: '/issues/issue1/cookies.png'
                  }
                ].map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoiceSelect(option.id)}
                    className={`p-6 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                      selectedChoice === option.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                        : 'bg-white/60 border-2 border-blue-300/50 hover:bg-white/80 hover:border-blue-400/70'
                    }`}
                  >
                    <div className="mb-4">
                      <img 
                        src={option.image} 
                        alt={option.text}
                        className="w-64 h-64 mx-auto rounded-lg object-cover"
                      />
                    </div>
                    <p className="text-slate-800 font-semibold text-lg leading-tight">{option.text}</p>
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedChoice}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              <div className="mb-8">
                <div className="mb-6">
                  <img 
                    src={getResultPicture(selectedChoice!)}
                    alt="Lumino"
                    className="h-96 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <p className="text-slate-700 text-lg mb-4 whitespace-pre-line">
                    {getResultText(selectedChoice!)}
                  </p>
                  
                </div>
              </div>

              {/* Congratulations Message */}
              <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                <h4 className="text-2xl font-bold text-slate-800 mb-4">🎉 Congratulations, Explorer!</h4>
                <p className="text-slate-700 text-lg mb-4">You have proven your <span className="text-pink-600 font-bold text-xl">EMPATHY</span>.</p>
                <p className="text-slate-700 text-lg mb-4">
                  Though it wasn't fully successful, your kindness towards Lumino was clear. You have proven that your heart is big enough to care for magical creatures.
                </p>
                <p className="text-slate-700 text-lg">
                  Three more challenges await you. Continue forward, and show us what else you can accomplish.
                </p>
              </div>

              {/* Stats Gained */}
              <div className="bg-white/60 rounded-lg p-4 mb-6 border border-blue-300/50">
                <h4 className="text-lg font-semibold text-slate-800 mb-3 text-center">Stats Gained:</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700 sm:flex sm:items-center sm:justify-center sm:gap-6">
                  {Object.entries(statChanges).map(([stat, value]) => {
                    const numValue = value as number;
                    return numValue > 0 && (
                      <span key={stat} className="flex items-center justify-center gap-1">
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
                        <span>
                          {stat.charAt(0).toUpperCase() + stat.slice(1)} +{numValue}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Reading Instruction - Last before button */}
              <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📘</span>
                  <span className="text-slate-800 text-lg font-semibold">
                    Go back and keep reading until you reach the next quest!
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
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
