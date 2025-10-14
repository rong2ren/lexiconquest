import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { usePlayAuth } from '../../contexts/PlayAuthContext';
import { trackEvent, getIssueNumber } from '../../lib/mixpanel';
import { StatNotification } from '../StatNotification';

interface Quest1Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest1({ onComplete, onBack }: Quest1Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt, addKowaiToTrainer } = usePlayAuth();
  const [selectedKowai, setSelectedKowai] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });
  const [showStatAnimation, setShowStatAnimation] = useState(false);

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent('Quest Started', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 1,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now()
    });
  }, []);

  // Scroll to top when component mounts or re-renders
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [showResult]);

  const handleKowaiSelect = (kowai: string) => {
    setSelectedKowai(kowai);
    
    // Track Kowai selection with detailed context
    trackEvent('Quest Answer Selected', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 1,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now(),
      optionType: 'kowai',
      selectedAnswer: kowai
    });
  };

  const handleSubmit = async () => {
    if (!selectedKowai || !currentTrainer) return;

    // Quest1 is always "correct" (Kowai selection)
    // Apply stats based on kowai selection
    let newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 };
    
    switch (selectedKowai) {
      case 'peblaff':
        newStatChanges.curiosity = 1;
        break;
      case 'fanelle':
        newStatChanges.empathy = 1;
        break;
      case 'scorki':
        newStatChanges.bravery = 1;
        break;
      default:
        // Fallback - no stat changes
        break;
      }
    
    setStatChanges(newStatChanges);

    const newStats = {
      bravery: currentTrainer.stats.bravery + newStatChanges.bravery,
      wisdom: currentTrainer.stats.wisdom + newStatChanges.wisdom,
      curiosity: currentTrainer.stats.curiosity + newStatChanges.curiosity,
      empathy: currentTrainer.stats.empathy + newStatChanges.empathy,
    };

    const completionTime = Date.now();
    const totalQuestTime = completionTime - questStartTime;
    
    try {
      // Update stats and quest progress in a single Firebase call
      await updateStatsAndQuestProgress(newStats, 1, selectedKowai);
      
      // Add the selected kowai as an egg to ownedKowai
      await addKowaiToTrainer(`${selectedKowai} egg`);
      
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

      // Show result and stat animation instantly
      setShowResult(true);
      setShowStatAnimation(true);
      
      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowStatAnimation(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update trainer stats or quest progress:', error);
      
      // Track quest completion failure
      trackEvent('Quest Completion Failed', {
        issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
        questNumber: 1,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: selectedKowai,
        error: 'stats_update_failed',
        errorMessage: (error as any)?.message || 'Unknown error',
        totalQuestTime: totalQuestTime
      });
      
      // Still show result even if Firebase fails
      setShowResult(true);
      setShowStatAnimation(true);
      
      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowStatAnimation(false);
      }, 3000);
    }

    // Track quest completion (always track, regardless of Firebase success)
    trackEvent('Quest Completed', { 
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 1,
      trainerId: currentTrainer.uid,
      trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
      trainerAge: currentTrainer.age,
      trainerStats: currentTrainer.stats,
      questStartTime: questStartTime,
      eventTime: Date.now(),
      selectedAnswer: selectedKowai,
      statsGained: newStatChanges,
      totalQuestTime: totalQuestTime
    });
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
              <div className="text-center mb-10">
                <h2 className="quest-title mb-8 text-4xl text-slate-800 bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  Quest 1: Where Adventure Starts
                </h2>
                
                  {/* Question Container */}
                  <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50 text-left">
                    <h2 className="text-slate-800 text-2xl mb-4 font-semibold">
                      Which kowai do you want your egg to hatch into?
                    </h2>
                  <div className="flex items-center justify-center gap-2 text-slate-700">
                    <p className="text-lg">
                      Before you choose, make sure you have read the pages to learn about each one's personality and its power.
                    </p>
                  </div>
                </div>
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
                    className={`p-6 rounded-xl text-center transition-all duration-200 border-2 cursor-pointer ${
                      selectedKowai === kowai.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                        : 'bg-white/60 border-blue-300/50 hover:bg-white/80 hover:border-blue-400/70'
                    }`}
                  >
                    <div className="mb-4">
                      <span className="text-slate-800 font-bold text-lg">{kowai.name}</span>
                    </div>
                    <img 
                      src={`/kowai/${kowai.id}.png`} 
                      alt={kowai.name}
                      className="mx-auto rounded-lg object-contain"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedKowai}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Choose my Kowai →
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-left">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">🎉 Kowai Chosen!</h3>
                  
                  {/* Duolingo-style notification in header row */}
                  <StatNotification 
                    show={showStatAnimation} 
                    statChanges={statChanges} 
                  />
                </div>
                <div className="mb-6">
                  <img 
                    src={`/kowai/${selectedKowai}.png`} 
                    alt={getKowaiDisplayName(selectedKowai!)}
                    className="h-70 mx-auto mb-3 rounded-lg object-cover"
                  />
                  <p className="quest-result-text text-slate-700 text-lg mb-4">
                    You have chosen <span className="text-purple-600 font-semibold">{getKowaiDisplayName(selectedKowai!)}</span> as your first Kowai companion. 
                    This magical creature has been waiting for someone special like you to come along and form an unbreakable bond.
                  </p>
                  <p className="quest-result-text text-slate-700 text-lg mb-4">
                    This brave little creature is waiting to become your lifelong friend and trusted partner in all your future adventures. 
                    Together, you will face challenges, discover new lands, and grow stronger with each passing day.
                  </p>
                  <p className="quest-result-text text-slate-700 text-lg mb-4">
                    But first, you must prove you are ready to be a true Kowai Trainer. The path ahead is filled with trials that will test your courage, wisdom, curiosity, and empathy. 
                    Complete all the challenges ahead to earn the right to awaken your Kowai egg and begin your journey as a legendary trainer.
                  </p>
                  <p className="quest-result-text text-slate-700 text-lg">
                    Your adventure is just beginning, and the bond you will share with {getKowaiDisplayName(selectedKowai!)} will be the foundation of everything you accomplish together.
                  </p>
                </div>
              </div>

              {/* Stats Gained */}
              <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50 relative">
                <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Stats Gained:</h4>
                <div className="flex items-center justify-center gap-6">
                  {statChanges.bravery > 0 && (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-blue-400">🛡️</span>
                      <span className="text-slate-700">Bravery +{statChanges.bravery}</span>
                    </span>
                  )}
                  {statChanges.wisdom > 0 && (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-slate-700">Wisdom +{statChanges.wisdom}</span>
                    </span>
                  )}
                  {statChanges.curiosity > 0 && (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-green-400">🔍</span>
                      <span className="text-slate-700">Curiosity +{statChanges.curiosity}</span>
                    </span>
                  )}
                  {statChanges.empathy > 0 && (
                    <span className="flex items-center justify-center gap-1">
                      <span className="text-pink-400">❤️</span>
                      <span className="text-slate-700">Empathy +{statChanges.empathy}</span>
                    </span>
                  )}
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

              {/* Next Button */}
              <div className="text-center">
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
                >
                  Continue to Next Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}