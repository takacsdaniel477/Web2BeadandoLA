const { getData } = require('./db.js');

const { uzenetKuldes } = require('./kapcsolat.js');
const { getKapcsolat } = require('./bekuldott.js');

const { crud } = require('./crud.js');

const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html; charset=utf-8';
	
	if (req.url === '/getData') {
		getData((htmlResult) => {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(htmlResult);
		});
        return;
    }
	
	if (req.url === '/getKapcsolat') {
		getKapcsolat((htmlResult) => {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(htmlResult);
		});
        return;
    }
	
	if (req.url === '/uzenetKuldes') {
        uzenetKuldes(req, res);
        return;
    }
	
	if (req.url.startsWith("/crud")) {
        crud(req, res);
        return;
    }

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg';
            break;
    }
	
    fs.readFile(filePath, (err, content) => {
        if (!err) {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(8038);