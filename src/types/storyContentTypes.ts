// New simplified story content types

export interface StoryContent {
  type: 'chapter-header' | 'text' | 'two-column' | 'three-column' | 'quest-button' | 'info-box' | 'image';
  data: any; // Will be typed based on the type
}

// Chapter header with background image
export interface ChapterHeaderData {
  backgroundImage: string;
  title: string;
  subtitle?: string;
}

// Simple text content
export interface TextData {
  content: string;
  className?: string;
}

// Enhanced text content with optional header and auto-paragraphs
export interface EnhancedTextData {
  heading?: string;
  level?: number;
  content: string;
  className?: string;
  headingClassName?: string;
}

// Two-column layout (image + text)
export interface TwoColumnData {
  left?: {
    type: 'image' | 'text';
    content: string;
    alt?: string;
    className?: string;
  };
  right?: {
    type: 'image' | 'text';
    content: string;
    alt?: string;
    className?: string;
  };
}

// Three-column layout (for multiple items like Kowai eggs)
export interface ThreeColumnData {
  left?: {
    type: 'image' | 'text';
    content: string;
    alt?: string;
    className?: string;
  };
  center?: {
    type: 'image' | 'text';
    content: string;
    alt?: string;
    className?: string;
  };
  right?: {
    type: 'image' | 'text';
    content: string;
    alt?: string;
    className?: string;
  };
}

// Quest button for interactive elements
export interface QuestButtonData {
  buttonText: string;
  questId: number;
  className?: string;
}

// Info box with highlighted content
export interface InfoBoxData {
  title?: string;
  content: string;
  className?: string;
}


// Simple image
export interface ImageData {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}


// Updated StoryPage interface
export interface SimpleStoryPage {
  id: string;
  content: StoryContent[];
  hasQuest?: boolean;
  questNumber?: number;
}

// Updated StoryChapter interface
export interface SimpleStoryChapter {
  id: string;
  title: string;
  pages: SimpleStoryPage[];
}

// Updated StoryIssue interface
export interface SimpleStoryIssue {
  id: string;
  chapters: SimpleStoryChapter[];
}
