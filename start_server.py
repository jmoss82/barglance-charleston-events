#!/usr/bin/env python3
import os
import sys
import http.server
import socketserver
import webbrowser

# Change to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print(f"Starting HTTP server in directory: {os.getcwd()}")
print(f"Files available: {os.listdir('.')}")

PORT = 9876

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Suppress log messages
        pass

try:
    with socketserver.TCPServer(("", PORT), QuietHTTPRequestHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        print("Press Ctrl+C to stop")

        # Open browser automatically
        webbrowser.open(f"http://localhost:{PORT}")

        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped")
except Exception as e:
    print(f"Error starting server: {e}")
    sys.exit(1)