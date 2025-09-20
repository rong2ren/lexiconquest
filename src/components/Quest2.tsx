import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest2Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest2({ onComplete, onBack }: Quest2Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [attemptCount, setAttemptCount] = useState(0);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [answerSelectionTime, setAnswerSelectionTime] = useState<number | null>(null);

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 2 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  const handleContinentSelect = (continent: string) => {
    setSelectedContinent(continent);
    const selectionTime = Date.now();
    setAnswerSelectionTime(selectionTime);
    
    // Track answer selection with detailed context
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 2 Answer Selected`, {
      continent: continent,
      selectionTime: selectionTime - questStartTime, // Time to decide in ms
      attemptNumber: attemptCount + 1,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  };

  const handleSubmit = async () => {
    if (!selectedContinent || !currentTrainer) return;

    const correct = selectedContinent === 'antarctica';
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Track this answer attempt
    const newAllAnswers = [...allAnswers, selectedContinent];
    setAllAnswers(newAllAnswers);
    
    setIsCorrect(correct);

    // Only apply stats and update quest progress if correct
    if (correct) {
      const statChanges = { bravery: 0, wisdom: 0, curiosity: 3, empathy: 0 };
      const newStats = {
        bravery: currentTrainer.stats.bravery + statChanges.bravery,
        wisdom: currentTrainer.stats.wisdom + statChanges.wisdom,
        curiosity: currentTrainer.stats.curiosity + statChanges.curiosity,
        empathy: currentTrainer.stats.empathy + statChanges.empathy,
      };

      try {
        // Update stats and quest progress in a single Firebase call
        await updateStatsAndQuestProgress(newStats, 2, selectedContinent);
        
        const completionTime = Date.now();
        const totalQuestTime = completionTime - questStartTime;
        const readingTime = answerSelectionTime ? answerSelectionTime - questStartTime : null;
        const decisionTime = answerSelectionTime ? completionTime - answerSelectionTime : null;
        
        // Save attempt to Firestore
        try {
          await saveAttempt({
            trainerId: currentTrainer.uid,
            issueId: currentTrainer.currentIssue,
            questNumber: 2,
            answer: selectedContinent,
            answerType: 'multiple_choice',
            isCorrect: correct,
            questStartTime: new Date(questStartTime).toISOString(),
            submittedAt: new Date(completionTime).toISOString(),
            timeSpent: totalQuestTime,
            statsBefore: currentTrainer.stats,
            statsAfter: newStats
          });
        } catch (error) {
          console.error('Failed to save attempt:', error);
        }

        // Track quest completion
        trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 2 Completed`, { 
          continent: selectedContinent, 
          correct: correct,
          attemptNumber: newAttemptCount,
          allAnswers: newAllAnswers,
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
      } catch (error) {
        console.error('Failed to update trainer stats or quest progress:', error);
      }
    } else {
      // Save attempt to Firestore (wrong answer)
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      
      try {
        await saveAttempt({
          trainerId: currentTrainer.uid,
          issueId: currentTrainer.currentIssue,
          questNumber: 2,
          answer: selectedContinent,
          answerType: 'multiple_choice',
          isCorrect: correct,
          questStartTime: new Date(questStartTime).toISOString(),
          submittedAt: new Date(completionTime).toISOString(),
          timeSpent: totalQuestTime,
          statsBefore: currentTrainer.stats,
          statsAfter: currentTrainer.stats // No stats change for wrong answer
        });
      } catch (error) {
        console.error('Failed to save attempt:', error);
      }

      // Track wrong answer (no stats or quest progress)
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 2 Wrong Answer`, { 
        continent: selectedContinent, 
        attemptNumber: newAttemptCount,
        allAnswers: newAllAnswers,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerBirthday: currentTrainer.birthday,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        submissionTime: Date.now()
      });
    }

    // Show result (regardless of correct/incorrect)
    setShowResult(true);
  };

  const handleNext = () => {
    // Just move to the next quest (no Firebase updates)
    onComplete();
  };

  const handleTryAgain = () => {
    // Track retry attempt
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 2 Retry`, {
      wrongAnswer: selectedContinent,
      attemptNumber: attemptCount,
      allAnswersSoFar: allAnswers,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
    
    setShowResult(false);
    setSelectedContinent(null);
    setIsCorrect(false);
    setAnswerSelectionTime(null);
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
                  Quest 2: Find the Continent
                </h2>
              </div>

              {/* Riddle */}
              <div className="text-center mb-12">
                
                <div className="relative rounded-2xl p-8 overflow-hidden mb-8 shadow-lg shadow-blue-500/20" style={{
                  backgroundImage: 'url(/kowai/riddle_i1q2.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-slate-900/70 rounded-2xl"></div>
                  <div className="relative z-10">
                    <p className="text-slate-200 text-xl leading-relaxed whitespace-pre-line drop-shadow-md">
                      {"At the bottom of the world so wide, where snowy silence grows.\n" +
                       "Mountains sleep beneath the ice, where hidden fire glows.\n" +
                       "The sun may shine for weeks on end, then vanish from the sky.\n" +
                       "And glowing lights in purple-green will swirl and flicker by."}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl font-semibold">
                    Which continent the magic has brought you to?
                  </h2>
                </div>
              </div>

              {/* Continent Choices */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  'Asia',
                  'Africa', 
                  'Australia',
                  'Antarctica',
                  'Europe',
                  'North America',
                  'South America'
                ].map((continent) => (
                  <motion.button
                    key={continent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContinentSelect(continent.toLowerCase().replace(' ', '_'))}
                    className={`p-4 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                      selectedContinent === continent.toLowerCase().replace(' ', '_')
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                        : 'bg-white/60 border-2 border-blue-300/50 hover:bg-white/80 hover:border-blue-400/70'
                    }`}
                  >
                    <p className="text-slate-800 font-medium">{continent}</p>
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedContinent}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              {isCorrect ? (
                <>
                  <div className="mb-8">
                      <h3 className="text-3xl font-bold text-slate-800 mb-6">🎉 Congratulations, Explorer!</h3>
                      <div className="mb-6">
                        <img 
                          src="/issues/issue1/antartica_map.gif" 
                          alt="Antarctica Map" 
                          className="mx-auto max-w-md w-full"
                        />
                      </div>
                    
                    <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                      <h4 className="text-2xl font-bold text-slate-800 mb-4">🎉 Congratulations, Explorer!</h4>
                      <p className="text-slate-700 text-lg mb-4">You have proven your <span className="text-green-600 font-bold text-xl">CURIOSITY</span>.</p>
                      <p className="text-slate-700 text-lg mb-4">
                        You looked at the clues, studied the world, and found the answers hidden in the frozen land of Antarctica. 
                        This is exactly the kind of thinking that separates true Kowai Trainers from ordinary people.
                      </p>
                      <p className="text-slate-700 text-lg mb-4">
                        Your ability to observe, analyze, and connect the dots shows that you have the mind of a true explorer. 
                        You didn't just guess - you used your intelligence to piece together the puzzle and discover the truth.
                      </p>
                      <p className="text-slate-700 text-lg">
                        But do not celebrate too long, for your trials have only just begun. 
                        Three greater challenges still lie ahead of you, each one designed to test a different part of your character.
                      </p>
                    </div>
                  </div>

                  {/* Stats Gained */}
                  <div className="bg-white/60 rounded-lg p-4 mb-6 border border-blue-300/50">
                    <h4 className="text-lg font-semibold text-slate-800 mb-3 text-center">Stats Gained:</h4>
                    <div className="flex justify-center">
                      <span className="flex items-center justify-center gap-2 text-slate-700">
                        <span className="text-green-400">🔍</span>
                        <span>Curiosity +3</span>
                      </span>
                    </div>
                  </div>

                  {/* Reading Instruction - Last before button */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 mb-6 border-2 border-blue-500/30">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">📘</span>
                      <span className="text-slate-200 text-lg font-semibold">
                        Go back and keep reading until you reach the next quest!
                      </span>
                    </div>
                  </div>

                  {/* Next Button */}
                  <Button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
                  >
                    Continue to the next quest
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">Uh-oh… Not quite.</h3>
                    
                    <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                      <p className="text-slate-700 text-lg mb-4">
                        Your answer shows promise, but you have not yet solved the riddle completely. Do not worry - even the greatest explorers sometimes need help.
                      </p>
                      <p className="text-slate-700 text-lg mb-6">
                        Let me give you with a little more light to help you see the path:
                      </p>
                      
                      <div className="bg-slate-600/50 rounded-xl p-4 mb-4">
                        <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-line">
                          {"🗺️ At the bottom of the world so wide, where snowy silence grows.\n" +
                           "🏔️ Mountains sleep beneath the ice, where hidden fire glows.\n" +
                           "☀️ The sun may shine for weeks on end, then vanish from the sky.\n" +
                           "🌌 And glowing lights in purple-green will swirl and flicker by."}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-slate-700 text-base">
                          <span className="text-xl">🗺️</span> - Think about which continent sits at the very bottom of our planet, the farthest south you can go.
                        </p>
                        <p className="text-slate-700 text-base">
                          <span className="text-xl">🏔️</span> - This speaks of volcanoes buried under thick snow and ice. Which frozen land has volcanoes sleeping under its white blanket?
                        </p>
                        <p className="text-slate-700 text-base">
                          <span className="text-xl">☀️</span> - This describes the strange way day and night work at the bottom of the world: sometimes all light, sometimes all darkness for months at a time.
                        </p>
                        <p className="text-slate-700 text-base">
                          <span className="text-xl">🌌</span> - These are the magical dancing lights called aurora that paint the dark polar sky in beautiful colors.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <Button 
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}