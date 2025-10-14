import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { storyIssues } from '../../data/storyIndex';
import { usePlayAuth } from '../../contexts/PlayAuthContext';
import { trackEvent } from '../../lib/mixpanel';
import { HTMLStoryRenderer } from './HTMLStoryRenderer';

// Import quest components
import { Quest1 } from '../issue1/Quest1';
import { Quest2 } from '../issue1/Quest2';
import { Quest3 } from '../issue1/Quest3';
import { Quest4 } from '../issue1/Quest4';
import { Quest5 } from '../issue1/Quest5';
import Quest6 from '../issue1/Quest6';

interface FlexibleStoryReaderProps {
  issueId: string;
  onBack: () => void;
}

export function FlexibleStoryReader({ issueId, onBack }: FlexibleStoryReaderProps) {
  const { currentTrainer, getCurrentIssueProgress, saveStoryProgress, getStoryProgress, setStoryStarted, setStoryCompleted } = usePlayAuth();
  
  // Get current story progress from Firebase
  const storyProgress = getStoryProgress();
  const currentChapter = storyProgress?.currentChapter || 0;
  const currentPage = storyProgress?.currentPage || 0;
  
  const [showQuest, setShowQuest] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<number | null>(null);

  // Initialize story started time on mount
  useEffect(() => {
    const issueProgress = getCurrentIssueProgress();
    if (issueProgress && issueProgress.startedAt === null) {
      setStoryStarted().catch(error => {
        console.error('Error setting story started:', error);
      });
    }
  }, []); // Only run on mount

  // Get story data for the current issue
  const storyIssue = storyIssues[issueId];
  if (!storyIssue) {
    return <div>Story not found</div>;
  }

  const currentChapterData = storyIssue.chapters[currentChapter];
  const currentPageData = currentChapterData?.pages[currentPage];
  const totalPages = storyIssue.chapters.reduce((total: number, chapter: any) => total + chapter.pages.length, 0);
  const currentPageNumber = storyIssue.chapters
    .slice(0, currentChapter)
    .reduce((total: number, chapter: any) => total + chapter.pages.length, 0) + currentPage + 1;

  // Check quest progress
  const issueProgress = getCurrentIssueProgress();
  const lastCompletedQuest = issueProgress?.lastCompletedQuest || 0;

  // Check if we can proceed to the next page
  const canGoNext = () => {
    if (!currentPageData) return false;
    
    // If current page has a quest, check if it's completed
    if (currentPageData.hasQuest && currentPageData.questNumber) {
      return lastCompletedQuest >= currentPageData.questNumber;
    }
    
    return true;
  };

  // Check if we can go to previous page
  const canGoPrev = () => {
    return currentPage > 0 || currentChapter > 0;
  };

  // Save story progress to Firebase
  const saveProgress = async (chapter: number, page: number) => {
    try {
      await saveStoryProgress(chapter, page);
    } catch (error) {
      console.error('Error saving story progress:', error);
    }
  };

  // Navigate to next page
  const handleNext = async () => {
    if (!canGoNext()) return;

    let newChapter = currentChapter;
    let newPage = currentPage;
    
    if (currentPage < currentChapterData.pages.length - 1) {
      newPage = currentPage + 1;
    } else if (currentChapter < storyIssue.chapters.length - 1) {
      newChapter = currentChapter + 1;
      newPage = 0;
    }
    
    // Save progress to Firebase
    await saveProgress(newChapter, newPage);
    
    // Check if story is completed (last chapter, last page)
    const isStoryCompleted = newChapter === storyIssue.chapters.length - 1 && 
                            newPage === storyIssue.chapters[newChapter].pages.length - 1;
    
    // Set completedAt when story is finished
    if (isStoryCompleted) {
      setStoryCompleted().catch(error => {
        console.error('Error setting story completed:', error);
      });
    }
    
    // Track page navigation
    trackEvent('Story Page Navigated', {
      issueId,
      chapterId: newChapter + 1,
      pageId: newPage + 1,
      direction: 'next',
      trainerId: currentTrainer?.uid
    });
  };

  // Navigate to previous page
  const handlePrev = async () => {
    if (!canGoPrev()) return;

    let newChapter = currentChapter;
    let newPage = currentPage;
    
    if (currentPage > 0) {
      newPage = currentPage - 1;
    } else if (currentChapter > 0) {
      newChapter = currentChapter - 1;
      newPage = storyIssue.chapters[currentChapter - 1].pages.length - 1;
    }
    
    // Save progress to Firebase
    await saveProgress(newChapter, newPage);
    
    // Track page navigation
    trackEvent('Story Page Navigated', {
      issueId,
      chapterId: newChapter + 1,
      pageId: newPage + 1,
      direction: 'prev',
      trainerId: currentTrainer?.uid
    });
  };

  // Handle quest start
  const handleQuestStart = (questNumber: number) => {
    if (!currentPageData?.hasQuest) return;
    
    setCurrentQuest(questNumber);
    setShowQuest(true);
    
    trackEvent('Quest Started from Story', {
      issueId,
      questId: questNumber,
      chapterId: currentChapter + 1,
      pageId: currentPage + 1,
      trainerId: currentTrainer?.uid
    });
  };

  // Handle quest completion
  const handleQuestComplete = (questId: number) => {
    // Hide quest component
    setShowQuest(false);
    setCurrentQuest(null);
    
    // Immediately advance to next page (no delay, no return to story page)
    handleNext();
    
    trackEvent('Quest Completed from Story', {
      issueId,
      questId,
      chapterId: currentChapter + 1,
      pageId: currentPage + 1,
      trainerId: currentTrainer?.uid
    });
  };

  // Handle quest back
  const handleQuestBack = () => {
    setShowQuest(false);
    setCurrentQuest(null);
  };

  // Handle choice selection
  const handleChoiceSelect = (choiceId: string) => {
    if (!currentPageData) return;
    
    trackEvent('Story Choice Selected', {
      issueId,
      pageId: currentPageData.id,
      choiceId,
      trainerId: currentTrainer?.uid
    });
  };

  // Handle interactive actions
  const handleInteractiveAction = (elementId: string, value: any) => {
    if (!currentPageData) return;
    
    trackEvent('Story Interactive Action', {
      issueId,
      pageId: currentPageData.id,
      elementId,
      value,
      trainerId: currentTrainer?.uid
    });
  };

  // Render quest component if active
  if (showQuest && currentQuest) {
    const questProps = {
      onComplete: () => handleQuestComplete(currentQuest),
      onBack: handleQuestBack
    };

    switch (currentQuest) {
      case 1:
        return <Quest1 {...questProps} />;
      case 2:
        return <Quest2 {...questProps} />;
      case 3:
        return <Quest3 {...questProps} />;
      case 4:
        return <Quest4 {...questProps} />;
      case 5:
        return <Quest5 {...questProps} />;
      case 6:
        return <Quest6 {...questProps} />;
      default:
        return <div>Quest not found</div>;
    }
  }

  // Get background theme
  const getBackgroundTheme = () => {
    switch (storyIssue.backgroundTheme) {
      case 'antarctica':
        return 'bg-gradient-to-br from-blue-900 via-slate-900 to-blue-800';
      case 'forest':
        return 'bg-gradient-to-br from-green-900 via-slate-900 to-emerald-800';
      case 'desert':
        return 'bg-gradient-to-br from-yellow-900 via-orange-900 to-red-800';
      default:
        return 'bg-gradient-to-br from-blue-900 via-slate-900 to-blue-800';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundTheme()} relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/snow-pattern.png')] bg-repeat"></div>
      </div>

      {/* Main content container with consistent width */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header - Simple 2-line layout for all screen sizes */}
        <div className="mb-6">
          {/* Top row: Back button and page counter */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Profile
            </Button>
            
            <div className="flex items-center space-x-4 text-white">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">
                {currentPageNumber} / {totalPages}
              </span>
            </div>
          </div>
          
          {/* Chapter title */}
          {currentChapterData && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">
                Chapter {currentChapter + 1}: {currentChapterData.title}
              </h1>
              {currentChapterData.description && (
                <p className="text-white/80 text-sm">
                  {currentChapterData.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Story content */}
        <div className="mb-2">
          <AnimatePresence mode="wait">
            {currentPageData && (
              <motion.div
                key={currentPageData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <HTMLStoryRenderer
                  content={currentPageData}
                  onChoiceSelect={handleChoiceSelect}
                  onQuestStart={handleQuestStart}
                  onInteractiveAction={handleInteractiveAction}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={!canGoPrev()}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {storyIssue.chapters.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentChapter ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
