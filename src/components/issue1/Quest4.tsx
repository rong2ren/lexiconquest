import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { usePlayAuth } from '../../contexts/PlayAuthContext';
import { trackEvent, getIssueNumber } from '../../lib/mixpanel';
import { StatNotification } from '../StatNotification';

interface Quest4Props {
  onComplete: () => void;
  onBack: () => void;
}

export function Quest4({ onComplete, onBack }: Quest4Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [selectedCoordinate, setSelectedCoordinate] = useState<string | null>(null);
  const [inputCoordinate, setInputCoordinate] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });
  const [showStatAnimation, setShowStatAnimation] = useState(false);

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent('Quest Started', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 4,
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

  const handleCoordinateSelect = (coordinate: string) => {
    setSelectedCoordinate(coordinate);
    
    // Track coordinate selection with detailed context
    trackEvent('Quest Answer Selected', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 4,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now(),
      optionType: 'coordinate',
      selectedAnswer: coordinate
    });
  };

  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setInputCoordinate(upperValue);
    setInputError(''); // Clear any previous errors
    
    // Validate and set coordinate if it's a valid format
    if (upperValue.length === 2) {
      const col = upperValue[0];
      const row = upperValue[1];
      
      if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(col)) {
        setInputError('Invalid column. Use A-J');
        return;
      }
      
      if (!['1', '2', '3', '4', '5', '6', '7'].includes(row)) {
        setInputError('Invalid row. Use 1-7');
        return;
      }
      
      // Valid coordinate
      handleCoordinateSelect(upperValue);
    } else if (upperValue.length > 2) {
      setInputError('Coordinate must be 2 characters (e.g., C5)');
    }
  };

  const handleSubmit = async () => {
    if (!selectedCoordinate || !currentTrainer) return;

    const correct = selectedCoordinate === 'C5';
    setIsCorrect(correct);

    // Only apply stats and update quest progress if correct
    if (correct) {
      const newStatChanges = { bravery: 0, wisdom: 3, curiosity: 0, empathy: 0 };
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
        await updateStatsAndQuestProgress(newStats, 4, selectedCoordinate);
        
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
      } catch (error) {
        console.error('Failed to update trainer stats or quest progress:', error);
        
        // Track quest completion failure
        trackEvent('Quest Completion Failed', {
          issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
          questNumber: 4,
          trainerId: currentTrainer.uid,
          trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
          trainerAge: currentTrainer.age,
          trainerStats: currentTrainer.stats,
          questStartTime: questStartTime,
          eventTime: Date.now(),
          selectedAnswer: selectedCoordinate,
          error: 'stats_update_failed',
          errorMessage: (error as any)?.message || 'Unknown error',
          totalQuestTime: totalQuestTime
        });
      }

      // Track quest completion (always track, regardless of Firebase success)
      trackEvent('Quest Completed', { 
        issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
        questNumber: 4,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: selectedCoordinate,
        statsGained: newStatChanges,
        totalQuestTime: totalQuestTime
      });
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
      trackEvent('Quest Failed', { 
        issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
        questNumber: 4,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: selectedCoordinate,
        totalQuestTime: totalQuestTime
      });
    }

    // Show result and stat animation (regardless of correct/incorrect)
    setShowResult(true);
    setShowStatAnimation(true);

    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowStatAnimation(false);
    }, 3000);
  };

  const handleNext = () => {
    // Just move to the next quest (no Firebase updates)
    onComplete();
  };

  const handleTryAgain = () => {
    // Track retry attempt
    trackEvent('Quest Retried', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 4,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now()
    });
    
    setShowResult(false);
    setSelectedCoordinate(null);
    setInputCoordinate('');
    setInputError('');
    setIsCorrect(false);
  };

  // Generate grid coordinates
  const rows = [1, 2, 3, 4, 5, 6, 7];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
                <h2 className="font-gagalin text-4xl text-slate-800 mb-4 bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  Quest 4: Find Your Exact Position
                </h2>
              </div>

              {/* Question */}
              <div className="text-left mb-12">
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl mb-4 font-semibold">
                    The Lumino is lost in the vast, snowy wilderness of Antarctica. To help it reach the South Pole safely, you need to figure out your exact starting point on the map.
                  </h2>
                  <p className="font-arimo text-slate-700 text-lg">
                    Which grid coordinate are you standing on right now?
                  </p>
                </div>
              </div>

              {/* Mobile: Input Interface */}
              <div className="md:hidden mb-8">
                <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/30">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Enter Your Coordinate</h3>
                    <p className="text-slate-200 text-sm mb-6">
                      Type the coordinate where you're standing (e.g., A1)
                    </p>
                    <div className="max-w-xs mx-auto">
                      <Input
                        type="text"
                        value={inputCoordinate}
                        onChange={(e) => handleInputChange(e.target.value)}
                        maxLength={2}
                        className={`text-center text-lg font-mono uppercase tracking-wider bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 ${
                          inputError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                      />
                      {inputError && (
                        <p className="text-red-400 text-sm mt-2">
                          {inputError}
                        </p>
                      )}
                      {selectedCoordinate && !inputError && (
                        <p className="text-purple-400 text-sm mt-2">
                          Selected: {selectedCoordinate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="relative mb-8">
                <div className="relative mx-auto max-w-4xl">
                  {/* Map Image */}
                  <img 
                    src="/issues/issue1/map.png" 
                    alt="Antarctica Map" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  
                  {/* Clickable Grid Overlays */}
                  {rows.map((row) => 
                    columns.map((col) => {
                      const coordinate = `${col}${row}`;
                      const isCorrect = coordinate === 'D4'; // The correct answer
                      
                      return (
                        <button
                          key={coordinate}
                          onClick={() => handleCoordinateSelect(coordinate)}
                          className={`absolute cursor-pointer transition-all duration-300 ${
                            selectedCoordinate === coordinate
                              ? isCorrect 
                                ? 'bg-green-500/30 border-2 border-green-400 shadow-lg shadow-green-500/25'
                                : 'bg-red-500/30 border-2 border-red-400 shadow-lg shadow-red-500/25'
                              : 'hover:bg-blue-500/20 hover:border-2 hover:border-blue-400'
                          }`}
                          style={{
                            // Position each grid cell on the map
                            top: `${(row - 1) * 12.5 + 5}%`,
                            left: `${(col.charCodeAt(0) - 65) * 9 + 5}%`,
                            width: '8%',
                            height: '10%',
                            borderRadius: '4px'
                          }}
                          title={`Grid coordinate: ${coordinate}`}
                        />
                      );
                    })
                  )}
                </div>
                
                {/* Selected Coordinate Display */}
                <div className="mt-4 text-center">
                  {selectedCoordinate ? (
                    <div className="bg-blue-100 rounded-lg p-4 border border-blue-300">
                      <p className="text-slate-800 text-lg font-semibold">
                        Selected Coordinate: <span className="text-blue-600 font-bold text-xl">{selectedCoordinate}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-lg">
                      Click on the map to select your grid coordinate
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedCoordinate}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-left">
              {isCorrect ? (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <h3 className="text-3xl font-bold text-slate-800">🎉 Awesome work!</h3>
                      <StatNotification 
                        show={showStatAnimation} 
                        statChanges={statChanges} 
                      />
                    </div>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      You've successfully found your exact position in Antarctica. Now that you know where you are, it's time for your next challenge.
                    </p>
                  </div>

                  {/* Stats Gained */}
                  <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
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

                  {/* Reading Instruction */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-6 border border-blue-500/30">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">📘</span>
                      <span className="text-slate-800 text-lg font-semibold">
                        Go back and keep reading until you reach the next quest!
                      </span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="text-center">
                    <Button 
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3"
                    >
                      Continue to Next Page
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">Uh-oh… Not quite.</h3>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      That's not the correct coordinate. Look carefully at the grid and try to find the right position. 
                      Remember, you need to identify exactly where you're standing on the map to help the Lumino navigate safely.
                    </p>
                    
                    {/* Detailed Hints */}
                    <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                      <h4 className="text-xl font-semibold text-slate-800 mb-4">Let me help you with some clearer directions:</h4>
                      <div className="space-y-4 font-arimo text-slate-700 text-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🧭</span>
                          <p>Remember that North is at the top of your map, South is at the bottom, East is to the right, and West is to the left.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🏔️</span>
                          <p>If you see Mount Vinson to your North, that means you are standing SOUTH of Mount Vinson. Find Mount Vinson on your map, then look at the grid numbers that are below it on your map.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🌋</span>
                          <p>If you see Mount Sidley to your South East, that means you are standing NORTHWEST of Mount Sidley. Find Mount Sidley on your map, then look for grid numbers that are on the left and above it.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">🎯</span>
                          <p>Look for the spot where these two areas overlap on your map. That's where you are right now.</p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-blue-600/20 rounded-xl border border-blue-500/30">
                        <p className="text-slate-800 text-lg font-semibold font-arimo">
                          Now, young explorer, look at your Antarctica maps again. Which spot do the above two areas overlap?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <div className="text-center">
                    <Button 
                      onClick={handleTryAgain}
                      className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 cursor-pointer"
                    >
                      Try Again
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
