"""
File Manager for Lexicon Quest Story Content
Handles file operations and project structure management.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Any

class FileManager:
    def __init__(self):
        # Get the project root (assuming this script is in website/story-manager/)
        self.project_root = Path(__file__).parent.parent
        self.website_path = self.project_root
        self.components_path = self.website_path / "src" / "components"
        self.data_path = self.website_path / "src" / "data"
        self.story_index_path = self.data_path / "storyIndex.ts"
    
    def issue_exists(self, issue_name: str) -> bool:
        """Check if an issue already exists"""
        issue_path = self.components_path / issue_name
        return issue_path.exists()
    
    def create_issue_directory(self, issue_name: str) -> Path:
        """Create directory for new issue"""
        issue_path = self.components_path / issue_name
        issue_path.mkdir(parents=True, exist_ok=True)
        return issue_path
    
    def list_issues(self) -> List[Dict[str, Any]]:
        """List all existing issues"""
        issues = []
        
        if not self.components_path.exists():
            return issues
        
        for item in self.components_path.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                # Check if it has a storyConfig.ts file
                config_file = item / "storyConfig.ts"
                if config_file.exists():
                    try:
                        issue_data = self.load_issue(item.name)
                        issues.append(issue_data)
                    except Exception:
                        # If we can't load the issue, skip it
                        continue
        
        return issues
    
    def load_issue(self, issue_name: str) -> Dict[str, Any]:
        """Load issue data from storyConfig.ts file"""
        config_path = self.components_path / issue_name / "storyConfig.ts"
        
        if not config_path.exists():
            raise FileNotFoundError(f"Issue '{issue_name}' not found")
        
        # Read the TypeScript file and parse it
        content = config_path.read_text(encoding='utf-8')
        
        # This is a simplified parser - in a real implementation,
        # you'd want to use a proper TypeScript parser
        # For now, we'll extract basic information
        
        # Extract issue ID
        id_match = re.search(r'id:\s*["\']([^"\']+)["\']', content)
        issue_id = id_match.group(1) if id_match else issue_name
        
        # Extract background theme
        theme_match = re.search(r'backgroundTheme:\s*["\']([^"\']+)["\']', content)
        background_theme = theme_match.group(1) if theme_match else "antarctica"
        
        # Count chapters and pages (simplified)
        chapter_matches = re.findall(r'id:\s*["\']chapter-\d+["\']', content)
        page_matches = re.findall(r'id:\s*["\']page-\d+-\d+["\']', content)
        
        return {
            'name': issue_name,
            'id': issue_id,
            'backgroundTheme': background_theme,
            'chapters': [],  # Would need more complex parsing for full data
            'path': str(config_path)
        }
    
    def write_story_config(self, issue_name: str, content: str) -> None:
        """Write story configuration to file"""
        config_path = self.components_path / issue_name / "storyConfig.ts"
        config_path.write_text(content, encoding='utf-8')
    
    def update_story_index(self, issue_name: str, capitalized_name: str) -> None:
        """Update the storyIndex.ts file to include new issue"""
        if not self.story_index_path.exists():
            # Create basic storyIndex.ts if it doesn't exist
            self._create_basic_story_index()
        
        content = self.story_index_path.read_text(encoding='utf-8')
        
        # Add import statement
        import_line = f"import {{ story{capitalized_name} }} from '../components/{issue_name}/storyConfig';"
        
        # Check if import already exists
        if import_line not in content:
            # Find the last import and add after it
            import_pattern = r'(import.*?from.*?;)'
            imports = re.findall(import_pattern, content)
            if imports:
                last_import = imports[-1]
                content = content.replace(last_import, f"{last_import}\n{import_line}")
            else:
                # Add at the beginning if no imports found
                content = f"{import_line}\n\n{content}"
        
        # Add to storyIssues object
        story_issues_pattern = r'(export const storyIssues: { \[key: string\]: any } = {)([\s\S]*?)(};)'
        match = re.search(story_issues_pattern, content)
        
        if match:
            prefix = match.group(1)
            middle = match.group(2)
            suffix = match.group(3)
            
            # Add new issue to the object
            new_entry = f'  "{issue_name}": story{capitalized_name},'
            if new_entry not in middle:
                # Add before the closing brace
                middle = middle.rstrip() + f"\n{new_entry}\n"
                content = content.replace(match.group(0), f"{prefix}{middle}{suffix}")
        
        self.story_index_path.write_text(content, encoding='utf-8')
    
    def _create_basic_story_index(self) -> None:
        """Create a basic storyIndex.ts file"""
        basic_content = '''// Central index for all story configurations
// This makes it easy to import all story configs from one place

import { storyIssue1 } from '../components/issue1/storyConfig';
// import { storyIssue2 } from '../components/issue2/storyConfig';
// import { storyIssue3 } from '../components/issue3/storyConfig';
// import { storyTeam1 } from '../components/team1/storyConfig';
// ... add more issues as they are created

// Export all story issues as an object with string keys
export const storyIssues: { [key: string]: any } = {
  "issue1": storyIssue1,
  // "issue2": storyIssue2,
  // "issue3": storyIssue3,
  // "team1": storyTeam1,
  // ... add more issues here
};

// Export individual issues for direct access
export { storyIssue1 };
// export { storyIssue2 };
// export { storyIssue3 };
// export { storyTeam1 };
'''
        self.story_index_path.write_text(basic_content, encoding='utf-8')
    
    def get_project_structure(self) -> Dict[str, Any]:
        """Get the current project structure"""
        structure = {
            'project_root': str(self.project_root),
            'website_path': str(self.website_path),
            'components_path': str(self.components_path),
            'data_path': str(self.data_path),
            'story_index_path': str(self.story_index_path),
            'exists': {
                'website': self.website_path.exists(),
                'components': self.components_path.exists(),
                'data': self.data_path.exists(),
                'story_index': self.story_index_path.exists()
            }
        }
        return structure