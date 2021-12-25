const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

//initialize app + socket
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.get("/", (req, res)=>{
    res.send("ooga");
});

io.on('connection', socket =>{
    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log("Server runnin' on " + PORT));