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
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  // Scroll to top when component mounts or re-renders
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [showResult]);

  const getResultPicture = (choiceId: number) => {
    switch (choiceId) {
      case 1:
        return '/issues/issue1/yezu-walking.gif';
      case 2:
        return '/issues/issue1/avalanche.gif';
      case 3:
        return '/issues/issue1/yezu-grab.gif';
      default:
        return null;
    }
  };

  const choices = [
    {
      id: 1,
      text: "Shout loudly at the Yezu to distract it from Lumino.",
      result: {
        message: "You shout as loudly as you could: \"HEY! YOU! OVER HERE!\"\n\nThe Yezu skids to a halt, eyes snapping toward you. For a second, it stares in confusion. Then it turns and begins sprinting straight at you.\n\nYou wave your arms and ran. Your heart is pounding. Your mind is only thinking one thing: get it as far from the lumino as possible.\n\nUp ahead, you spot a cave. You dive inside just as the Yezu leaps forward to grab you. Your last shout echoed through the cliffs. Then comes the avalanche — a crashing wall of snow that falls over the cave mouth.\n\nYou hear the Yezu's furious roar from the other side, muffled beneath the snow wall.\n\nThen silence.",
        stats: { bravery: 5, wisdom: 0, curiosity: 0, empathy: 0 }
      }
    },
    {
      id: 2,
      text: "Throw snowballs at the Yezu to get its attention.",
      result: {
        message: "You quickly scoop up handfuls of snow and pack them into snowballs. With your full strength, you throw the first snowball at the massive Yezu.\n\nThe tiny snowball hits the Yezu's thick fur and crumbles into powder. The giant beast doesn't even notice - it's like throwing a pebble at a mountain.\n\nIn panic, you grab a bigger handful of snow and hurl it as hard as you can. This time, your aim goes wild - the snowball sails over the Yezu and smacks into an overhanging ledge of snow high up on the cliff face.\n\nThen you hear a soft cracking sound. Next, before you can react, an avalanche begins with a thunderous rumble! Snow pours down the cliff face like a white waterfall, crashing between you and the Yezu.\n\nFrom your snowy hiding spot, you can hear the Yezu's confused roars echoing in the distance.\n\nThen silence.",
        stats: { bravery: 5, wisdom: 0, curiosity: 0, empathy: 0 }
      }
    },
    {
      id: 3,
      text: "Rush to Lumino and try to scoop it up in your arms to carry it to safety.",
      result: {
        message: "Without thinking, you sprint toward Lumino as fast as you can. Your heart pounds as you run across the slippery snow, determined to reach the little creature before the Yezu does.\n\nBut the Yezu is much faster than you expected. As you're still several steps away from Lumino, the massive beast reaches it first. In your desperation to help, you leap forward anyway, throwing yourself between them.\n\nThe Yezu's massive paw swipes at you, sending you flying through the air like a rag doll. You crash hard into the rocky mountainside. The impact knocks the wind out of your lungs, and snow showers down on you from above.\n\nYour crash has disturbed loose snow on the mountain. Suddenly, a loud cracking sound fills the air. With a thunderous rumble, an avalanche begins! A massive wall of white powder cascades down the mountainside, rushing between you and the Yezu.\n\nThe beast roars and scrambles away from the falling snow. When the rumbling finally stops, you find yourself half-buried in fresh powder, bruised but alive.\n\nFrom somewhere beyond the snow wall, you can hear the Yezu's angry roars in the distance.\n\nThen silence.",
        stats: { bravery: 5, wisdom: 0, curiosity: 0, empathy: 0 }
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
      trainerAge: currentTrainer?.age,
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
        statsGained: statChanges,
        totalQuestTime: totalQuestTime,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
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

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-sky-200/90 via-blue-100/80 to-cyan-100/70 rounded-3xl p-8 shadow-2xl border-2 border-blue-200/40"
          >
            <div className="text-left">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">🎉 Incredible courage, young trainer!</h3>
                <div className="mb-6">
                  <p className="text-slate-700 text-lg leading-relaxed mb-6 whitespace-pre-line">
                    {choice.result.message}
                  </p>
                  
                  {/* Result Picture */}
                  {getResultPicture(selectedChoice) && (
                    <div className="mb-6">
                      <img 
                        src={getResultPicture(selectedChoice)!} 
                        alt="Quest result" 
                        className="mx-auto rounded-2xl shadow-lg max-w-md w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                
                {/* You have proven your BRAVERY section */}
                <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                  <p className="text-slate-700 text-lg mb-4">You have proven your <span className="text-blue-600 font-bold text-xl">BRAVERY</span>.</p>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    In that moment of danger, when the mighty Yezu threatened helpless Lumino, you didn't hesitate to put yourself at risk to help. Whether your quick thinking saved Lumino or not, your heart showed the true spirit of a Kowai Trainer. You chose to act with courage.
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed mt-3">
                    Now you should keep reading to find out if your action actually saved Lumino.
                  </p>
                </div>
              </div>
              
              {/* Stats Gained */}
              <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Stats Gained:</h4>
                <div className="grid grid-cols-2 sm:flex sm:justify-center sm:gap-6 gap-3">
                  {Object.entries(statChanges).map(([stat, value]) => {
                    const numValue = value as number;
                    return numValue > 0 && (
                      <div key={stat} className="flex items-center justify-center gap-2">
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
                        <span className="text-slate-700 font-medium">
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}: +{numValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reading Instruction */}
              <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📘</span>
                  <p className="text-slate-800 text-lg font-semibold">
                    Go back and keep reading until you reach the next quest!
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
                >
                  Continue to the next quest
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
          {/* Quest Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              Quest 6: Save Lumino
            </h2>
          </div>

          <div className="text-left mb-12">
            <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
              <h2 className="text-slate-800 text-2xl font-semibold">
                Yezu is about to hurt Lumino! What would you do?
              </h2>
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            {choices.map((choice) => (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoiceSelect(choice.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  selectedChoice === choice.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                    : 'bg-white/60 border-blue-300/50 hover:bg-white/80 hover:border-blue-400/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 font-semibold text-lg leading-tight">{choice.text}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={selectedChoice === null}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
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
