import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest4Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest4({ onComplete, onBack }: Quest4Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [selectedCoordinate, setSelectedCoordinate] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [coordinateSelectionTime, setCoordinateSelectionTime] = useState<number | null>(null);
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 4 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  const handleCoordinateSelect = (coordinate: string) => {
    setSelectedCoordinate(coordinate);
    const selectionTime = Date.now();
    setCoordinateSelectionTime(selectionTime);
    
    // Track coordinate selection with detailed context
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 4 Coordinate Selected`, {
      coordinate: coordinate,
      selectionTime: selectionTime - questStartTime, // Time to decide in ms
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  };

  const handleSubmit = async () => {
    if (!selectedCoordinate || !currentTrainer) return;

    const correct = selectedCoordinate === 'C5';
    setIsCorrect(correct);

    // Only apply stats and update quest progress if correct
    if (correct) {
      const newStatChanges = { bravery: 2, wisdom: 4, curiosity: 3, empathy: 1 };
      setStatChanges(newStatChanges);

      const newStats = {
        bravery: currentTrainer.stats.bravery + newStatChanges.bravery,
        wisdom: currentTrainer.stats.wisdom + newStatChanges.wisdom,
        curiosity: currentTrainer.stats.curiosity + newStatChanges.curiosity,
        empathy: currentTrainer.stats.empathy + newStatChanges.empathy,
      };

      try {
        // Update stats and quest progress in a single Firebase call
        await updateStatsAndQuestProgress(newStats, 4, selectedCoordinate);
        
        const completionTime = Date.now();
        const totalQuestTime = completionTime - questStartTime;
        const readingTime = coordinateSelectionTime ? coordinateSelectionTime - questStartTime : null;
        const decisionTime = coordinateSelectionTime ? completionTime - coordinateSelectionTime : null;
        
        // Save attempt to Firestore
        await saveAttempt({
          trainerId: currentTrainer.uid,
          issueId: currentTrainer.currentIssue,
          questNumber: 4,
          answer: selectedCoordinate,
          answerType: 'coordinate',
          isCorrect: correct,
          questStartTime: new Date(questStartTime).toISOString(),
          submittedAt: new Date(completionTime).toISOString(),
          timeSpent: totalQuestTime,
          statsBefore: currentTrainer.stats,
          statsAfter: newStats
        });
        
        // Track quest completion
        trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 4 Completed`, { 
          coordinate: selectedCoordinate,
          correct: correct,
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
      } catch (error) {
        console.error('Failed to update trainer stats or quest progress:', error);
      }
    } else {
      // Save attempt to Firestore (wrong answer)
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      
      await saveAttempt({
        trainerId: currentTrainer.uid,
        issueId: currentTrainer.currentIssue,
        questNumber: 4,
        answer: selectedCoordinate,
        answerType: 'coordinate',
        isCorrect: correct,
        questStartTime: new Date(questStartTime).toISOString(),
        submittedAt: new Date(completionTime).toISOString(),
        timeSpent: totalQuestTime,
        statsBefore: currentTrainer.stats,
        statsAfter: currentTrainer.stats // No stats change for wrong answer
      });

      // Track wrong answer (no stats or quest progress)
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 4 Wrong Answer`, { 
        coordinate: selectedCoordinate,
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
    setShowResult(false);
    setSelectedCoordinate(null);
    setIsCorrect(false);
    setCoordinateSelectionTime(null);
  };

  // Generate grid coordinates
  const rows = [1, 2, 3, 4, 5, 6, 7];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4">
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
            <h1 className="text-2xl font-bold text-white">Quest 4: Find Your Exact Position</h1>
            <p className="text-slate-300">Locate your coordinates on the map</p>
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
                <h2 className="text-xl font-bold text-white mb-6">Coordinate Navigation</h2>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 text-lg leading-relaxed mb-4">
                    The Lumino is lost in the vast, snowy wilderness of Antarctica. To help it reach the South Pole safely, you need to figure out your exact starting point on the map.
                  </p>
                  <p className="text-slate-300 text-lg font-semibold">
                    Question: Which grid coordinate are you standing on right now?
                  </p>
                </div>
              </div>

              {/* Coordinate Grid */}
              <div className="mb-8">
                <div className="bg-slate-700 rounded-lg p-6">
                  <div className="grid grid-cols-11 gap-1 max-w-fit mx-auto">
                    {/* Empty top-left corner */}
                    <div className="w-8 h-8"></div>
                    
                    {/* Column headers */}
                    {columns.map((col) => (
                      <div key={col} className="w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                        {col}
                      </div>
                    ))}
                    
                    {/* Grid cells */}
                    {rows.map((row) => (
                      <div key={row} className="contents">
                        {/* Row header */}
                        <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                          {row}
                        </div>
                        
                        {/* Grid cells for this row */}
                        {columns.map((col) => {
                          const coordinate = `${col}${row}`;
                          return (
                            <motion.button
                              key={coordinate}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCoordinateSelect(coordinate)}
                              className={`w-8 h-8 rounded border-2 transition-all duration-200 ${
                                selectedCoordinate === coordinate
                                  ? 'bg-cyan-500 border-cyan-400'
                                  : 'bg-slate-600 border-slate-500 hover:border-slate-400'
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedCoordinate}
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
                    <h3 className="text-2xl font-bold text-white mb-4">Excellent Navigation!</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      Perfect! You've correctly identified your position at coordinate {selectedCoordinate}. 
                      The Lumino can now follow your precise directions to reach the South Pole safely. 
                      Your map-reading skills and attention to detail have saved the day!
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
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-2xl">❌</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Not Quite Right</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      That's not the correct coordinate. Look carefully at the grid and try to find the right position. 
                      Remember, you need to identify exactly where you're standing on the map to help the Lumino navigate safely.
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
