
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
    btn.addEventListener("mouseenter", (e)=>{
        //only if the left mouse button is pressed down
        if(e.buttons == 1){
            socket.emit("playNote", {note: whiteInd, room: roomCode});
        }
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
    btn.addEventListener("mouseenter", (e)=>{
        //only if the left mouse button is pressed down
        if(e.buttons == 1){
            socket.emit("playNote", {note: blackInd, room: roomCode});
        }
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
    source.src = indexToFileName(i);
    audioSources.push(source);
    source.load(); //preload the audio so no delay
    audioContainer.appendChild(source);
}




///////////////////////////////////////////////////////////////client recieving information
//recieving notes
socket.on("playAudio", (note)=>{
    //console.log(note + " played");
    audioSources[note].currentTime = 0;
    audioSources[note].play();
    colorNote(note, true);

    
})

//stopping notes
socket.on("stopAudio", (note) =>{
    audioSources[note].pause();
    colorNote(note, false);
});



//coloring notes
const ONCOLOR = "#0024FF";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const offset2 = [0, 0, 1, 2, 1, 3, 2, 4, 5, 3, 6, 4];
function colorNote(note, on){
    var pitch = note % 12;
    var octave = Math.floor(note/12);

    //if its a black key
    if(pitch == 1 || pitch == 4 || pitch == 6 || pitch == 9 || pitch == 11){
        var ind = octave * 5 + offset2[pitch];
        if(on){
            blackKeys[ind].style.backgroundColor = ONCOLOR;
        }
        else{
            blackKeys[ind].style.backgroundColor = BLACK;
        }
        
        
    }
    //if its a white key
    else{
        var ind = octave * 7 + offset2[pitch];
        if(on){
            whiteKeys[ind].style.backgroundColor = ONCOLOR;
        }
        else{
            whiteKeys[ind].style.backgroundColor = WHITE;
        }
    }
}




//TODO add fade?



///////////////////////////////////////////////////////////key shortcuts
//A0 = 0
//C1 = 3, C2 = 15, C3 = 27, C4 = 39, C5 = 51, C6 = 63, C7 = 75, C8 = 87

const keyMapsArray = 
[['CapsLock', 46], ['q', 47], ['a', 48], ['w', 49], ['s', 50], 
['d', 51], ['r', 52], ['f', 53], ['t', 54], ['g', 55], ['h', 56], ['u', 57], ['j', 58], ['i', 59], ['k', 60], ['o', 61], ['l', 62], 
[';', 63], ['[', 64], ["'", 65], [']', 66], ['Enter', 67]];
//turn keyMapsArray into map
const keyMaps = new Map();

const curPressed = new Map(); //keep track of which notes are pressed to prevent input spam

for(pair of keyMapsArray){
    keyMaps.set(pair[0], pair[1]);
    curPressed.set(pair[0], false);
}



//add listeners for each key in the keymap
document.addEventListener("keydown", (e)=>{

    //take care of caps lock first
    var key = e.key;
    if(e.key.length == 1){
        key = key.toLowerCase();
    }
    
    //play key accordingly
    if(keyMaps.get(key) && !curPressed.get(key)){
        curPressed.set(key, true);
        socket.emit("playNote", {note: keyMaps.get(key), room: roomCode});
    }
});

document.addEventListener("keyup", (e)=>{
    //take care of caps lock first
    var key = e.key;
    if(e.key.length == 1){
        key = key.toLowerCase();
    }

    //play the key if its in the map
    if(keyMaps.get(key)){
        curPressed.set(key, false);
        socket.emit("releaseNote", {note: keyMaps.get(key), room: roomCode});
    }
});

