import { useCallback } from 'react';
import type { SimpleStoryPage, StoryContent } from '../../types/storyContentTypes';

interface JSONStoryRendererProps {
  content: SimpleStoryPage;
  onQuestStart?: (questId: number) => void;
}

export function JSONStoryRenderer({ 
  content, 
  onQuestStart 
}: JSONStoryRendererProps) {
  
  // Event handlers for interactive elements
  const handleQuestClick = useCallback((questId: number) => {
    onQuestStart?.(questId);
  }, [onQuestStart]);

  // Reusable heading renderer
  const renderHeading = useCallback((heading: string, level: number, headingClassName?: string) => {
    const defaultClasses = `text-2xl font-bold text-yellow-600 mb-4 font-gagalin`;
    const headingProps = {
      className: headingClassName ? `${defaultClasses} ${headingClassName}` : defaultClasses
    };
    
    switch (level) {
      case 1: return <h1 {...headingProps}>{heading}</h1>;
      case 2: return <h2 {...headingProps}>{heading}</h2>;
      case 3: return <h3 {...headingProps}>{heading}</h3>;
      case 4: return <h4 {...headingProps}>{heading}</h4>;
      case 5: return <h5 {...headingProps}>{heading}</h5>;
      case 6: return <h6 {...headingProps}>{heading}</h6>;
      default: return <h3 {...headingProps}>{heading}</h3>;
    }
  }, []);



  const renderChapterHeader = useCallback((data: any, index: number) => {
    const textColor = data.textColor || 'text-white';
    return (
      <div 
        key={index}
        className={`p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center ${textColor}`}
        style={{
          backgroundImage: `url('${data.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center drop-shadow-xl font-gagalin">
          {data.title}
        </h2>
        {data.subtitle && (
          <h2 className="text-3xl font-bold mb-4 text-center drop-shadow-xl font-gagalin">
            {data.subtitle}
          </h2>
        )}
      </div>
    );
  }, []);

  const renderText = useCallback((data: any, index: number) => {
    return (
      <div key={index} className={`p-6 rounded-2xl text-left ${data.className || ''}`}>
        <div className="text-slate-800 text-lg leading-relaxed space-y-6">
          {data.heading && renderHeading(data.heading, data.level || 3, data.headingClassName)}
          <div className="space-y-6" dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      </div>
    );
  }, [renderHeading]);

  const renderTwoColumn = useCallback((data: any, index: number) => (
    <div key={index} className="p-6 rounded-2xl text-left">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {data.left && (
          <div className="flex justify-center items-center">
            {data.left.type === 'image' ? (
              renderImage(data.left, 0)
            ) : (
              renderText(data.left, 0)
            )}
          </div>
        )}
        
        {data.right && (
          <div className="flex justify-center items-center">
            {data.right.type === 'image' ? (
              renderImage(data.right, 0)
            ) : (
              renderText(data.right, 0)
            )}
          </div>
        )}
      </div>
    </div>
  ), [renderText]);

  const renderThreeColumn = useCallback((data: any, index: number) => (
    <div key={index} className="p-6 rounded-2xl text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.left && (
          <div className="flex flex-col items-start space-y-4">
            {data.left.type === 'image' ? (
              renderImage(data.left, 0)
            ) : (
              renderText(data.left, 0)
            )}
          </div>
        )}
        
        {data.center && (
          <div className="flex flex-col items-start space-y-4">
            {data.center.type === 'image' ? (
              renderImage(data.center, 0)
            ) : (
              renderText(data.center, 0)
            )}
          </div>
        )}
        
        {data.right && (
          <div className="flex flex-col items-start space-y-4">
            {data.right.type === 'image' ? (
              renderImage(data.right, 0)
            ) : (
              renderText(data.right, 0)
            )}
          </div>
        )}
      </div>
    </div>
  ), [renderText]);

  const renderQuestButton = useCallback((data: any, index: number) => (
    <div key={index} className="mt-4 text-center">
      <button 
        className={`bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 font-black text-white text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3 ${data.className || ''}`}
        onClick={() => handleQuestClick(data.questId)}
      >
        {data.buttonText}
      </button>
    </div>
  ), [handleQuestClick]);

  const renderInfoBox = useCallback((data: any, index: number) => (
    <div key={index} className={`p-6 rounded-2xl bg-blue-100 ${data.className || ''}`}>
      {data.title && (
        <h3 className="text-2xl font-bold text-yellow-600 mb-4 text-center font-gagalin">
          {data.title}
        </h3>
      )}
      <div className="text-slate-800 text-lg leading-relaxed">
        <div className="space-y-6" dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </div>
  ), []);


  const renderImage = useCallback((data: any, index: number) => (
    <div key={index} className="p-6 rounded-2xl text-center">
      <img 
        src={data.src || data.content} 
        alt={data.alt} 
        className={`max-w-full h-auto rounded-lg shadow-lg mx-auto ${data.className || ''}`} 
      />
      {data.caption && (
        <p className="text-slate-600 text-sm mt-2">{data.caption}</p>
      )}
    </div>
  ), []);

  const renderContent = useCallback((storyContent: StoryContent, index: number) => {
    switch (storyContent.type) {
      case 'chapter-header':
        return renderChapterHeader(storyContent.data, index);
      case 'text':
        return renderText(storyContent.data, index);
      case 'two-column':
        return renderTwoColumn(storyContent.data, index);
      case 'three-column':
        return renderThreeColumn(storyContent.data, index);
      case 'quest-button':
        return renderQuestButton(storyContent.data, index);
      case 'info-box':
        return renderInfoBox(storyContent.data, index);
      case 'image':
        return renderImage(storyContent.data, index);
      default:
        return null;
    }
  }, [renderChapterHeader, renderText, renderTwoColumn, renderThreeColumn, renderQuestButton, renderInfoBox, renderImage]);

  return (
    <div className="max-w-4xl mx-auto p-4 leading-relaxed rounded-3xl shadow-2xl border-2 border-blue-200/40 min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[75vh] font-arimo bg-white text-slate-800 flex flex-col justify-center">
      {content.content.map((storyContent, index) => renderContent(storyContent, index))}
    </div>
  );
}
