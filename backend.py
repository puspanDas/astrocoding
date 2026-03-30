import http.server
import socketserver
import json
import subprocess
import tempfile
import os
import sys

import ai_rag_service

PORT = 8000

class CodeExecutionHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/agent/index':
            try:
                res = ai_rag_service.index_codebase()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
                
        elif self.path == '/api/agent/chat':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                query = data.get('question', '')
                
                res = ai_rag_service.query_assistant(query)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
                
        elif self.path == '/api/agent/fix':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                code = data.get('code', '')
                language = data.get('language', 'python')
                error_msg = data.get('error', '')
                
                res = ai_rag_service.fix_code(code, language, error_msg)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
                
        elif self.path == '/execute':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                code = data.get('code', '')
                
                # Execute code
                with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as f:
                    f.write(code)
                    temp_name = f.name
                
                try:
                    result = subprocess.run([sys.executable, temp_name], capture_output=True, text=True, timeout=5)
                    output = result.stdout + result.stderr
                except subprocess.TimeoutExpired:
                    output = "Error: Execution timed out (5s limit)"
                except Exception as e:
                    output = f"Execution error: {str(e)}"
                finally:
                    if os.path.exists(temp_name):
                        os.remove(temp_name)
                    
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'output': output}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=http.server.HTTPServer, handler_class=CodeExecutionHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"✅ Python Code Execution Backend running on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Backend server stopped.")

if __name__ == '__main__':
    run()
