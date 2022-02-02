const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

//initialize app + socket
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static folder
app.use("/", express.static(path.join(__dirname, 'public')));

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/main.html"));
});

app.get("/play", (req, res)=>{
    if(req.query.room){
        console.log("user joined room: " + req.query.room);
        res.sendFile(path.join(__dirname, "/public/room.html"));
    }
    else{
        console.log("NO ROOM CODE PROVIDED");
        res.send("NO ROOM CODE PROVIDED");
    }
    
    

})

io.on('connection', socket =>{
    
    socket.on('joinRoom', ({roomCode})=>{
        socket.join(roomCode);
    });

    socket.on('playNote', ({note, room})=>{
        socket.broadcast.to(room).emit('playAudio', note);
    });

    socket.on('releaseNote', ({note, room})=>{
        socket.broadcast.to(room).emit('stopAudio', note);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log("Server runnin' on " + PORT));
