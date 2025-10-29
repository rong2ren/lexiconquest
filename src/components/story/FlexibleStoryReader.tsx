import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { storyIssues } from '../../data/storyIndex';
import { usePlayAuth } from '../../contexts/PlayAuthContext';
import { trackEvent } from '../../lib/mixpanel';
import { JSONStoryRenderer } from './JSONStoryRenderer';

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

  // Check if a chapter is unlocked (previous chapters completed)
  const isChapterUnlocked = (chapterIndex: number) => {
    if (chapterIndex === 0) return true; // First chapter is always unlocked
    
    // Check if all previous chapters are completed
    for (let i = 0; i < chapterIndex; i++) {
      const chapter = storyIssue.chapters[i];
      const lastPageIndex = chapter.pages.length - 1;
      const lastPage = chapter.pages[lastPageIndex];
      
      // If the last page has a quest, check if it's completed
      if (lastPage.hasQuest && lastPage.questNumber) {
        if (lastCompletedQuest < lastPage.questNumber) {
          return false; // Previous chapter's quest not completed
        }
      }
    }
    
    return true;
  };

  // Navigate to specific chapter (first page)
  const handleChapterClick = async (chapterIndex: number) => {
    if (chapterIndex === currentChapter) return; // Already on this chapter
    
    // Check if chapter is unlocked
    if (!isChapterUnlocked(chapterIndex)) {
      // Could show a toast or modal here explaining why they can't access this chapter
      console.log(`Chapter ${chapterIndex + 1} is locked. Complete previous chapters first.`);
      return;
    }
    
    // Save progress to Firebase
    await saveProgress(chapterIndex, 0);
    
    // Track chapter navigation
    trackEvent('Story Chapter Navigated', {
      issueId,
      chapterId: chapterIndex + 1,
      pageId: 1,
      direction: 'chapter_jump',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-blue-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/snow-pattern.png')] bg-repeat"></div>
      </div>

      {/* Main content container with consistent width */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header - Single row layout with proper centering */}
        <div className="mb-6">
          <div className="grid grid-cols-3 items-center">
            {/* Left column - Back button */}
            <div className="flex justify-start">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <Home className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Back to Profile</span>
              </Button>
            </div>
            
            {/* Center column - Chapter title */}
            <div className="flex justify-center">
              {currentChapterData && (
                <h1 className="text-2xl font-bold text-white">
                  Chapter {currentChapter + 1}
                </h1>
              )}
            </div>
            
            {/* Right column - Page counter */}
            <div className="flex justify-end">
              <div className="flex items-center space-x-2 text-white">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm">
                  {currentPageNumber} / {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story content with side arrows */}
        <div className="mb-2 relative">
          {/* Left arrow - positioned outside */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={!canGoPrev()}
              className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full w-12 h-12 p-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* Story content - same size as before */}
          <div className="w-full">
            {currentPageData && (
              <JSONStoryRenderer
                content={currentPageData}
                onQuestStart={handleQuestStart}
              />
            )}
          </div>

          {/* Right arrow - positioned outside */}
          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-full w-12 h-12 p-0"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={!canGoPrev()}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {storyIssue.chapters.map((_: any, index: number) => {
              const isUnlocked = isChapterUnlocked(index);
              const isCurrent = index === currentChapter;
              
              return (
                <button
                  key={index}
                  onClick={() => handleChapterClick(index)}
                  disabled={!isUnlocked}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    !isUnlocked 
                      ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                      : isCurrent 
                        ? 'bg-white hover:scale-110 cursor-pointer' 
                        : 'bg-white/30 hover:bg-white/50 hover:scale-110 cursor-pointer'
                  }`}
                  title={
                    !isUnlocked 
                      ? `Chapter ${index + 1} is locked. Complete previous chapters first.`
                      : `Go to Chapter ${index + 1}`
                  }
                />
              );
            })}
          </div>

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
