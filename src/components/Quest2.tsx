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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
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
            <h1 className="text-2xl font-bold text-white">Quest 2: Find the Continent</h1>
            <p className="text-slate-300">Solve the riddle to discover your destination</p>
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
              {/* Riddle */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-6">The Riddle</h2>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                    {"At the bottom of the world so wide, where snowy silence grows.\n" +
                     "Mountains sleep beneath the ice, where hidden fire glows.\n" +
                     "The sun may shine for weeks on end, then vanish from the sky.\n" +
                     "And glowing lights in purple-green will swirl and flicker by."}
                  </p>
                </div>
                <p className="text-slate-300 text-lg">
                  Question: Which continent the magic has brought you to?
                </p>
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
                    className={`p-4 rounded-lg text-center transition-all duration-200 ${
                      selectedContinent === continent.toLowerCase().replace(' ', '_')
                        ? 'bg-blue-600 border-2 border-blue-500'
                        : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-white font-medium">{continent}</p>
                  </motion.button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedContinent}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
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
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-2xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Congratulations, Explorer!</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      You have proven your <span className="text-green-400 font-semibold">CURIOSITY</span>.
                    </p>
                    <p className="text-slate-300 mb-6">
                      You looked at the clues, studied the world, and found the answers hidden in the frozen land of Antarctica. 
                      This is exactly the kind of thinking that separates true Kowai Trainers from ordinary people.
                    </p>
                    <p className="text-slate-300 mb-6">
                      But do not celebrate too long, for your trials have only just begun. 
                      Three greater challenges still lie ahead of you, each one designed to test a different part of your character.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                      <span className="text-xl">📘</span>
                      <span>Go back and keep reading until you reach the next quest!</span>
                    </div>
                  </div>

                  {/* Stats Gained */}
                  <div className="bg-slate-700 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Stats Gained:</h4>
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center gap-2 bg-slate-600 rounded-lg p-3">
                        <span className="text-green-400">🔍</span>
                        <span className="text-white">Curiosity: +3</span>
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
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-2xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Uh-oh… Not quite.</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      Check your map, read the riddle again, and give it another try!
                    </p>
                  </div>

                  {/* Try Again Button */}
                  <Button 
                    onClick={handleTryAgain}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold"
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