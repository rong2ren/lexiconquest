import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest6Props {
  onBack: () => void;
  onComplete: (statChanges: { bravery: number; wisdom: number; curiosity: number; empathy: number }) => void;
}

const Quest6: React.FC<Quest6Props> = ({ onBack, onComplete }) => {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questStartTime] = useState(Date.now());

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 6 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  const choices = [
    {
      id: 1,
      text: "Shout loudly at the Yezu to distract it from Lumino.",
      result: {
        title: "The Power of Voice",
        message: "Your loud shout echoes across the icy landscape! The Yezu stops mid-charge and turns its massive head toward you. Its glowing red eyes lock onto yours, and for a moment, you feel the weight of its ancient power. But then something unexpected happens - the Yezu's expression changes. It seems almost... curious about your boldness. It takes a step back, then another, before finally retreating into the shadows. Your courage and quick thinking saved Lumino!",
        stats: { bravery: 4, wisdom: 2, curiosity: 1, empathy: 3 }
      }
    },
    {
      id: 2,
      text: "Throw snowballs at the Yezu to get its attention.",
      result: {
        title: "A Clever Distraction",
        message: "You quickly scoop up snow and hurl snowballs at the Yezu! The first one hits its shoulder, and the creature roars in surprise. The second snowball hits its face, and suddenly the Yezu starts... laughing? It's a deep, rumbling sound that shakes the ground. The Yezu seems amused by your playful approach! It stops its attack and instead starts making snowballs of its own, tossing them playfully. Your creative thinking turned a dangerous situation into a moment of unexpected friendship!",
        stats: { bravery: 2, wisdom: 3, curiosity: 4, empathy: 2 }
      }
    },
    {
      id: 3,
      text: "Rush to Lumino and try to scoop it up in your arms to carry it to safety.",
      result: {
        title: "Protective Instinct",
        message: "You sprint toward Lumino without hesitation! As you reach down to scoop up the little creature, the Yezu's massive paw comes crashing down right where Lumino was standing. But you're faster - you've already gathered Lumino safely in your arms! The Yezu looks surprised by your speed and determination. Lumino nuzzles against your chest, and you can feel its tiny heart beating rapidly. Your protective instincts and quick reflexes saved the day!",
        stats: { bravery: 3, wisdom: 1, curiosity: 2, empathy: 4 }
      }
    }
  ];

  const handleChoiceSelect = (choiceId: number) => {
    setSelectedChoice(choiceId);
    
    // Track choice selection
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 6 Choice Selected`, {
      choiceId: choiceId,
      choiceText: choices[choiceId - 1].text,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      timeToDecision: Date.now() - questStartTime
    });
  };

  const handleSubmit = async () => {
    if (selectedChoice === null || !currentTrainer) return;

    const choice = choices[selectedChoice - 1];
    const statChanges = choice.result.stats;
    
    // Quest6 is always "correct" (scenario-based choice)
    // Apply stats and update quest progress
    const newStats = {
      bravery: currentTrainer.stats.bravery + statChanges.bravery,
      wisdom: currentTrainer.stats.wisdom + statChanges.wisdom,
      curiosity: currentTrainer.stats.curiosity + statChanges.curiosity,
      empathy: currentTrainer.stats.empathy + statChanges.empathy,
    };

    try {
      // Update stats and quest progress in a single Firebase call
      await updateStatsAndQuestProgress(newStats, 6, selectedChoice);
      
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      
      // Save attempt to Firestore
      await saveAttempt({
        trainerId: currentTrainer.uid,
        issueId: currentTrainer.currentIssue,
        questNumber: 6,
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
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 6 Completed`, {
        choiceId: selectedChoice,
        choiceText: choice.text,
        resultTitle: choice.result.title,
        statsGained: statChanges,
        totalQuestTime: totalQuestTime,
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
      console.error('Error updating trainer stats or quest progress:', error);
      // Still show result even if Firebase fails
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    // Just move to the next quest (no Firebase updates)
    onComplete({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 }); // Dummy stats since they're already applied
  };

  if (showResult && selectedChoice) {
    const choice = choices[selectedChoice - 1];
    const statChanges = choice.result.stats;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
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
              <h1 className="text-2xl font-bold text-white">Quest 6: The Yezu Encounter</h1>
              <p className="text-slate-300">Your choice has consequences...</p>
            </div>
          </div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
          >
            <h2 className="text-xl font-bold text-green-400 mb-4">{choice.result.title}</h2>
            <p className="text-white text-lg leading-relaxed mb-6">
              {choice.result.message}
            </p>
            
            {/* Stats Gained */}
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Stats Gained:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statChanges).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="text-2xl font-bold text-green-400">+{value}</div>
                    <div className="text-sm text-slate-300 capitalize">{stat}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Continue to the next quest
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
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
            <h1 className="text-2xl font-bold text-white">Quest 6: The Yezu Encounter</h1>
            <p className="text-slate-300">A dangerous moment requires quick thinking</p>
          </div>
        </div>

        {/* Quest Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🐉</div>
            <h2 className="text-2xl font-bold text-white mb-4">The Yezu Roars!</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              The Yezu roared again and charged at the Lumino, claws raised. Your heart pounds — you have to act fast! What would you do?
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            {choices.map((choice) => (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoiceSelect(choice.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedChoice === choice.id
                    ? 'bg-blue-600 border-2 border-blue-500'
                    : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedChoice === choice.id
                      ? 'border-white bg-white'
                      : 'border-slate-400'
                  }`}>
                    {selectedChoice === choice.id && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-white font-medium">{choice.text}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
            >
              Make Your Choice
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quest6;
