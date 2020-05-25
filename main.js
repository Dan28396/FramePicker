const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const WebSocket = require('ws');
const fs = require('fs')

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;


const wsServer = new WebSocket.Server({server: httpServer}, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));
let correctData, count = 0;

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    fs.readdir(path.resolve(__dirname, `./photos`), (err, files) => {
        if (err) {
            fs.mkdir(path.resolve(__dirname, 'photos'), (err) => {
                if (err) {
                    console.log("Photos directory wasn't created!")
                } else console.log("Photos directory created!")
            })
        } else count = files.length + 1
    });
    ws.on('message', data => {
        correctData = data.split(';base64,').pop();
        count += 1;
        fs.writeFile(path.resolve(__dirname, `./photos/${count}.jpg`), correctData, 'base64', (err) => {
            if (err) throw err;
            console.log(`The file ${count} has been saved!`);
        })
    });
});


app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));


httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));
