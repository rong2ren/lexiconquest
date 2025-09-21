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
  value: number; // 0 = normal, 1 = ocean, 2 = dangerous, 3 = blocked
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
  const [clickedCellInfo, setClickedCellInfo] = useState<{coordinate: string, info: string, position: {x: number, y: number}} | null>(null);
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
        if (coordinate === 'C4') {
          value = 3; // Blocked (Mount Vinson)
        } else if (coordinate === 'E5') {
          value = 3; // Blocked (Special ocean area)
        } else if (
          // Dangerous areas (passable but risky)
          coordinate === 'D4' || coordinate === 'E3' || coordinate === 'H4'
        ) {
          value = 2; // Dangerous
        } else if (
          // Ocean areas (not accessible)
          (col === 'A' && coordinate !== 'A2') || // Column A except A2
          col === 'J' || // Column J
          coordinate === 'B1' || coordinate === 'B2' || coordinate === 'B6' || coordinate === 'B7' ||
          coordinate === 'C1' || coordinate === 'C2' || coordinate === 'C7' ||
          coordinate === 'D1' || coordinate === 'D7' ||
          coordinate === 'E6' || coordinate === 'E7' ||
          coordinate === 'H1' ||
          coordinate === 'I2' || coordinate === 'I3' || coordinate === 'I7' ||
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
    trackEvent('Quest Started', {
      issueNumber: 1,
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
  const handleCellClick = (coordinate: string, event: React.MouseEvent) => {
    const cell = grid.find(c => c.coordinate === coordinate);
    if (!cell) return;

    // Show terrain info for blocked areas only
    if (cell.value === 3) {
      const terrainInfo = getTerrainInfo(cell);
      const rect = event.currentTarget.getBoundingClientRect();
      setClickedCellInfo({
        coordinate,
        info: terrainInfo,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        }
      });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setClickedCellInfo(null);
      }, 3000);
      return; // Don't add blocked areas to route
    }

    const lastCoordinate = route[route.length - 1];
    
    // If clicking the last coordinate, remove it (undo) - but never remove C5
    if (coordinate === lastCoordinate && coordinate !== 'C5') {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      updateGridRoute(newRoute);
      return;
    }

    // Don't add ocean areas to route
    if (cell.value === 1) {
      return; // Ocean - impassable
    }

    // If route is empty, allow starting with C5
    if (route.length === 0 && coordinate === 'C5') {
      const newRoute = [coordinate];
      setRoute(newRoute);
      updateGridRoute(newRoute);
      
      // Track route building
      if (!routeStartTime) {
        setRouteStartTime(Date.now());
      }
      
      trackEvent('Quest Answer Selected', {
        issueNumber: 1,
        questNumber: 5,
        trainerId: currentTrainer?.uid,
        trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
        trainerAge: currentTrainer?.age,
        trainerStats: currentTrainer?.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        optionType: 'route_cell',
        selectedAnswer: coordinate
      });
      return;
    }

    // If clicking an adjacent cell, add it to route
    if (lastCoordinate && areAdjacent(lastCoordinate, coordinate)) {
      // Prevent backtracking - don't add cells that are already in the route
      if (route.includes(coordinate)) {
        return; // Cell already in route, don't add it again
      }
      
      const newRoute = [...route, coordinate];
      setRoute(newRoute);
      updateGridRoute(newRoute);
      
      // Track route building
      if (!routeStartTime) {
        setRouteStartTime(Date.now());
      }
      
      trackEvent('Quest Answer Selected', {
        issueNumber: 1,
        questNumber: 5,
        trainerId: currentTrainer?.uid,
        trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
        trainerAge: currentTrainer?.age,
        trainerStats: currentTrainer?.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        optionType: 'route_cell',
        selectedAnswer: coordinate
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
    
    // Check if route is exactly the correct path: C5 → D5 → D4 → E4
    const correctRoute = ['C5', 'D5', 'D4', 'E4'];
    if (JSON.stringify(routeToValidate) !== JSON.stringify(correctRoute)) {
      errors.push('Route must be exactly: C5 → D5 → D4 → E4');
      return { isValid: false, errors };
    }
    
    // If we reach here, the route is exactly correct
    return { isValid: true, errors: [] };
  };

  // Handle route submission
  const handleSubmit = async () => {
    if (!currentTrainer) return;

    const validation = validateRoute(route);
    setIsValidRoute(validation.isValid);

    // Only apply stats and update quest progress if route is valid
    if (validation.isValid) {
      // Calculate stats based on route quality
      let newStatChanges = { bravery: 0, wisdom: 3, curiosity: 0, empathy: 0 };
      
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
        trackEvent('Quest Completed', { 
          issueNumber: 1,
          questNumber: 5,
          trainerId: currentTrainer.uid,
          trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
          trainerAge: currentTrainer.age,
          trainerStats: currentTrainer.stats,
          questStartTime: questStartTime,
          eventTime: Date.now(),
          selectedAnswer: route.join(','),
          statsGained: newStatChanges,
          totalQuestTime: totalQuestTime
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
      trackEvent('Quest Failed', { 
        issueNumber: 1,
        questNumber: 5,
        trainerId: currentTrainer.uid,
        trainerName: `${currentTrainer.firstName} ${currentTrainer.lastName}`,
        trainerAge: currentTrainer.age,
        trainerStats: currentTrainer.stats,
        questStartTime: questStartTime,
        eventTime: Date.now(),
        selectedAnswer: route.join(','),
        totalQuestTime: totalQuestTime
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
    // Track retry attempt
    trackEvent('Quest Retry', {
      issueNumber: 1,
      questNumber: 5,
      trainerId: currentTrainer?.uid,
      trainerName: currentTrainer ? `${currentTrainer.firstName} ${currentTrainer.lastName}` : null,
      trainerAge: currentTrainer?.age,
      trainerStats: currentTrainer?.stats,
      questStartTime: questStartTime,
      eventTime: Date.now()
    });
    
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

    // Check if it's an impassable cell (ocean or blocked)
    const cell = grid.find(c => c.coordinate === inputCoordinate);
    if (cell && (cell.value === 1 || cell.value === 3)) {
      if (cell.value === 1) {
        setInputError('You cannot leave Antarctica and travel over the ocean');
      } else if (cell.value === 3) {
        if (inputCoordinate === 'C4') {
          setInputError('You and Lumino are too weak to climb over Mount Vinson');
        } else if (inputCoordinate === 'E5') {
          setInputError('You cannot leave Antarctica and travel over the ocean');
        } else {
        }
      }
      return;
    }

    // Valid coordinate - add to route
    handleCellClick(inputCoordinate, {} as React.MouseEvent);
    setInputCoordinate('');
    setInputError('');
  };

  const removeLastCoordinate = () => {
    if (route.length > 1 && route[route.length - 1] !== 'C5') {
      const newRoute = route.slice(0, -1);
      setRoute(newRoute);
      updateGridRoute(newRoute);
    }
  };

  // Get cell styling based on terrain and route status
  const getCellStyle = () => {
    return 'w-16 h-16 rounded-lg';
  };

  const getTerrainInfo = (cell: GridCell) => {
    // Show info for blocked areas (C4 and E5)
    if (cell.coordinate === 'C4') {
      return 'You and Lumino are too weak to climb over Mount Vinson';
    } else if (cell.coordinate === 'E5') {
      return 'You cannot leave Antarctica and travel over the ocean';
    }
    return 'Click on a cell to see terrain information';
  };

  const getCellInlineStyle = (cell: GridCell) => {
    // Check route first (highest priority)
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
              <div className="text-left mb-8">
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-blue-300/50">
                  <h2 className="text-slate-800 text-2xl mb-4 font-semibold">
                    Plan the shortest possible route to get Lumino to the South Pole before it's too late.
                  </h2>
                  <div className="text-slate-700 text-lg space-y-3">
                    <p>• You must follow the grid lines - you cannot cut across the wilderness between grid points.</p>
                    <p>• You and Lumino are too weak to climb over Mount Vinson, so you must go around it.</p>
                    <p>• You cannot leave Antarctica and travel over the ocean.</p>
                    <p className="text-yellow-600 font-semibold">• You start at coordinate C5 and must reach the South Pole at E4.</p>
                    <p className="text-blue-600 mt-4 hidden md:block">💡 <strong>Tip:</strong> Hover over cells to see which ones are clickable!</p>
                  </div>
                </div>
              </div>


              {/* Mobile: Input Interface */}
              <div className="md:hidden mb-8">
                <div className="bg-slate-700 rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">Plan Your Route</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Add coordinates to your route step by step
                    </p>
                    
                    {/* Current Route Display */}
                    <div className="mb-6">
                      <p className="text-slate-200 text-sm mb-2 font-semibold">📍 Your Route So Far:</p>
                      {route.length > 1 ? (
                        <div className="bg-slate-600 rounded-lg p-3 min-h-[3rem] flex items-center justify-center">
                          <span className="text-white font-mono text-sm">
                            {route.join(' → ')}
                          </span>
                        </div>
                      ) : (
                        <p className="text-slate-200 text-sm font-semibold text-center">🏁 Start at C5</p>
                      )}
                    </div>

                    {/* Input Controls */}
                    <div className="space-y-3">
                      <p className="text-slate-200 text-sm font-semibold">🎯 Add Next Step:</p>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={inputCoordinate}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Type next step"
                            maxLength={2}
                            className={`text-center text-lg font-mono uppercase tracking-wider w-full bg-white text-slate-800 border-3 transition-all duration-200 shadow-lg ${
                              inputError 
                                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-200' 
                                : 'border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            } hover:bg-blue-50 focus:bg-blue-50`}
                          />
                          <p className="text-slate-400 text-xs mt-1 text-center">Example: D5, E5, E4</p>
                        </div>
                        <Button
                          onClick={addCoordinateToRoute}
                          disabled={inputCoordinate.length !== 2}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Add this step to your route"
                        >
                          <Plus className="h-5 w-5" />
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
              <div className="mb-4">
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
                                onClick={(e) => handleCellClick(coordinate, e)}
                                className={`${getCellStyle().replace('w-12 h-12', 'w-8 h-8')} grid-cell ${
                                  cell.value === 2 ? 'dangerous' : 
                                  cell.value === 3 ? 'blocked' : ''
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
                                onClick={(e) => handleCellClick(coordinate, e)}
                                className={`${getCellStyle()} grid-cell ${
                                  cell.value === 2 ? 'dangerous' : 
                                  cell.value === 3 ? 'blocked' : ''
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


              {/* Route Info and Controls - Desktop Only */}
              <div className="mb-6 hidden md:flex items-center justify-between bg-white/60 rounded-lg p-4 border border-blue-300/50">
                {/* Left: Route Info */}
                <div className="flex-1">
                  <p className="text-slate-700 mb-1">
                    Current Route: <span className="text-slate-800 font-semibold">{route.join(' → ')}</span>
                  </p>
                  <p className="text-slate-700 text-sm">
                    Route Length: {route.length} steps
                  </p>
                </div>
                
                {/* Right: Control Buttons */}
                <div className="flex-shrink-0 flex gap-2">
                  <Button
                    onClick={removeLastCoordinate}
                    variant="outline"
                    className="border-slate-600 text-slate-700 hover:bg-slate-300"
                    disabled={route.length <= 1 || route[route.length - 1] === 'C5'}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Remove Last
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-600 text-slate-700 hover:bg-slate-300"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Route
                  </Button>
                </div>
              </div>

              {/* Submit Button - Both Mobile and Desktop */}
              <div className="flex justify-center">
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
            <div className="text-left">
              {isValidRoute ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-slate-800 mb-6">🎉 Perfect navigation, young explorer!</h3>
                    
                    <div className="bg-gradient-to-r from-blue-200/60 to-purple-200/60 rounded-xl p-4 mb-6 border-2 border-blue-400/50">
                      <p className="text-slate-700 text-lg mb-2">
                        <span className="text-slate-800 font-semibold">Your Route:</span> {route.join(' → ')}
                      </p>
                      <p className="text-slate-700 text-lg mb-4">
                        <span className="text-slate-800 font-semibold">Route Length:</span> {route.length} steps
                      </p>
                      <p className="text-slate-700 text-lg mb-4">You have proven your <span className="text-yellow-600 font-bold text-xl">WISDOM</span>.</p>
                      <p className="text-slate-700 text-lg mb-4">
                        Lumino looks at you with new respect. You have shown your ability to think clearly and solve problems even under pressure.
                      </p>
                      <p className="text-slate-700 text-lg">
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
                      Continue to the next quest
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
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

      {/* Floating Terrain Info */}
      {clickedCellInfo && (
        <div 
          className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-600 pointer-events-none"
          style={{
            left: `${clickedCellInfo.position.x}px`,
            top: `${clickedCellInfo.position.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-sm font-medium text-center">
            {clickedCellInfo.coordinate}: {clickedCellInfo.info}
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-600 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
