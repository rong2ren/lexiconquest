import { useEffect } from 'react';
import type { StoryPage } from '../../types/storyTypes';

interface HTMLStoryRendererProps {
  content: StoryPage;
  onQuestStart?: (questId: number) => void;
  onChoiceSelect?: (choiceId: string) => void;
  onInteractiveAction?: (elementId: string, value: any) => void;
}

export function HTMLStoryRenderer({ 
  content, 
  onQuestStart, 
  onChoiceSelect, 
  onInteractiveAction 
}: HTMLStoryRendererProps) {
  
  // Add event listeners for interactive elements in HTML
  useEffect(() => {
    const questButtons = document.querySelectorAll('button[data-quest-id]');
    questButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const questId = parseInt((e.target as HTMLElement).dataset.questId || '0');
        onQuestStart?.(questId);
      });
    });

    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const choiceId = (e.target as HTMLElement).dataset.choiceId;
        if (choiceId) {
          onChoiceSelect?.(choiceId);
        }
      });
    });

    // Cleanup
    return () => {
      questButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
      choiceButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
    };
  }, [content.htmlContent, onQuestStart, onChoiceSelect, onInteractiveAction]);

  return (
    <div 
      className="max-w-4xl mx-auto p-4 leading-relaxed rounded-3xl shadow-2xl border-2 border-blue-200/40 min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[75vh] font-arimo bg-gradient-to-br from-sky-200/90 via-blue-100/80 to-cyan-100/70 text-slate-800"
      dangerouslySetInnerHTML={{ __html: content.htmlContent }}
    />
  );
}
