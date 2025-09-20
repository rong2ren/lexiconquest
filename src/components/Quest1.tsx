import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest1Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest1({ onComplete, onBack }: Quest1Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt, addKowaiToTrainer } = usePlayAuth();
  const [selectedKowai, setSelectedKowai] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [kowaiSelectionTime, setKowaiSelectionTime] = useState<number | null>(null);

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 1 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  const handleKowaiSelect = (kowai: string) => {
    setSelectedKowai(kowai);
    const selectionTime = Date.now();
    setKowaiSelectionTime(selectionTime);
    
    // Track Kowai selection with detailed context
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 1 Kowai Selected`, {
      kowai: kowai,
      selectionTime: selectionTime - questStartTime, // Time to decide in ms
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  };

  const handleSubmit = async () => {
    if (!selectedKowai || !currentTrainer) return;

    // Quest1 is always "correct" (Kowai selection)
    // Apply stats and update quest progress
    const statChanges = { bravery: 1, wisdom: 1, curiosity: 1, empathy: 1 };

    const newStats = {
      bravery: currentTrainer.stats.bravery + statChanges.bravery,
      wisdom: currentTrainer.stats.wisdom + statChanges.wisdom,
      curiosity: currentTrainer.stats.curiosity + statChanges.curiosity,
      empathy: currentTrainer.stats.empathy + statChanges.empathy,
    };

    try {
      // Update stats and quest progress in a single Firebase call
      await updateStatsAndQuestProgress(newStats, 1, selectedKowai);
      
      // Add the selected kowai as an egg to ownedKowai
      await addKowaiToTrainer(`${selectedKowai} egg`);
      
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      const readingTime = kowaiSelectionTime ? kowaiSelectionTime - questStartTime : null;
      const decisionTime = kowaiSelectionTime ? completionTime - kowaiSelectionTime : null;
      
      // Save attempt to Firestore
      await saveAttempt({
        trainerId: currentTrainer.uid,
        issueId: currentTrainer.currentIssue,
        questNumber: 1,
        answer: selectedKowai,
        answerType: 'kowai_selection',
        isCorrect: true,
        questStartTime: new Date(questStartTime).toISOString(),
        submittedAt: new Date(completionTime).toISOString(),
        timeSpent: totalQuestTime,
        statsBefore: currentTrainer.stats,
        statsAfter: newStats
      });

      // Track quest completion
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 1 Completed`, { 
        kowai: selectedKowai,
        statsGained: statChanges,
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

  const getKowaiDisplayName = (kowai: string) => {
    switch (kowai) {
      case 'fanelle': return 'Fanelle';
      case 'scorki': return 'Scorki';
      case 'peblaff': return 'Peblaff';
      default: return kowai;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
            <h1 className="text-2xl font-bold text-white">Quest 1: Where Adventure Starts</h1>
            <p className="text-slate-300">Choose your first Kowai companion</p>
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
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">🔍</span>
                  <span className="text-2xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome, Young Trainer!</h2>
                <p className="text-slate-300 text-lg mb-2">
                  Question: Which kowai do you want your egg to hatch into? *
                </p>
                <p className="text-slate-400 text-sm">
                  Before you choose, make sure you have read the pages to learn about each one's personality and its power.
                </p>
              </div>

              {/* Kowai Choices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { id: 'fanelle', name: 'Fanelle' },
                  { id: 'scorki', name: 'Scorki' },
                  { id: 'peblaff', name: 'Peblaff' }
                ].map((kowai) => (
                  <motion.button
                    key={kowai.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleKowaiSelect(kowai.id)}
                    className={`p-6 rounded-xl text-center transition-all duration-200 border-2 ${
                      selectedKowai === kowai.id
                        ? 'border-purple-500 bg-slate-700/50 shadow-lg'
                        : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="mb-4">
                      <span className="text-white font-bold text-lg">{kowai.name}</span>
                    </div>
                    <img 
                      src={`/kowai/${kowai.id}.png`} 
                      alt={kowai.name}
                      className="w-48 h-48 mx-auto rounded-lg object-contain"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedKowai}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 rounded-lg border-2 border-gray-600 hover:border-gray-500 transition-all duration-200"
                >
                  Choose my Kowai →
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
                <h3 className="text-2xl font-bold text-white mb-4">Kowai Chosen!</h3>
                <div className="mb-6">
                  <img 
                    src={`/kowai/${selectedKowai}.png`} 
                    alt={getKowaiDisplayName(selectedKowai!)}
                    className="w-20 h-20 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <p className="text-slate-300 text-lg">
                    You have chosen <span className="text-purple-400 font-semibold">{getKowaiDisplayName(selectedKowai!)}</span> as your first Kowai. 
                    This brave little creature is waiting to become your lifelong friend.
                  </p>
                </div>
                <p className="text-slate-300 mb-6">
                  But first, you must prove you are ready to be a true Kowai Trainer. Complete all the challenges ahead to earn the right to awaken your Kowai egg.
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                  <span className="text-xl">📘</span>
                  <span>Go back and keep reading until you reach the next quest!</span>
                </div>
              </div>

              {/* Stats Gained */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Stats Gained:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                    <span className="text-blue-400">🛡️</span>
                    <span className="text-white">Bravery: +1</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white">Wisdom: +1</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                    <span className="text-green-400">🔍</span>
                    <span className="text-white">Curiosity: +1</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                    <span className="text-pink-400">❤️</span>
                    <span className="text-white">Empathy: +1</span>
                  </div>
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