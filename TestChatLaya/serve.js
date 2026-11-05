/**
 * 本地预览服务器：在项目目录执行 `node serve.js`，
 * 然后浏览器打开 http://127.0.0.1:8765/index.html
 * （也可以用 LayaAirIDE 直接运行本项目）
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'bin');
const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.wav': 'audio/wav',
    '.atlas': 'text/plain',
    '.ani': 'application/json',
    '.prefab': 'application/json',
    '.wasm': 'application/wasm'
};

http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('404');
            return;
        }
        res.writeHead(200, {
            'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
}).listen(8765, '127.0.0.1', () => console.log('preview: http://127.0.0.1:8765/index.html'));
