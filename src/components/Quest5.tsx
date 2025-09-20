import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
  const [inputCoordinate, setInputCoordinate] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

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

    const lastCoordinate = route[route.length - 1];
    
    // If clicking the last coordinate, remove it (undo) - no warnings needed
    if (coordinate === lastCoordinate && route.length > 1) {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      updateGridRoute(newRoute);
      return;
    }

    // Show warning popups for dangerous/blocked areas only when adding new cells
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
      let newStatChanges = { bravery: 0, wisdom: 5, curiosity: 0, empathy: 0 };
      
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
    setInputCoordinate('');
    setInputError('');
  };

  // Mobile input functions
  const handleInputChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setInputCoordinate(upperValue);
    setInputError(''); // Clear any previous errors
  };

  const addCoordinateToRoute = () => {
    if (inputCoordinate.length !== 2) {
      setInputError('Coordinate must be 2 characters (e.g., D5)');
      return;
    }

    const col = inputCoordinate[0];
    const row = inputCoordinate[1];
    
    if (!['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(col)) {
      setInputError('Invalid column. Use A-J');
      return;
    }
    
    if (!['1', '2', '3', '4', '5', '6', '7'].includes(row)) {
      setInputError('Invalid row. Use 1-7');
      return;
    }

    // Check if coordinate is already in route
    if (route.includes(inputCoordinate)) {
      setInputError('This coordinate is already in your route');
      return;
    }

    // Check if coordinate is adjacent to the last coordinate
    const lastCoordinate = route[route.length - 1];
    if (!areAdjacent(lastCoordinate, inputCoordinate)) {
      setInputError('Coordinate must be adjacent to the last coordinate');
      return;
    }

    // Check if it's an ocean cell (impassable)
    const cell = grid.find(c => c.coordinate === inputCoordinate);
    if (cell && cell.value === 1) {
      setInputError('Cannot go through ocean areas');
      return;
    }

    // Check if it's Mount Vinson (blocked)
    if (cell && cell.value === 5) {
      setInputError('Mount Vinson is too steep to climb. Go around it!');
      return;
    }

    // Valid coordinate - add to route
    handleCellClick(inputCoordinate);
    setInputCoordinate('');
    setInputError('');
  };

  const removeLastCoordinate = () => {
    if (route.length > 1) {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      updateGridRoute(newRoute);
    }
  };

  // Get cell styling based on terrain and route status
  const getCellStyle = () => {
    return 'w-16 h-16 rounded-lg';
  };

  const getCellInlineStyle = (cell: GridCell) => {
    // Check route first (highest priority) - same as starting point
    if (cell.isInRoute) {
      return { 
        '--border-color': 'rgba(168, 85, 247, 0.9)',
        '--border-width': '3px',
        borderColor: 'var(--border-color)',
        borderWidth: 'var(--border-width)',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))',
        boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)'
      }; // Route - Purple gradient
    }
    // Then check starting point
    else if (cell.value === 3) {
      return { 
        '--border-color': 'rgba(168, 85, 247, 0.9)',
        '--border-width': '3px',
        borderColor: 'var(--border-color)',
        borderWidth: 'var(--border-width)',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))',
        boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)'
      }; // Start point - Purple gradient
    } 
    // All other cells - minimal border for visibility
    else {
      return { 
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: cell.value === 1 ? 'not-allowed' : 'pointer'
      }; // All other cells - minimal border for visibility
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <style>{`
        .grid-cell {
          transition: all 0.2s ease-in-out;
          position: relative;
        }
        
        .grid-cell:hover:not([disabled]) {
          transform: scale(1.1) !important;
          z-index: 10 !important;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.8) !important;
          border: 2px solid rgba(168, 85, 247, 0.9) !important;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2)) !important;
        }
        
        .grid-cell[disabled]:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Special hover effects for different cell types */
        .grid-cell.dangerous:hover:not([disabled]) {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.8) !important;
          border: 2px solid rgba(239, 68, 68, 0.9) !important;
          background-color: rgba(239, 68, 68, 0.2) !important;
        }
        
        .grid-cell.blocked:hover:not([disabled]) {
          box-shadow: 0 0 15px rgba(156, 163, 175, 0.8) !important;
          border: 2px solid rgba(156, 163, 175, 0.9) !important;
          background-color: rgba(156, 163, 175, 0.2) !important;
        }
      `}</style>
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6 mt-4">
        <Button 
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">

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
                  Quest 5: Path to the South Pole
                </h2>
              </div>

              {/* Instructions */}
              <div className="text-center mb-12">
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl mb-4 font-semibold">
                    Plan the shortest possible route to get Lumino to the South Pole before it's too late.
                  </h2>
                  <div className="text-slate-700 text-lg space-y-3">
                    <p>• You must follow the grid lines - you cannot cut across the wilderness between grid points.</p>
                    <p>• You and Lumino are too weak to climb over Mount Vinson, so you must go around it.</p>
                    <p>• You cannot leave Antarctica and travel over the ocean.</p>
                    <p>• There are dangerous monsters along some paths. You can still use those routes, just be extra careful and quiet.</p>
                    <p className="text-yellow-600 font-semibold">• You start at coordinate C5 and must reach the South Pole at E4.</p>
                    <p className="text-blue-600 mt-4">💡 <strong>Tip:</strong> Hover over cells to see which ones are clickable!</p>
                  </div>
                </div>
              </div>


              {/* Mobile: Input Interface */}
              <div className="md:hidden mb-8">
                <div className="bg-slate-700 rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Plan Your Route</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Add coordinates to your route step by step
                    </p>
                    
                    {/* Current Route Display */}
                    <div className="mb-6">
                      <p className="text-slate-700 text-sm mb-2">Current Route:</p>
                      <div className="bg-slate-600 rounded-lg p-3 min-h-[3rem] flex items-center justify-center">
                        {route.length > 1 ? (
                          <span className="text-white font-mono text-sm">
                            {route.join(' → ')}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">Start at C5</span>
                        )}
                      </div>
                    </div>

                    {/* Input Controls */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          value={inputCoordinate}
                          onChange={(e) => handleInputChange(e.target.value)}
                          placeholder="input next cell"
                          maxLength={2}
                          className={`text-center text-lg font-mono uppercase tracking-wider flex-1 bg-slate-600 text-white border-2 transition-all duration-200 ${
                            inputError 
                              ? 'border-red-500 focus:border-red-400' 
                              : 'border-slate-500 focus:border-purple-400'
                          } hover:bg-slate-500 focus:bg-slate-500`}
                        />
                        <Button
                          onClick={addCoordinateToRoute}
                          disabled={inputCoordinate.length !== 2}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-slate-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {inputError && (
                        <p className="text-red-400 text-sm text-center">
                          {inputError}
                        </p>
                      )}
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={removeLastCoordinate}
                          disabled={route.length <= 1}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove Last
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map with Grid Overlay */}
              <div className="mb-8">
                <div className="relative rounded-lg p-4 md:p-8 overflow-hidden">
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
                    {/* Mobile: Hidden - using input interface instead */}
                    <div className="md:hidden hidden">
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
                                className={`${getCellStyle().replace('w-12 h-12', 'w-8 h-8')} grid-cell ${
                                  cell.value === 2 ? 'dangerous' : 
                                  cell.value === 5 ? 'blocked' : ''
                                }`}
                                style={getCellInlineStyle(cell)}
                                disabled={cell.value === 1}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop: Larger grid with map background */}
                    <div className="hidden md:grid grid-cols-10 gap-2 max-w-fit mx-auto">
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
                                className={`${getCellStyle()} grid-cell ${
                                  cell.value === 2 ? 'dangerous' : 
                                  cell.value === 5 ? 'blocked' : ''
                                }`}
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
                <p className="text-slate-700 mb-2">
                  Current Route: <span className="text-slate-800 font-semibold">{route.join(' → ')}</span>
                </p>
                <p className="text-slate-700 text-sm">
                  Route Length: {route.length} steps
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-slate-600 text-slate-700 hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Route
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={route.length < 2}
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 disabled:opacity-50 cursor-pointer"
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
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">🎉 Perfect navigation, young explorer!</h3>
                    <p className="text-slate-700 text-lg mb-6">
                      You have proven your <span className="text-yellow-600 font-bold text-xl">WISDOM</span>.
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      Lumino looks at you with new respect. You have shown your ability to think clearly and solve problems even under pressure.
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      One last challenge lies ahead on your path to becoming a true Kowai Trainer. You are very close.
                    </p>
                    <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                      <p className="text-slate-700 text-lg mb-2">
                        <span className="text-slate-800 font-semibold">Your Route:</span> {route.join(' → ')}
                      </p>
                      <p className="text-slate-700 text-lg">
                        <span className="text-slate-800 font-semibold">Route Length:</span> {route.length} steps
                      </p>
                    </div>
                  </div>

                  {/* Stats Gained */}
                  <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">Stats Gained:</h4>
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
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-6 border border-blue-500/30">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">📘</span>
                      <p className="text-blue-100 text-lg font-semibold">
                        Go back and keep reading until you reach the next quest!
                      </p>
                    </div>
                  </div>

                  {/* Continue Button */}
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
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">Uh-oh… the path you chose took a strange turn.</h3>
                    <p className="text-slate-700 text-lg mb-6">
                      You bravely followed the direction you picked, but suddenly, a swirling black wind rose from the ground like a tornado. Before you could react, it pulled you in… a spinning, twisting black hole!
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      Just when it felt like all hope was lost, a majestic dragon-shaped Kowai burst through the storm. With a roar that shook the sky, it swooped in and caught you on its back.
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      As it flew you safely back toward land, your eyes grew heavy… the world blurred… and you slowly drifted off.
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      But before sleep took over, one thought stayed clear in your mind: 
                    </p>
                    <p className="text-slate-700 text-lg mb-6">
                      You made the wrong choice — and you'll need to try again.
                    </p>
                    <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                      <p className="text-slate-700 text-lg mb-2">
                        <span className="text-slate-800 font-semibold">Your Route:</span> {route.join(' → ')}
                      </p>
                      <p className="text-slate-700 text-lg">
                        <span className="text-slate-800 font-semibold">Route Length:</span> {route.length} steps
                      </p>
                    </div>
                  </div>

                  {/* Try Again Button */}
                  <Button 
                    onClick={handleReset}
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 cursor-pointer"
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
