
const socket = io();

//elements
const roomLabel = document.getElementById("roomlabel");
const whiteKeyContainer = document.getElementById("whitekeys");
const blackKeyContainer = document.getElementById("blackkeys");
const audioContainer = document.getElementById("audioSources");



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
const offset = [0, 1, 1, 2, 3, 3, 4]; //offset for converting white key index to overall key index
whiteKeys = [];
blackKeys = [];
audioSources = [];
for(i = 0; i < 52; i ++){
    btn = document.createElement("BUTTON");
    btn.classList.add("whiteKey");

    whiteKeys.push(btn); //store in array of keys
    const ind = i;

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
const blackOffset = [1, 3, 4, 6, 7];
for(i = 0; i < 36; i ++){
    btn = document.createElement("BUTTON");
    btn.classList.add("blackKey");

    blackKeys.push(btn);
    const ind = i;
     //process the ind (note number)
     const pitch = (ind % 5) + blackOffset[ind % 5];
     const octave = Math.floor(ind/5);
     const blackInd = octave * 12 + pitch;

      //add functionality
    btn.addEventListener("mousedown", ()=>{
        socket.emit("playNote", {note: blackInd, room: roomCode});
    });
    btn.addEventListener("mouseup", ()=>{
        socket.emit("releaseNote", {note: blackInd, room: roomCode});
    });
    btn.addEventListener("mouseleave", ()=>{
        socket.emit("releaseNote", {note: blackInd, room: roomCode});
    });

    //insert button into document
    blackKeyContainer.appendChild(btn);

    //insert spacers for black key
    if(i % 5 == 0 || i % 5 == 2){
        div = document.createElement("DIV");
        div.classList.add("blackSpacer");
        blackKeyContainer.appendChild(div);
    }
}



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
const pitches = ['a', 'a%23', 'b', 'c', 'c%23', 'd', 'd%23', 'e', 'f', 'f%23', 'g', 'g%23'];
function indexToFileName(ind){
    const pitch = pitches[ind % 12];
    const octave = Math.floor((ind + 9)/12);
    return ("../audio/" + pitch + octave + ".ogg");
}

//making the audio players
for(i = 0; i < 88; i ++){
    source = document.createElement("AUDIO");
    console.log(indexToFileName(i));
    source.src = indexToFileName(i);
    audioSources.push(source);
    source.load(); //preload the audio so no delay
    audioContainer.appendChild(source);
}


//recieving notes
socket.on("playAudio", (note)=>{
    console.log(note + " played");
    audioSources[note].currentTime = 0;
    audioSources[note].play();
    
})

//stopping notes
socket.on("stopAudio", (note) =>{
    audioSources[note].pause();
});
