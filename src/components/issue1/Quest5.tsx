import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, User } from 'lucide-react';
import { Button } from '../ui/button';
import { usePlayAuth } from '../../contexts/PlayAuthContext';
import { trackEvent, getIssueNumber } from '../../lib/mixpanel';
import { StatNotification } from '../StatNotification';

interface Quest5Props {
  onComplete: () => void;
  onBack: () => void;
}

interface GridCell {
  coordinate: string;
  value: number; // 0 = normal, 1 = ocean, 2 = dangerous, 3 = blocked
  isInRoute: boolean;
}

export function Quest5({ onComplete, onBack }: Quest5Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [currentPosition, setCurrentPosition] = useState<string>('C5'); // Start at C5
  const [directions, setDirections] = useState<string[]>([]); // Array of directions taken
  const [showResult, setShowResult] = useState(false);
  const [isValidRoute, setIsValidRoute] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });
  const [showStatAnimation, setShowStatAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Define the grid with terrain types
  const createGrid = (): GridCell[] => {
    const rows = [1, 2, 3, 4, 5, 6, 7];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const grid: GridCell[] = [];

    rows.forEach(row => {
      columns.forEach(col => {
        const coordinate = `${col}${row}`;
        let value = 0; // Default: normal

        // Define grid values
        if (coordinate === 'C4') {
          value = 3; // Blocked (Mount Vinson)
        } else if (
          coordinate === 'A1' || coordinate === 'A2' || coordinate === 'A3' || coordinate === 'A4' || coordinate === 'A5' || coordinate === 'A6' || coordinate === 'A7' ||
          coordinate === 'B1' || coordinate === 'B2' || coordinate === 'B3' || coordinate === 'B4' || coordinate === 'B5' || coordinate === 'B6' || coordinate === 'B7' ||
          coordinate === 'C1' || coordinate === 'C2' || coordinate === 'C3' || coordinate === 'C7' ||
          coordinate === 'D1' || coordinate === 'D3' || coordinate === 'D7' ||
          coordinate === 'E5' || coordinate === 'E6' || coordinate === 'E7' ||
          coordinate === 'G1' ||
          coordinate === 'H1' || coordinate === 'H3' ||
          coordinate === 'I1' || coordinate === 'I2' || coordinate === 'I3' || coordinate === 'I6' || coordinate === 'I7' ||
          coordinate === 'J1' || coordinate === 'J2' || coordinate === 'J3' || coordinate === 'J4' || coordinate === 'J5' || coordinate === 'J6' || coordinate === 'J7'
        ) {
          value = 1; // Ocean
        }

        grid.push({
          coordinate,
          value,
          isInRoute: false // Don't show any grid initially, just the person
        });
      });
    });

    return grid;
  };

  const [grid, setGrid] = useState<GridCell[]>(createGrid());
  const [routePath, setRoutePath] = useState<string[]>(['C5']); // Track the full route path

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent('Quest Started', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 5,
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

  // Convert coordinate to position
  const coordinateToPosition = (coord: string) => {
    const col = coord.charCodeAt(0) - 65; // A=0, B=1, etc.
    const row = parseInt(coord[1]) - 1; // 1=0, 2=1, etc.
    return { col, row };
  };

  // Convert position to coordinate
  const positionToCoordinate = (col: number, row: number) => {
    return `${String.fromCharCode(65 + col)}${row + 1}`;
  };

  // Move in a direction
  const moveInDirection = (direction: string) => {
    const { col, row } = coordinateToPosition(currentPosition);
    let newCol = col;
    let newRow = row;

    switch (direction) {
      case 'North':
        newRow = row - 1;
        break;
      case 'South':
        newRow = row + 1;
        break;
      case 'East':
        newCol = col + 1;
        break;
      case 'West':
        newCol = col - 1;
        break;
    }

    // Check if new position is valid
    if (newCol >= 0 && newCol < 10 && newRow >= 0 && newRow < 7) {
      const newCoord = positionToCoordinate(newCol, newRow);
      const cell = grid.find(c => c.coordinate === newCoord);
      
      if (cell && cell.value !== 1 && cell.value !== 3) { // Not ocean and not Mount Vinson
        setCurrentPosition(newCoord);
        setDirections([...directions, direction]);
        
        // Add new position to route path
        const newRoutePath = [...routePath, newCoord];
        setRoutePath(newRoutePath);
        
        // Update grid to show only the route path
        const newGrid = grid.map(cell => ({
          ...cell,
          isInRoute: newRoutePath.includes(cell.coordinate)
        }));
        setGrid(newGrid);
        
        // Clear any error message
        setErrorMessage('');
        
        // Track direction selection
        trackEvent('Quest Answer Selected', {
          issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
          questNumber: 5,
          trainerId: currentTrainer?.uid,
          trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
          trainerAge: currentTrainer?.age,
          trainerStats: currentTrainer?.stats,
          questStartTime: questStartTime,
          eventTime: Date.now(),
          optionType: 'direction',
          selectedAnswer: direction,
          currentPosition: newCoord
        });
      } else {
        // Show error message based on obstacle type
        if (cell?.value === 1) {
          setErrorMessage('You cannot leave Antarctica and travel over the ocean.');
        } else if (cell?.value === 3) {
          setErrorMessage('You and Lumino are too weak to climb over Mount Vinson, so you must go around it.');
        } else {
          setErrorMessage('You cannot move there!');
        }
        
        // Hide error message after 3 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } else {
      // Out of bounds
      setErrorMessage('🚫 You cannot move outside the map!');
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  // Remove last direction
  const removeLastDirection = () => {
    if (directions.length > 0) {
      const newDirections = directions.slice(0, -1);
      setDirections(newDirections);
      
      // Recalculate position from start
      let pos = { col: 2, row: 4 }; // Start at C5
      const newRoutePath = ['C5']; // Start with C5
      
      newDirections.forEach(dir => {
        switch (dir) {
          case 'North': pos.row -= 1; break;
          case 'South': pos.row += 1; break;
          case 'East': pos.col += 1; break;
          case 'West': pos.col -= 1; break;
        }
        newRoutePath.push(positionToCoordinate(pos.col, pos.row));
      });
      
      setCurrentPosition(positionToCoordinate(pos.col, pos.row));
      setRoutePath(newRoutePath);
      
      // Update grid to show only the new route path
      const newGrid = grid.map(cell => ({
        ...cell,
        isInRoute: newRoutePath.includes(cell.coordinate)
      }));
      setGrid(newGrid);
    }
  };

  // Handle route submission
  const handleSubmit = async () => {
    if (!currentTrainer) return;

    // Check if directions are exactly correct: East, North, East
    const correctDirections = ['East', 'North', 'East'];
    const isValid = JSON.stringify(directions) === JSON.stringify(correctDirections);
    setIsValidRoute(isValid);

    // Only apply stats and update quest progress if correct
    if (isValid) {
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
        await updateStatsAndQuestProgress(newStats, 5, directions.join(' → '));
        
        // Save attempt to Firestore
        try {
          await saveAttempt({
            trainerId: currentTrainer.uid,
            issueId: currentTrainer.currentIssue,
            questNumber: 5,
            answer: directions.join(' → '),
            answerType: 'direction_planning',
            isCorrect: isValid,
            questStartTime: new Date(questStartTime).toISOString(),
            submittedAt: new Date(completionTime).toISOString(),
            timeSpent: totalQuestTime,
            statsBefore: currentTrainer.stats,
            statsAfter: newStats
          });
        } catch (error) {
          console.error('Failed to save attempt:', error);
        }
      } catch (error) {
        console.error('Failed to update trainer stats or quest progress:', error);
        
        // Track quest completion failure
        trackEvent('Quest Completion Failed', {
          issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
          questNumber: 5,
          trainerId: currentTrainer.uid,
          trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
          trainerAge: currentTrainer.age,
          trainerStats: currentTrainer.stats,
          questStartTime: questStartTime,
          eventTime: Date.now(),
          selectedAnswer: directions.join(' → '),
          error: 'stats_update_failed',
          errorMessage: (error as any)?.message || 'Unknown error',
          totalQuestTime: totalQuestTime
        });
      }

      // Track quest completion (always track, regardless of Firebase success)
      trackEvent('Quest Completed', { 
        issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
        questNumber: 5,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: directions.join(' → '),
        statsGained: newStatChanges,
        totalQuestTime: totalQuestTime
      });
    } else {
      // Save attempt to Firestore (wrong answer)
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      
      try {
        await saveAttempt({
          trainerId: currentTrainer.uid,
          issueId: currentTrainer.currentIssue,
          questNumber: 5,
          answer: directions.join(' → '),
          answerType: 'direction_planning',
          isCorrect: isValid,
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
      trackEvent('Quest Failed', { 
        issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
        questNumber: 5,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: directions.join(' → '),
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

  const handleReset = () => {
    // Track retry attempt
    trackEvent('Quest Retried', {
      issueNumber: getIssueNumber(currentTrainer?.currentIssue || "issue1"),
      questNumber: 5,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now()
    });
    
    setCurrentPosition('C5');
    setDirections([]);
    setRoutePath(['C5']);
    setShowResult(false);
    setIsValidRoute(false);
    
    // Reset grid to show only C5
    const resetGrid = createGrid();
    setGrid(resetGrid);
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
                <h2 className="font-gagalin text-4xl text-slate-800 mb-4 bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                  Quest 5: Navigate to the South Pole
                </h2>
              </div>

              {/* Instructions */}
              <div className="text-left mb-6">
                <div className="bg-white/60 rounded-2xl p-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl font-semibold text-center mb-4">
                    Plan Your Route to the South Pole
                  </h2>
                  <p className="text-slate-600 text-lg text-center mb-4">
                    Use the direction buttons to move step by step. Each click moves one grid cell in that direction.
                  </p>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="relative mb-6">
                <div className="relative mx-auto max-w-4xl">
                  {/* Map Image */}
                  <img 
                    src="/issues/issue1/map.png" 
                    alt="Antarctica Map" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  
                  {/* Grid Overlay - Only show cells in the route */}
                  <div className="absolute inset-0">
                    {/* Show route cells */}
                    {grid.filter(cell => cell.isInRoute).map((cell) => {
                      const { col, row } = coordinateToPosition(cell.coordinate);
                      // Use the same positioning as Quest4 that matches map.png
                      const left = (col * 9) + 5; // Same as Quest4
                      const top = (row * 12.5) + 5; // Same as Quest4
                      
                      return (
                        <div
                          key={cell.coordinate}
                          className={`absolute border border-slate-400/50 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            cell.isInRoute 
                              ? 'bg-green-500/30 border-2 border-green-400 shadow-lg shadow-green-500/25' 
                              : cell.value === 1 
                                ? 'bg-blue-500/20 border-blue-300' 
                                : cell.value === 3 
                                  ? 'bg-red-500/20 border-red-300' 
                                  : 'bg-white/20 hover:bg-blue-500/20'
                          }`}
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: '8%',
                            height: '10%',
                            borderRadius: '4px'
                          }}
                        >
                          {cell.coordinate === currentPosition && (
                            <div className="w-10 h-10 bg-green-400 rounded-full border-2 border-green-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-green-800" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Always show person icon at current position, even if no grid cell */}
                    {!grid.find(cell => cell.coordinate === currentPosition && cell.isInRoute) && (
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `${(coordinateToPosition(currentPosition).col * 9) + 5}%`,
                          top: `${(coordinateToPosition(currentPosition).row * 12.5) + 5}%`,
                          width: '8%',
                          height: '10%'
                        }}
                      >
                        <div className="w-10 h-10 bg-green-400 rounded-full border-2 border-green-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-green-800" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Direction Controls */}
              <div className="bg-white/60 rounded-2xl p-6 border border-blue-300/50 mb-6">
                {/* Dynamic Header - Error Message or Choose Direction */}
                {errorMessage ? (
                  <h3 className="text-xl font-semibold text-red-600 text-center mb-4">
                    {errorMessage}
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold text-slate-800 text-center mb-4">Choose Direction</h3>
                )}
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <Button
                    onClick={() => moveInDirection('North')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    ↑ North
                  </Button>
                  <Button
                    onClick={() => moveInDirection('South')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    ↓ South
                  </Button>
                  <Button
                    onClick={() => moveInDirection('West')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    ← West
                  </Button>
                  <Button
                    onClick={() => moveInDirection('East')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    → East
                  </Button>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={removeLastDirection}
                    disabled={directions.length === 0}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Undo Last
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-gray-500/30 transition-all duration-300"
                  >
                    Reset Route
                  </Button>
                </div>
              </div>

              {/* Current Position and Directions */}
              <div className="bg-blue-100 rounded-lg p-4 border border-blue-300 mb-6">
                <p className="text-slate-800 text-lg font-semibold text-center">
                  Current Position: <span className="text-blue-600 font-bold text-xl">{currentPosition}</span>
                </p>
                <p className="text-slate-600 text-lg text-center mt-2">
                  Directions taken: {directions.length > 0 ? directions.join(' → ') : 'None yet'}
                </p>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={directions.length === 0}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
                >
                  Submit Route
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-left">
              {isValidRoute ? (
                <>
                  <div className="mb-6">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <h3 className="text-3xl font-bold text-slate-800">🎉 Excellent Navigation!</h3>
                        <StatNotification 
                          show={showStatAnimation} 
                          statChanges={statChanges} 
                        />
                      </div>
                      <div className="mb-6">
                        <img 
                          src="/issues/issue1/antartica_map.gif" 
                          alt="Antarctica Map" 
                          className="mx-auto max-w-md w-100"
                        />
                      </div>
                    
                    <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                        <p className="font-arimo text-slate-700 text-lg mb-2">
                          <span className="text-slate-800 font-semibold">Your Route:</span> {directions.join(' → ')}
                        </p>
                        <p className="font-arimo text-slate-700 text-lg mb-4">
                          <span className="text-slate-800 font-semibold">Route Length:</span> {directions.length} steps
                        </p>
                      <p className="font-arimo text-slate-700 text-lg mb-4">You have proven your <span className="text-yellow-600 font-bold text-xl">WISDOM</span>.</p>
                      <p className="font-arimo text-slate-700 text-lg mb-4">
                        Lumino looks at you with new respect. You have shown your ability to think clearly and solve problems even under pressure.
                      </p>
                      <p className="font-arimo text-slate-700 text-lg">
                        One last challenge lies ahead on your path to becoming a true Kowai Trainer. You are very close.
                      </p>
                    </div>
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
                      <p className="text-blue-100 text-lg font-semibold">
                        Go back and keep reading until you reach the next quest!
                      </p>
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
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">Uh-oh… the path you chose took a strange turn.</h3>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      You bravely followed the direction you picked, but suddenly, a swirling black wind rose from the ground like a tornado. Before you could react, it pulled you in… a spinning, twisting black hole!
                    </p>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      Just when it felt like all hope was lost, a majestic dragon-shaped Kowai burst through the storm. With a roar that shook the sky, it swooped in and caught you on its back.
                    </p>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      As it flew you safely back toward land, your eyes grew heavy… the world blurred… and you slowly drifted off.
                    </p>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      But before sleep took over, one thought stayed clear in your mind: 
                    </p>
                    <p className="font-arimo text-slate-700 text-lg mb-6">
                      You made the wrong choice — and you'll need to try again.
                    </p>
                    <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                       <p className="font-arimo text-slate-700 text-lg mb-2">
                         <span className="text-slate-800 font-semibold">Your Route:</span> {directions.join(' → ')}
                       </p>
                       <p className="font-arimo text-slate-700 text-lg">
                         <span className="text-slate-800 font-semibold">Route Length:</span> {directions.length} steps
                       </p>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <div className="text-center">
                    <Button 
                      onClick={handleReset}
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