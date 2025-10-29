# JSON-Based Story System Plan

## Overview
This plan converts the current HTML-heavy story configuration system to a JSON-based approach that's much easier to write and maintain.

## Current Problems
1. **Verbose HTML**: Each page requires writing full HTML with repetitive classes
2. **Hard to maintain**: Changes to styling require updating multiple files
3. **Error-prone**: Easy to make typos in HTML strings
4. **Not reusable**: Similar layouts are recreated from scratch each time

## Solution: JSON-Based Content System

### 1. New Type System (`src/types/storyContentTypes.ts`)
- **StoryContent**: Base interface with type and data fields
- **Specific data types** for each content type:
  - `ChapterHeaderData`: Background images with titles
  - `TextData`: Simple text content with optional styling
  - `TwoColumnData`: Image + text layouts
  - `QuestData`: Interactive quest elements
  - `InfoBoxData`: Highlighted information boxes
  - `ImageData`: Simple images with captions
  - `ChoiceData`: Multiple choice interactions

### 2. JSON Story Renderer (`src/components/story/JSONStoryRenderer.tsx`)
- **Component-based rendering**: Each content type has its own renderer
- **Event handling**: Maintains quest button and choice interactions
- **Styling consistency**: All styling is handled in the renderer
- **Type safety**: Full TypeScript support

### 3. Content Types Available

#### Chapter Headers
```json
{
  "type": "chapter-header",
  "data": {
    "backgroundImage": "/issues/issue1/background.png",
    "title": "Chapter 1",
    "subtitle": "A Strange Invitation"
  }
}
```

#### Text Content
```json
{
  "type": "text",
  "data": {
    "content": "<p>Your story text here with <span class=\"font-bold\">formatting</span></p>",
    "className": "optional-custom-class"
  }
}
```

#### Two-Column Layouts
```json
{
  "type": "two-column",
  "data": {
    "left": {
      "type": "text",
      "content": "Text content here"
    },
    "right": {
      "type": "image",
      "content": "/path/to/image.png",
      "alt": "Image description"
    }
  }
}
```

#### Quest Elements
```json
{
  "type": "quest",
  "data": {
    "title": "Your Mission: Find the Continent",
    "description": "Quest description here",
    "image": "/path/to/image.png",
    "buttonText": "Start Quest",
    "questId": 2
  }
}
```


#### Info Boxes
```json
{
  "type": "info-box",
  "data": {
    "title": "Important Information",
    "content": "Info box content here",
    "type": "info"
  }
}
```

#### Choice Interactions
```json
{
  "type": "choice",
  "data": {
    "title": "Make Your Choice",
    "description": "Choose your action:",
    "options": [
      { "id": "option1", "text": "First option" },
      { "id": "option2", "text": "Second option" }
    ]
  }
}
```

## Benefits

### 1. **Dramatically Reduced Code**
- **Before**: 50+ lines of HTML per page
- **After**: 5-10 lines of JSON per page

### 2. **Easy to Write**
- No HTML knowledge required
- Clear, structured data
- TypeScript autocomplete support

### 3. **Consistent Styling**
- All styling handled in the renderer
- Easy to update global styles
- No duplicate CSS classes

### 4. **Maintainable**
- Changes to layout affect all pages automatically
- Easy to add new content types
- Clear separation of content and presentation

### 5. **Type Safe**
- Full TypeScript support
- Compile-time error checking
- IntelliSense support

## Migration Strategy

### Phase 1: Parallel Implementation
1. Keep existing HTML system working
2. Implement new JSON system alongside
3. Test with a few pages first

### Phase 2: Gradual Migration
1. Convert pages one by one
2. Test each conversion thoroughly
3. Update story reader to support both formats

### Phase 3: Full Migration
1. Convert all remaining pages
2. Remove old HTML system
3. Update all references

## Implementation Steps

### 1. ✅ Create Type System
- Define all content types
- Ensure type safety
- Support all current functionality

### 2. ✅ Create JSON Renderer
- Handle all content types
- Maintain event handling
- Preserve styling consistency

### 3. ✅ Create Example Migration
- Convert sample pages to JSON
- Demonstrate the benefits
- Show the dramatic code reduction

### 4. 🔄 Integration (Next Steps)
- Update FlexibleStoryReader to support both formats
- Add migration utilities
- Create conversion tools

## Example Comparison

### Before (HTML):
```typescript
{
  id: "page-1-4",
  htmlContent: `
    <div class="p-6 rounded-2xl text-left">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex justify-center items-center">
          <img src="/issues/issue1/fanelle.png" alt="Fanelle" class="max-w-full h-120 rounded-lg shadow-lg" />
        </div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-yellow-600 mb-4 font-gagalin">SPECIAL LOOK</h3>
          <p class="text-lg leading-relaxed">Fanelle's antlers grow clusters of glowing crystals...</p>
        </div>
      </div>
    </div>
  `
}
```

### After (JSON):
```typescript
{
  id: "page-1-4",
  content: [
    {
      type: "character-profile",
      data: {
        image: "/issues/issue1/fanelle.png",
        name: "Fanelle",
        category: "special-look",
        content: "Fanelle's antlers grow clusters of glowing crystals..."
      }
    }
  ]
}
```

## Next Steps

1. **Test the new system** with the example pages
2. **Update FlexibleStoryReader** to support both formats
3. **Create migration tools** to convert existing pages
4. **Gradually migrate** all story content
5. **Remove old HTML system** once migration is complete

This system will make story creation much faster and more maintainable while preserving all current functionality.
