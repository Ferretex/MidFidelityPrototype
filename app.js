//this is our javascript web server
const express   = require("express");       //require == #include
const app       = express();
const http      = require("http");
const server    = http.createServer(app);
const io        = require('socket.io')(server);     //our websocket library

const LISTEN_PORT       = 8080;           //default port 80
const ABS_STATIC_PATH   = __dirname + '/public';

//set our routes
app.get('/', function (req, res) {
    res.sendFile('index.html', {root:ABS_STATIC_PATH});
});

//socket events here
io.on('connection', (socket) => {
    console.log(socket.id + " is connected!");

    socket.on('disconect', () => {
        console.log(socket.id + " is disconected. :(")
    })

    socket.on('resetPlayerOne', () => {
        io.emit('resetP1');
    });

    socket.on('resetPlayerTwo', () => {
        io.emit('resetP2');
    });

    socket.on('game_end', (data) => {
        console.log("Stage One Ended");
        io.emit('delete_walls', data);
    });

    socket.on('lightchange', (data) => {
        console.log(data + " ON");
        io.emit('lightup', data);
    });

    socket.on('playerOneMoves', (locX, locZ) => {
        //console.log("Player Moved:" + locX + ', ' + locZ);
        io.emit('displayLocation', locX, locZ);
    });

    socket.on('player_hit', (data) => {
        console.log("Player Hit:" + data);
        io.emit('p1_hit', data);
    });
});

server.listen(LISTEN_PORT);                         //starts server
app.use(express.static(__dirname + '/public'));     //the client can access these files via http
console.log("Listening on port: " + LISTEN_PORT);   //a console output so we know something is happening