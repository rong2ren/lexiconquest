#!/usr/bin/env python3
"""
Simple launcher for the Web GUI
"""

import sys
from pathlib import Path

def main():
    """Launch the web GUI"""
    print("🌐 Starting Lexicon Quest Story Manager - Web GUI")
    print("=" * 60)
    
    # Check if we're in the right directory
    current_dir = Path.cwd()
    if not (current_dir / "web_gui.py").exists():
        print("❌ web_gui.py not found. Please run from the story-manager directory.")
        return
    
    print("✅ Starting web server...")
    print("📚 The GUI will open in your browser automatically")
    print("🛑 Press Ctrl+C to stop the server")
    print()
    
    try:
        from web_gui import main as run_web_gui
        run_web_gui()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting web GUI: {e}")

if __name__ == "__main__":
    main()
