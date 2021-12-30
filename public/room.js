
const socket = io();

//elements
const roomLabel = document.getElementById("roomlabel");
const whiteKeyContainer = document.getElementById("whitekeys");
const blackKeyContainer = document.getElementById("blackkeys");



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

//function to determine if room code is valid
function validRoomCode(str){
    //no need to check for null code
    
    return true;
}

////////////////////////////////////////////////////setting up keys
//WHITE KEYS
const offset = [0, 1, 2, 2, 3, 4, 5]; //offset for converting white key index to overall key index
whiteKeys = [];
for(i = 0; i < 10; i ++){
    btn = document.createElement("BUTTON");
    btn.classList.add("whiteKey");

    whiteKeys.push(btn); //store in array of keys
    const ind = whiteKeys.length - 1;

    //process the ind (note number)
    const pitch = (ind % 7) + offset[ind % 7];
    const octave = Math.floor(ind/7);
    const whiteInd = octave * 12 + pitch;

    //add functionality
    btn.addEventListener("mousedown", ()=>{
        socket.emit("playNote", {note: whiteInd, room: roomCode});
    });
    btn.addEventListener("mouseup", ()=>{
        socket.emit("releaseNote", {note: whiteInd, room: roomCode});
    });
    btn.addEventListener("mouseleave", ()=>{
        socket.emit("releaseNote", {note: whiteInd, room: roomCode});
    });

    //insert button into document
    whiteKeyContainer.appendChild(btn);   

}
//BLACK KEYS
//TODO



//////////////////////////////////////////////////////////////////////interactions


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
});

///////////////////////////////////////////////////////////audio players
//function to convert a note index to file name
const pitches = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
function indexToFileName(ind){
    const pitch = pitches[ind % 12];
    const octave = Math.floor(ind/12);
    return ("../audio/" + pitch + octave + "vL.wav");
}

//making the audio players
//TODO

//recieving notes
socket.on("playAudio", (note)=>{
    console.log(note + " played");
    if(note == 0){
        testAudio.currentTime = 0;
        testAudio.play();
    }
    else{
        testAudio2.currentTime = 0;
        testAudio2.play();
    }
    
})

//stopping notes
socket.on("stopAudio", (note) =>{
    if(note == 0){
        testAudio.pause();
       
    }
    else{
        testAudio2.pause();
        
    }
});
