// Simple story page with quest integration
export interface StoryPage {
  id: string;
  htmlContent: string;
  hasQuest?: boolean;
  questNumber?: number;
}

// Choice options for interactive pages
export interface StoryChoice {
  id: string;
  text: string;
  nextPageId?: string;
  statModifiers?: {
    bravery: number;
    wisdom: number;
    curiosity: number;
    empathy: number;
  };
}

// Interactive elements (buttons, inputs, etc.)
export interface InteractiveElement {
  id: string;
  type: 'button' | 'input' | 'slider' | 'drag-drop';
  label: string;
  options?: string[];
  required?: boolean;
}

// Story chapter structure
export interface StoryChapter {
  id: string;
  title: string;
  description?: string;
  pages: StoryPage[];
  backgroundMusic?: string;
  theme?: 'adventure' | 'mystery' | 'friendship' | 'discovery';
}

// Story issue configuration
export interface StoryIssue {
  id: string;
  backgroundTheme?: string;
  chapters: StoryChapter[];
}

// Story navigation state
export interface StoryNavigationState {
  currentChapter: number;
  currentPage: number;
  visitedPages: Set<string>;
  completedQuests: Set<number>;
  playerChoices: { [pageId: string]: string };
}
