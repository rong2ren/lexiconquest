import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { trackEvent } from '../lib/mixpanel';

interface Quest5Props {
  onComplete: () => void;
  onBack: () => void;
}

interface GridCell {
  coordinate: string;
  value: number; // 0 = normal, 1 = ocean, 2 = monster/storm, 3 = start, 4 = end
  isInRoute: boolean;
}

export function Quest5({ onComplete, onBack }: Quest5Props) {
  const { currentTrainer, updateStatsAndQuestProgress, saveAttempt } = usePlayAuth();
  const [route, setRoute] = useState<string[]>(['C5']); // Start at C5
  const [showResult, setShowResult] = useState(false);
  const [isValidRoute, setIsValidRoute] = useState(false);
  const [questStartTime] = useState(Date.now());
  const [routeStartTime, setRouteStartTime] = useState<number | null>(null);
  const [statChanges, setStatChanges] = useState({ bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 });

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
        if (coordinate === 'C5') {
          value = 3; // Start point
        } else if (coordinate === 'E4') {
          value = 4; // End point (South Pole)
        } else if (coordinate === 'C4') {
          value = 5; // Mount Vinson (blocked)
        } else if (
          // Monster/Storm areas (dangerous but passable)
          coordinate === 'D4' || coordinate === 'E3' || coordinate === 'H4'
        ) {
          value = 2; // Monster/Storm
        } else if (
          // Ocean areas (not accessible)
          (col === 'A' && coordinate !== 'A2') || // Column A except A2
          col === 'J' || // Column J
          coordinate === 'B1' || coordinate === 'B2' || coordinate === 'B6' || coordinate === 'B7' ||
          coordinate === 'C1' || coordinate === 'C2' || coordinate === 'C7' ||
          coordinate === 'D1' || coordinate === 'D7' ||
          coordinate === 'E6' || coordinate === 'E7' ||
          coordinate === 'H1' ||
          coordinate === 'I2' || coordinate === 'I7' ||
          coordinate === 'J1' || coordinate === 'J2' || coordinate === 'J3'
        ) {
          value = 1; // Ocean
        }

        grid.push({
          coordinate,
          value,
          isInRoute: coordinate === 'C5'
        });
      });
    });

    return grid;
  };

  const [grid, setGrid] = useState<GridCell[]>(createGrid());

  // Track quest start when component mounts
  useEffect(() => {
    trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 5 Started`, {
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerBirthday: currentTrainer?.birthday,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime
    });
  }, []);

  // Check if two coordinates are adjacent
  const areAdjacent = (coord1: string, coord2: string): boolean => {
    const [col1, row1] = [coord1[0], parseInt(coord1[1])];
    const [col2, row2] = [coord2[0], parseInt(coord2[1])];
    
    const colDiff = Math.abs(col1.charCodeAt(0) - col2.charCodeAt(0));
    const rowDiff = Math.abs(row1 - row2);
    
    // Adjacent if they differ by 1 in either row or column (not both)
    return (colDiff === 1 && rowDiff === 0) || (colDiff === 0 && rowDiff === 1);
  };

  // Handle cell click for route building
  const handleCellClick = (coordinate: string) => {
    const cell = grid.find(c => c.coordinate === coordinate);
    if (!cell) return;

    // Show warning popups for dangerous/blocked areas
    if (cell.value === 2) {
      alert('⚠️ Warning! This area contains dangerous monsters or storms. You can still pass through, but be extra careful!');
      // Continue to add to route (dangerous but passable)
    }
    if (cell.value === 5) {
      alert('⚠️ Warning! Mount Vinson is too steep to climb. You must go around it!');
      return; // Don't add to route (impassable)
    }
    if (cell.value === 1) {
      return; // Ocean - can't click, no popup needed (impassable)
    }

    const lastCoordinate = route[route.length - 1];
    
    // If clicking the last coordinate, remove it (undo)
    if (coordinate === lastCoordinate && route.length > 1) {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      updateGridRoute(newRoute);
      return;
    }

    // If clicking an adjacent cell, add it to route
    if (areAdjacent(lastCoordinate, coordinate)) {
      const newRoute = [...route, coordinate];
      setRoute(newRoute);
      updateGridRoute(newRoute);
      
      // Track route building
      if (!routeStartTime) {
        setRouteStartTime(Date.now());
      }
      
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 5 Route Cell Added`, {
        coordinate: coordinate,
        routeLength: newRoute.length,
        trainerId: currentTrainer?.uid,
        trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
        trainerBirthday: currentTrainer?.birthday,
        trainerStats: currentTrainer?.stats,
        questStartTime: questStartTime
      });
    }
  };

  // Update grid to show current route
  const updateGridRoute = (newRoute: string[]) => {
    setGrid(prevGrid => 
      prevGrid.map(cell => ({
        ...cell,
        isInRoute: newRoute.includes(cell.coordinate)
      }))
    );
  };

  // Validate the route
  const validateRoute = (routeToValidate: string[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if route starts at C5
    if (routeToValidate[0] !== 'C5') {
      errors.push('Route must start at C5');
    }
    
    // Check if route ends at South Pole (E4)
    if (routeToValidate[routeToValidate.length - 1] !== 'E4') {
      errors.push('Route must end at the South Pole (E4)');
    }
    
    // Check if all moves are adjacent
    for (let i = 1; i < routeToValidate.length; i++) {
      if (!areAdjacent(routeToValidate[i - 1], routeToValidate[i])) {
        errors.push('Route must follow grid lines (no diagonal moves)');
        break;
      }
    }
    
    // Check if route goes through inaccessible areas (ocean or monster/storm)
    for (const coordinate of routeToValidate) {
      const cell = grid.find(c => c.coordinate === coordinate);
      if (cell && (cell.value === 1 || cell.value === 2)) {
        if (cell.value === 1) {
          errors.push('Route cannot go through ocean areas');
        } else if (cell.value === 2) {
          errors.push('Route cannot go through monster/storm areas');
        }
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle route submission
  const handleSubmit = async () => {
    if (!currentTrainer) return;

    const validation = validateRoute(route);
    setIsValidRoute(validation.isValid);

    // Only apply stats and update quest progress if route is valid
    if (validation.isValid) {
      // Calculate stats based on route quality
      let newStatChanges = { bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 };
      
      const routeLength = route.length;
      if (routeLength <= 8) {
        // Excellent route
        newStatChanges = { bravery: 3, wisdom: 5, curiosity: 4, empathy: 2 };
      } else if (routeLength <= 12) {
        // Good route
        newStatChanges = { bravery: 2, wisdom: 3, curiosity: 3, empathy: 1 };
      } else {
        // Acceptable route
        newStatChanges = { bravery: 1, wisdom: 2, curiosity: 2, empathy: 1 };
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
        await updateStatsAndQuestProgress(newStats, 5, route);
        
        const completionTime = Date.now();
        const totalQuestTime = completionTime - questStartTime;
        const planningTime = routeStartTime ? routeStartTime - questStartTime : null;
        const executionTime = routeStartTime ? completionTime - routeStartTime : null;
        
        // Save attempt to Firestore
        await saveAttempt({
          trainerId: currentTrainer.uid,
          issueId: currentTrainer.currentIssue,
          questNumber: 5,
          answer: route,
          answerType: 'route',
          isCorrect: validation.isValid,
          questStartTime: new Date(questStartTime).toISOString(),
          submittedAt: new Date(completionTime).toISOString(),
          timeSpent: totalQuestTime,
          statsBefore: currentTrainer.stats,
          statsAfter: newStats
        });
        
        // Track quest completion
        trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 5 Completed`, { 
          route: route,
          routeLength: route.length,
          isValid: validation.isValid,
          errors: validation.errors,
          statsGained: newStatChanges,
          totalQuestTime: totalQuestTime,
          planningTime: planningTime,
          executionTime: executionTime,
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
      // Save attempt to Firestore (invalid route)
      const completionTime = Date.now();
      const totalQuestTime = completionTime - questStartTime;
      
      await saveAttempt({
        trainerId: currentTrainer.uid,
        issueId: currentTrainer.currentIssue,
        questNumber: 5,
        answer: route,
        answerType: 'route',
        isCorrect: validation.isValid,
        questStartTime: new Date(questStartTime).toISOString(),
        submittedAt: new Date(completionTime).toISOString(),
        timeSpent: totalQuestTime,
        statsBefore: currentTrainer.stats,
        statsAfter: currentTrainer.stats // No stats change for invalid route
      });

      // Track invalid route (no stats or quest progress)
      trackEvent(`${currentTrainer?.firstName} ${currentTrainer?.lastName} Issue 1 Quest 5 Invalid Route`, { 
        route: route,
        routeLength: route.length,
        errors: validation.errors,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerBirthday: currentTrainer.birthday,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        submissionTime: Date.now()
      });
    }

    // Show result (regardless of valid/invalid)
    setShowResult(true);
  };

  const handleNext = () => {
    // Just move to the next quest (no Firebase updates)
    onComplete();
  };

  const handleReset = () => {
    setRoute(['C5']);
    updateGridRoute(['C5']);
    setShowResult(false);
    setIsValidRoute(false);
    setRouteStartTime(null);
  };

  // Get cell styling based on terrain and route status
  const getCellStyle = () => {
    return 'w-12 h-12 rounded-lg';
  };

  const getCellInlineStyle = (cell: GridCell) => {
    // Check route first (highest priority) - same as starting point
    if (cell.isInRoute) {
      return { 
        '--border-color': 'rgba(22, 163, 74, 0.9)',
        '--border-width': '3px',
        borderColor: 'var(--border-color)',
        borderWidth: 'var(--border-width)',
        backgroundColor: 'rgba(22, 163, 74, 0.3)',
        boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)'
      }; // Route - Same as starting point
    }
    // Then check starting point
    else if (cell.value === 3) {
      return { 
        '--border-color': 'rgba(22, 163, 74, 0.9)',
        '--border-width': '3px',
        borderColor: 'var(--border-color)',
        borderWidth: 'var(--border-width)',
        backgroundColor: 'rgba(22, 163, 74, 0.3)',
        boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)'
      }; // Start point - Green background with border and glow
    } 
    // All other cells - no background, no border
    else {
      return { 
        backgroundColor: 'transparent',
        border: 'none',
        cursor: cell.value === 1 ? 'not-allowed' : 'pointer'
      }; // All other cells - clean, no borders
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      <style>{`
        .grid-cell:hover {
          --border-color: rgba(255, 255, 255, 0.8) !important;
          --border-width: 4px !important;
        }
        .grid-cell[disabled]:hover {
          --border-color: rgba(255, 255, 255, 0.2) !important;
          --border-width: 1px !important;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-2xl font-bold text-white">Quest 5: Plan the Route</h1>
            <p className="text-slate-300">Find the shortest path to save Lumino</p>
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
              {/* Instructions */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-6">Route Planning Challenge</h2>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <p className="text-slate-300 text-lg leading-relaxed mb-4">
                    Plan the shortest possible route to get Lumino to the South Pole before it's too late.
                  </p>
                  <div className="text-slate-300 text-sm space-y-2">
                    <p>• You must follow the grid lines - you cannot cut across the wilderness between grid points.</p>
                    <p>• You and Lumino are too weak to climb over Mount Vinson, so you must go around it.</p>
                    <p>• You cannot leave Antarctica and travel over the ocean.</p>
                    <p>• There are dangerous monsters along some paths. You can still use those routes, just be extra careful and quiet.</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Map Legend:</h3>
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500/80 border border-green-300 rounded-lg shadow-lg shadow-green-500/50"></div>
                      <span className="text-white">Start (C5)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-600/50 rounded-lg">
                    <p className="text-white text-sm">
                      <strong>Instructions:</strong> Click on cells to mark your route from Start to South Pole. 
                      Click the last cell to undo. Avoid ocean areas and dangerous terrain shown on the map.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Map with Grid Overlay */}
              <div className="mb-8">
                <div className="relative bg-slate-700 rounded-lg p-3 md:p-6 overflow-hidden">
                  {/* Map Background - Hidden on mobile, shown on desktop */}
                  <div
                    className="hidden md:block absolute inset-0 bg-cover bg-no-repeat opacity-85"
                    style={{
                      backgroundImage: 'url(/issues/issue1/map.png)',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center 10px'
                    }}
                  />
                  
                  {/* Grid Overlay */}
                  <div className="relative z-10">
                    {/* Mobile: Smaller cells with more spacing */}
                    <div className="md:hidden grid grid-cols-10 gap-2 max-w-fit mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                        <div key={row} className="contents">
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((col) => {
                            const coordinate = `${col}${row}`;
                            const cell = grid.find(c => c.coordinate === coordinate);
                            if (!cell) return null;
                            
                            return (
                              <motion.button
                                key={coordinate}
                                whileTap={{ scale: (cell.value === 1 || cell.value === 2) ? 1 : 0.95 }}
                                onClick={() => handleCellClick(coordinate)}
                                className={`${getCellStyle().replace('w-12 h-12', 'w-8 h-8')} grid-cell`}
                                style={getCellInlineStyle(cell)}
                                disabled={cell.value === 1}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop: Original grid with map background */}
                    <div className="hidden md:grid grid-cols-10 gap-1 max-w-fit mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                        <div key={row} className="contents">
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((col) => {
                            const coordinate = `${col}${row}`;
                            const cell = grid.find(c => c.coordinate === coordinate);
                            if (!cell) return null;
                            
                            return (
                              <motion.button
                                key={coordinate}
                                whileTap={{ scale: (cell.value === 1 || cell.value === 2) ? 1 : 0.95 }}
                                onClick={() => handleCellClick(coordinate)}
                                className={`${getCellStyle()} grid-cell`}
                                style={getCellInlineStyle(cell)}
                                disabled={cell.value === 1}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Route Info */}
              <div className="mb-6 text-center">
                <p className="text-slate-300 mb-2">
                  Current Route: <span className="text-white font-semibold">{route.join(' → ')}</span>
                </p>
                <p className="text-slate-400 text-sm">
                  Route Length: {route.length} steps
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Route
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={route.length < 2}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
                >
                  Submit Route
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              {isValidRoute ? (
                <>
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-2xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Excellent Navigation!</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      Perfect! You've successfully planned a route to get Lumino to the South Pole safely. 
                      Your strategic thinking and careful planning have saved the day!
                    </p>
                    <div className="bg-slate-700 rounded-lg p-4 mb-6">
                      <p className="text-slate-300">
                        <span className="text-white font-semibold">Your Route:</span> {route.join(' → ')}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-white font-semibold">Route Length:</span> {route.length} steps
                      </p>
                    </div>
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
                    <h3 className="text-2xl font-bold text-white mb-4">Route Needs Adjustment</h3>
                    <p className="text-slate-300 text-lg mb-6">
                      Your route has some issues that need to be fixed. Check the constraints and try again!
                    </p>
                    <div className="bg-slate-700 rounded-lg p-4 mb-6">
                      <p className="text-slate-300">
                        <span className="text-white font-semibold">Your Route:</span> {route.join(' → ')}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-white font-semibold">Route Length:</span> {route.length} steps
                      </p>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <Button 
                    onClick={handleReset}
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
