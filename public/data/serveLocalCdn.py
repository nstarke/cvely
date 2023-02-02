#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

class CORSRequestHandler(SimpleHTTPRequestHandler):
   def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('./server.pem')
httpd = HTTPServer(('0.0.0.0', 8080), CORSRequestHandler)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()