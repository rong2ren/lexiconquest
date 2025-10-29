#!/usr/bin/env python3
"""
Lexicon Quest Story Manager - Web GUI
A web-based GUI that runs in your browser.
"""

import http.server
import socketserver
import json
import os
import sys
import threading
import webbrowser
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import urllib.parse

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from file_manager import FileManager
from story_generator import StoryGenerator

class WebGUI:
    def __init__(self, port=8080):
        self.port = port
        self.file_manager = FileManager()
        self.story_generator = StoryGenerator()
        self.current_issue = None
        self.current_chapter = None
        self.current_page = None
    
    def start_server(self):
        """Start the web server"""
        handler = self.create_handler()
        
        with socketserver.TCPServer(("", self.port), handler) as httpd:
            print(f"🌐 Story Manager Web GUI running at http://localhost:{self.port}")
            print("📚 Open your browser and navigate to the URL above")
            print("🛑 Press Ctrl+C to stop the server")
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{self.port}')
            except:
                pass
            
            httpd.serve_forever()
    
    def create_handler(self):
        """Create HTTP request handler"""
        class StoryManagerHandler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                self.gui = self
                super().__init__(*args, **kwargs)
            
            def do_GET(self):
                """Handle GET requests"""
                if self.path == '/':
                    self.serve_index()
                elif self.path == '/api/issues':
                    self.api_get_issues()
                elif self.path.startswith('/api/issue/'):
                    issue_name = self.path.split('/')[-1]
                    self.api_get_issue(issue_name)
                else:
                    super().do_GET()
            
            def do_OPTIONS(self):
                """Handle OPTIONS requests for CORS"""
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
            
            def do_DELETE(self):
                """Handle DELETE requests"""
                if self.path.startswith('/api/issue/') and '/chapter/' in self.path and not '/page/' in self.path:
                    # Delete chapter: /api/issue/issue1/chapter/0
                    path_parts = self.path.split('/')
                    if len(path_parts) >= 6:
                        issue_name = path_parts[3]
                        chapter_index = int(path_parts[5])
                        self.api_delete_chapter(issue_name, chapter_index)
                    else:
                        self.send_error(400)
                elif self.path.startswith('/api/issue/') and '/chapter/' in self.path and '/page/' in self.path:
                    # Delete page: /api/issue/issue1/chapter/0/page/1
                    path_parts = self.path.split('/')
                    if len(path_parts) >= 8:
                        issue_name = path_parts[3]
                        chapter_index = int(path_parts[5])
                        page_index = int(path_parts[7])
                        self.api_delete_page(issue_name, chapter_index, page_index)
                    else:
                        self.send_error(400)
                else:
                    self.send_error(404)
            
            def do_POST(self):
                """Handle POST requests"""
                if self.path == '/api/create-issue':
                    self.api_create_issue()
                elif self.path == '/api/add-chapter':
                    self.api_add_chapter()
                elif self.path == '/api/add-page':
                    self.api_add_page()
                elif self.path == '/api/update-page':
                    self.api_update_page()
                else:
                    self.send_error(404)
            
            def do_PUT(self):
                """Handle PUT requests"""
                if self.path.startswith('/api/issue/') and '/chapter/' in self.path:
                    # Extract issue name and chapter index from path like /api/issue/issue1/chapter/0
                    path_parts = self.path.split('/')
                    if len(path_parts) >= 6:
                        issue_name = path_parts[3]
                        chapter_index = int(path_parts[5])
                        self.api_update_chapter(issue_name, chapter_index)
                    else:
                        self.send_error(400)
                else:
                    self.send_error(404)
            
            def serve_index(self):
                """Serve the main HTML page"""
                html_content = self.get_html_content()
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(html_content.encode())
            
            def get_html_content(self):
                """Get the HTML content for the web interface"""
                # Read from the separate HTML file
                html_file_path = os.path.join(os.path.dirname(__file__), 'index.html')
                try:
                    with open(html_file_path, 'r', encoding='utf-8') as f:
                        return f.read()
                except FileNotFoundError:
                    return "<h1>Error: index.html not found</h1><p>Please ensure index.html exists in the story-manager directory.</p>"
            
            def api_get_issues(self):
                """API: Get all issues"""
                try:
                    issues = self.file_manager.list_issues()
                    self.send_json_response(issues)
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_get_issue(self, issue_name):
                """API: Get specific issue"""
                try:
                    issue_data = self.story_generator._load_issue_data(issue_name)
                    self.send_json_response(issue_data)
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_create_issue(self):
                """API: Create new issue"""
                try:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    issue_name = data.get('name', '').strip()
                    if not issue_name:
                        self.send_json_error("Issue name is required")
                        return
                    
                    self.story_generator.create_issue(issue_name)
                    self.send_json_response({"success": True, "message": f"Issue '{issue_name}' created successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_add_chapter(self):
                """API: Add chapter"""
                try:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    issue_name = data.get('issue_name', '').strip()
                    title = data.get('title', '').strip()
                    description = data.get('description', '').strip()
                    
                    if not issue_name or not title:
                        self.send_json_error("Issue name and title are required")
                        return
                    
                    self.story_generator.add_chapter(issue_name, title, description)
                    self.send_json_response({"success": True, "message": f"Chapter '{title}' added successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_add_page(self):
                """API: Add page"""
                try:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    issue_name = data.get('issue_name', '').strip()
                    chapter_index = int(data.get('chapter_index', 0))
                    title = data.get('title', '').strip()
                    content = data.get('content', '').strip()
                    
                    if not issue_name or not title:
                        self.send_json_error("Issue name and title are required")
                        return
                    
                    self.story_generator.add_page(issue_name, chapter_index, title, content)
                    self.send_json_response({"success": True, "message": f"Page '{title}' added successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_update_page(self):
                """API: Update page"""
                try:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    issue_name = data.get('issue_name', '').strip()
                    chapter_index = int(data.get('chapter_index', 0))
                    page_index = int(data.get('page_index', 0))
                    content = data.get('content', '').strip()
                    
                    if not issue_name:
                        self.send_json_error("Issue name is required")
                        return
                    
                    self.story_generator.update_page(issue_name, chapter_index, page_index, content)
                    self.send_json_response({"success": True, "message": "Page updated successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_update_chapter(self, issue_name, chapter_index):
                """API: Update chapter"""
                try:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    title = data.get('title', '').strip()
                    
                    if not title:
                        self.send_json_error("Chapter title is required")
                        return
                    
                    # Update the chapter in the story config
                    self.story_generator.update_chapter(issue_name, chapter_index, title)
                    self.send_json_response({"success": True, "message": "Chapter updated successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_delete_chapter(self, issue_name, chapter_index):
                """API: Delete chapter"""
                try:
                    self.story_generator.delete_chapter(issue_name, chapter_index)
                    self.send_json_response({"success": True, "message": "Chapter deleted successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def api_delete_page(self, issue_name, chapter_index, page_index):
                """API: Delete page"""
                try:
                    self.story_generator.delete_page(issue_name, chapter_index, page_index)
                    self.send_json_response({"success": True, "message": "Page deleted successfully!"})
                except Exception as e:
                    self.send_json_error(str(e))
            
            def send_json_response(self, data):
                """Send JSON response"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            
            def send_json_error(self, message):
                """Send JSON error response"""
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                self.wfile.write(json.dumps({"error": message}).encode())
        
        # Add the file_manager and story_generator to the handler
        StoryManagerHandler.file_manager = self.file_manager
        StoryManagerHandler.story_generator = self.story_generator
        
        return StoryManagerHandler
    

def main():
    """Main function to run the web GUI"""
    print("🌐 Starting Lexicon Quest Story Manager - Web GUI")
    print("=" * 60)
    
    # Check if we're in the right directory
    current_dir = Path.cwd()
    if not (current_dir / "file_manager.py").exists():
        print("❌ file_manager.py not found. Please run from the story-manager directory.")
        return
    
    # Check if the website structure exists
    website_dir = current_dir.parent
    if not (website_dir / "src" / "components").exists():
        print("❌ Website structure not found. Please ensure you're in the correct directory.")
        print("   Expected structure: website/story-manager/")
        return
    
    print("✅ Directory structure looks good")
    print("✅ Starting web server...")
    
    try:
        gui = WebGUI(port=8080)
        gui.start_server()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
