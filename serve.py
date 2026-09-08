"""
Local preview server for the site.

Run it from this folder:

    python serve.py

then open http://127.0.0.1:8765

Sends Cache-Control: no-store on everything, so edits show up on a normal
reload - no hard refresh needed. That matters here because index.html has no
cache-busting query string of its own, and a cached copy has more than once
looked like a change simply hadn't worked.

Stop it with Ctrl+C.
"""

import http.server
import os
import socketserver

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # keep the console quiet


def main():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
        print(f"Serving {ROOT}")
        print(f"  ->  http://127.0.0.1:{PORT}")
        print("Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
