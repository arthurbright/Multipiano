
const socket = io();

//elements
const roomLabel = document.getElementById("roomlabel");
const testButton = document.getElementById("testButton");
const testButton2 = document.getElementById("testButton2");
const testAudio = document.getElementById("testAudio1");
const testAudio2 = document.getElementById("testAudio2");

const urlSearchParams = new URLSearchParams(window.location.search);
const roomCode = urlSearchParams.get('room');

//set label
roomLabel.innerHTML = "You are in room " + roomCode;

//if room code is not valid, go back or redirect
//currently, this code redirects back to home
if(!validRoomCode(roomCode)){
    window.location.href = "/";
}
else{
    socket.emit('joinRoom', {roomCode: roomCode});
}


//debug
testButton2.addEventListener("click", ()=>{
    socket.emit("playNote", {note: 0, room: roomCode});
});

//template for playing with mouse?
testButton.addEventListener("mousedown", ()=>{
    socket.emit("playNote", {note: 5, room: roomCode});
});
testButton.addEventListener("mouseup", ()=>{
    socket.emit("releaseNote", {note: 5, room: roomCode});
});
testButton.addEventListener("mouseleave", ()=>{
    socket.emit("releaseNote", {note: 5, room: roomCode});
})

//recieving notes
socket.on("playAudio", (note)=>{
    console.log(note + " played");
    if(note == 0){
        testAudio.play();
    }
    else{
        testAudio2.play();
    }
    
})

//stopping notes
socket.on("stopAudio", (note) =>{
    if(note == 0){
        testAudio.pause();
        testAudio.currentTime = 0;
    }
    else{
        testAudio2.pause();
        testAudio2.currentTime = 0;
    }
});


//function to determine if room code is valid
function validRoomCode(str){
    //no need to check for null code
    
    return true;
}