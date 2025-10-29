"""
Story Generator for Lexicon Quest
Generates TypeScript story configuration files.
"""

import re
from pathlib import Path
from typing import Dict, List, Any, Optional
from file_manager import FileManager

class StoryGenerator:
    def __init__(self):
        self.file_manager = FileManager()
    
    def create_issue(self, issue_name: str) -> None:
        """Create a new story issue"""
        # Create directory
        self.file_manager.create_issue_directory(issue_name)
        
        # Generate story config content
        capitalized_name = self._capitalize(issue_name)
        content = self._generate_story_config_content(issue_name, capitalized_name)
        
        # Write story config file
        self.file_manager.write_story_config(issue_name, content)
        
        # Update story index
        self.file_manager.update_story_index(issue_name, capitalized_name)
    
    def add_chapter(self, issue_name: str, title: str, description: str = "") -> None:
        """Add a chapter to an existing issue"""
        # Load existing issue data
        issue_data = self._load_issue_data(issue_name)
        
        # Create new chapter
        chapter_number = len(issue_data.get('chapters', [])) + 1
        new_chapter = {
            'id': f'chapter-{chapter_number}',
            'title': title,
            'description': description,
            'theme': 'adventure',
            'pages': [
                {
                    'id': f'page-{chapter_number}-1',
                    'htmlContent': self._generate_default_page_content(title, description)
                }
            ]
        }
        
        # Add chapter to issue
        if 'chapters' not in issue_data:
            issue_data['chapters'] = []
        issue_data['chapters'].append(new_chapter)
        
        # Save updated issue
        self._save_issue_data(issue_name, issue_data)
    
    def add_page(self, issue_name: str, chapter_index: int, title: str, content: str) -> None:
        """Add a page to a chapter"""
        # Load existing issue data
        issue_data = self._load_issue_data(issue_name)
        
        if chapter_index >= len(issue_data.get('chapters', [])):
            raise IndexError(f"Chapter {chapter_index + 1} not found")
        
        chapter = issue_data['chapters'][chapter_index]
        page_number = len(chapter.get('pages', [])) + 1
        chapter_id = chapter.get('id', f'chapter-{chapter_index + 1}')
        
        new_page = {
            'id': f'page-{chapter_index + 1}-{page_number}',
            'htmlContent': content
        }
        
        if 'pages' not in chapter:
            chapter['pages'] = []
        chapter['pages'].append(new_page)
        
        # Save updated issue
        self._save_issue_data(issue_name, issue_data)
    
    def update_page(self, issue_name: str, chapter_index: int, page_index: int, content: str) -> None:
        """Update a specific page"""
        # Load existing issue data
        issue_data = self._load_issue_data(issue_name)
        
        if chapter_index >= len(issue_data.get('chapters', [])):
            raise IndexError(f"Chapter {chapter_index + 1} not found")
        
        chapter = issue_data['chapters'][chapter_index]
        if page_index >= len(chapter.get('pages', [])):
            raise IndexError(f"Page {page_index + 1} not found")
        
        # Update page content
        chapter['pages'][page_index]['htmlContent'] = content
        
        # Save updated issue
        self._save_issue_data(issue_name, issue_data)
    
    def _load_issue_data(self, issue_name: str) -> Dict[str, Any]:
        """Load issue data from the TypeScript file"""
        config_path = self.file_manager.components_path / issue_name / "storyConfig.ts"
        
        if not config_path.exists():
            raise FileNotFoundError(f"Issue '{issue_name}' not found")
        
        content = config_path.read_text(encoding='utf-8')
        
        # Parse the TypeScript content (simplified parser)
        issue_data = {
            'id': issue_name,
            'chapters': []
        }
        
        # Extract chapters using regex (simplified approach)
        chapter_pattern = r'{\s*id:\s*["\'](chapter-\d+)["\'],\s*title:\s*["\']([^"\']+)["\'],\s*pages:\s*\[(.*?)\]\s*}'
        chapter_matches = re.findall(chapter_pattern, content, re.DOTALL)
        
        for match in chapter_matches:
            chapter_id, title, pages_content = match
            chapter = {
                'id': chapter_id,
                'title': title,
                'pages': []
            }
            
            # Extract pages from chapter
            page_pattern = r'{\s*id:\s*["\'](page-\d+-\d+)["\'],\s*htmlContent:\s*`([^`]+)`'
            page_matches = re.findall(page_pattern, pages_content, re.DOTALL)
            
            for page_match in page_matches:
                page_id, html_content = page_match
                page = {
                    'id': page_id,
                    'htmlContent': html_content
                }
                chapter['pages'].append(page)
            
            issue_data['chapters'].append(chapter)
        
        return issue_data
    
    def _save_issue_data(self, issue_name: str, issue_data: Dict[str, Any]) -> None:
        """Save issue data to TypeScript file"""
        capitalized_name = self._capitalize(issue_name)
        content = self._generate_story_config_content_from_data(issue_data, capitalized_name)
        self.file_manager.write_story_config(issue_name, content)
    
    def _generate_story_config_content(self, issue_name: str, capitalized_name: str) -> str:
        """Generate basic story config content for new issue"""
        return f'''import type {{ StoryIssue }} from '../../types/storyTypes';

export const story{capitalized_name}: StoryIssue = {{
  id: "{issue_name}",
  chapters: [
    {{
      id: "chapter-1",
      title: "Chapter 1",
      pages: [
        {{
          id: "page-1-1",
          htmlContent: `${{`<div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">Welcome to {issue_name}</h2>
            <p class="text-slate-800 text-lg">This is the beginning of your adventure!</p>
          </div>`}}`
        }}
      ]
    }}
  ]
}};
'''
    
    def _generate_story_config_content_from_data(self, issue_data: Dict[str, Any], capitalized_name: str) -> str:
        """Generate story config content from issue data"""
        content = f'''import type {{ StoryIssue }} from '../../types/storyTypes';

export const story{capitalized_name}: StoryIssue = {{
  id: "{issue_data['id']}",
  chapters: [
'''
        
        for chapter in issue_data.get('chapters', []):
            content += f'''    {{
      id: "{chapter['id']}",
      title: "{chapter['title']}",
      pages: [
'''
            
            for page in chapter.get('pages', []):
                content += f'''        {{
          id: "{page['id']}",
          htmlContent: `{page['htmlContent']}`
        }},
'''
            
            content += '''      ]
    },
'''
        
        content += '''  ]
};
'''
        
        return content
    
    def _generate_default_page_content(self, title: str, description: str) -> str:
        """Generate default HTML content for a new page"""
        return f'''<div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
  <h2 class="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
  <p class="text-slate-800 text-lg">{description}</p>
</div>'''
    
    def _capitalize(self, text: str) -> str:
        """Capitalize first letter of each word"""
        return ''.join(word.capitalize() for word in text.split('-'))
    
    
    def update_chapter(self, issue_name: str, chapter_index: int, title: str) -> None:
        """Update an existing chapter"""
        try:
            # Load current issue data
            issue_data = self._load_issue_data(issue_name)
            
            if not issue_data or 'chapters' not in issue_data:
                raise ValueError(f"Issue {issue_name} not found or has no chapters")
            
            chapters = issue_data['chapters']
            if chapter_index >= len(chapters):
                raise ValueError(f"Chapter index {chapter_index} out of range")
            
            # Update the chapter
            chapters[chapter_index]['title'] = title
            
            # Save updated issue data (same as update_page method)
            self._save_issue_data(issue_name, issue_data)
            
        except Exception as e:
            raise Exception(f"Failed to update chapter: {str(e)}")
    
    def delete_chapter(self, issue_name: str, chapter_index: int) -> None:
        """Delete an existing chapter"""
        try:
            # Load current issue data
            issue_data = self._load_issue_data(issue_name)
            
            if not issue_data or 'chapters' not in issue_data:
                raise ValueError(f"Issue {issue_name} not found or has no chapters")
            
            chapters = issue_data['chapters']
            if chapter_index >= len(chapters):
                raise ValueError(f"Chapter index {chapter_index} out of range")
            
            # Remove the chapter
            chapters.pop(chapter_index)
            
            # Save updated issue data
            self._save_issue_data(issue_name, issue_data)
            
        except Exception as e:
            raise Exception(f"Failed to delete chapter: {str(e)}")
    
    def delete_page(self, issue_name: str, chapter_index: int, page_index: int) -> None:
        """Delete an existing page"""
        try:
            # Load current issue data
            issue_data = self._load_issue_data(issue_name)
            
            if not issue_data or 'chapters' not in issue_data:
                raise ValueError(f"Issue {issue_name} not found or has no chapters")
            
            chapters = issue_data['chapters']
            if chapter_index >= len(chapters):
                raise ValueError(f"Chapter index {chapter_index} out of range")
            
            chapter = chapters[chapter_index]
            if 'pages' not in chapter:
                raise ValueError(f"Chapter {chapter_index} has no pages")
            
            pages = chapter['pages']
            if page_index >= len(pages):
                raise ValueError(f"Page index {page_index} out of range")
            
            # Remove the page
            pages.pop(page_index)
            
            # Save updated issue data
            self._save_issue_data(issue_name, issue_data)
            
        except Exception as e:
            raise Exception(f"Failed to delete page: {str(e)}")