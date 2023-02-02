#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        return super(CORSRequestHandler, self).end_headers()


httpd = HTTPServer(('0.0.0.0', 8080), CORSRequestHandler)
httpd.serve_forever()