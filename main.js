const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const WebSocket = require('ws');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;


const wsServer = new WebSocket.Server({server: httpServer}, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));
let correctData;

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    fs.readdir(path.resolve(__dirname, `./photos`), (err, files) => {
        if (err) {
            fs.mkdir(path.resolve(__dirname, 'photos'), (err) => {
                if (err) {
                    console.log("Photos directory wasn't created!")
                } else console.log("Photos directory created!")
            })
        }
    });
    ws.on('message', data => {
        const filename = uuidv4();
        correctData = data.split(';base64,').pop();
        fs.writeFile(path.resolve(__dirname, `./photos/${filename}.jpg`), correctData, 'base64', (err) => {
            if (err) throw err;
            console.log(`The file ${filename} has been saved!`);
        })
    });
});


app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));


httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));
