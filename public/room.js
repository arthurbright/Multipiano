
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
testButton.addEventListener("click", ()=>{
    socket.emit("playNote", {note: 5, room: roomCode});
})
testButton2.addEventListener("click", ()=>{
    socket.emit("playNote", {note: 0, room: roomCode});
})
//TO PLAY A NOTE, socket.emit("playNote", {note: 5, room: roomCode});

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


//function to determine if room code is valid
function validRoomCode(str){
    //no need to check for null code
    
    return true;
}