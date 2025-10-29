# 📚 Lexicon Quest Story Manager - Web GUI

A beautiful web-based GUI application for creating and managing story content for the Lexicon Quest React application.

## 🚀 Quick Start

### Prerequisites
- Python 3.6 or higher
- No additional dependencies required!

### Installation & Setup

```bash
# Navigate to the story-manager directory
cd website/story-manager

# Run the web GUI
python start_web_gui.py
```

Then open your browser to: `http://localhost:8080`

## 🎮 GUI Features

### Main Interface
- **Left Panel**: Issues and Chapters management
- **Right Panel**: Pages and Content editing
- **Status Bar**: Shows current operation status

### Key Features
- ✅ **Visual Issue Management**: Create, view, and manage story issues
- ✅ **Chapter Organization**: Add and organize chapters with titles and descriptions
- ✅ **Page Editor**: Rich text editor for HTML content
- ✅ **Real-time Preview**: See your content as you edit
- ✅ **File Generation**: Automatically creates TypeScript files
- ✅ **Index Updates**: Updates storyIndex.ts automatically

## 🎯 How to Use

### 1. Create a New Issue
1. Click **"+ New Issue"** button
2. Enter issue name (e.g., "teamquest", "desert-adventure")
3. Add optional description
4. Click **"Create"**

### 2. Add Chapters
1. Select an issue from the list
2. Click **"+ Add Chapter"** button
3. Enter chapter title and description
4. Click **"Add"**

### 3. Add Pages
1. Select an issue and chapter
2. Click **"+ Add Page"** button
3. Enter page title and HTML content
4. Click **"Add"**

### 4. Edit Content
1. Select an issue, chapter, and page
2. Edit the HTML content in the editor
3. Click **"Save Content"** to save changes

## 📁 Generated Files

When you create content, the GUI generates:

```
website/src/components/teamquest/
└── storyConfig.ts          # Generated story configuration
```

And updates:
```
website/src/data/storyIndex.ts  # Updated to include new issue
```

## 🎨 Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│ 📚 Lexicon Quest Story Manager                         │
├─────────────────────────────────────────────────────────┤
│ Issues & Chapters    │ Pages & Content                 │
│ ┌─────────────────┐  │ ┌─────────────────────────────┐ │
│ │ Issues:         │  │ │ Pages:                      │ │
│ │ • teamquest     │  │ │ • Page 1: Welcome...        │ │
│ │ • desert-adv    │  │ │ • Page 2: The Journey...    │ │
│ │                 │  │ │                             │ │
│ │ Chapters:       │  │ │ Content Editor:             │ │
│ │ • Chapter 1     │  │ │ ┌─────────────────────────┐ │ │
│ │ • Chapter 2     │  │ │ │ <div class="mb-8...">   │ │ │
│ │                 │  │ │ │   <h2>Welcome</h2>      │ │ │
│ │ [+ New Issue]   │  │ │ │   <p>Content here...</p>│ │ │
│ │ [+ Add Chapter]│  │ │ │ </div>                   │ │ │
│ └─────────────────┘  │ │ └─────────────────────────┘ │ │
│                      │ │ [Save] [Preview] [Clear]   │ │
│                      │ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Technical Details

### Generated Story Config Structure
```typescript
import type { StoryIssue } from '../../types/storyTypes';

export const storyTeamquest: StoryIssue = {
  id: "teamquest",
  backgroundTheme: "antarctica",
  chapters: [
    {
      id: "chapter-1",
      title: "Chapter 1",
      description: "First chapter",
      theme: "adventure",
      pages: [
        {
          id: "page-1-1",
          htmlContent: `<div>Your HTML content here</div>`
        }
      ]
    }
  ]
};
```

### File Operations
- **Create Issue**: Generates new directory and storyConfig.ts
- **Add Chapter**: Updates storyConfig.ts with new chapter
- **Add Page**: Updates storyConfig.ts with new page
- **Edit Content**: Updates existing page content
- **Index Update**: Automatically updates storyIndex.ts

## 🚀 Workflow

1. **Launch GUI**: `python launcher.py`
2. **Create Issue**: Use the interface to create new story issues
3. **Add Content**: Add chapters and pages with rich HTML content
4. **Edit & Preview**: Use the built-in editor to refine content
5. **Save & Deploy**: Commit and push your changes to deploy

## 🔍 Troubleshooting

### Common Issues

stop previous server:
- lsof -ti:8080
- kill 1149


## 📄 License

Part of the Lexicon Quest project.