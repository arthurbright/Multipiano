
const socket = io();

//elements
const roomLabel = document.getElementById("roomlabel");
const whiteKeyContainer = document.getElementById("whitekeys");
const blackKeyContainer = document.getElementById("blackkeys");
const audioContainer = document.getElementById("audioSources");
const volumeSlider = document.getElementById("volumeSlider");
const icon = document.getElementById("icon");



const testButton = document.getElementById("testButton");
const testButton2 = document.getElementById("testButton2");
const testAudio = document.getElementById("testAudio1");
const testAudio2 = document.getElementById("testAudio2");


const urlSearchParams = new URLSearchParams(window.location.search);
const roomCode = urlSearchParams.get('room');

//set label
roomLabel.innerHTML = "Room code: " + roomCode;

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
    return str.match(/^[a-z]+$/);
}


//add click to the icon (goes back to home)
icon.addEventListener("click", (e)=>{
    window.location.href = "/";
});



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
        playLocalNote(whiteInd);
    });
    btn.addEventListener("mouseup", ()=>{
        releaseLocalNote(whiteInd);
    });
    btn.addEventListener("mouseleave", ()=>{
        releaseLocalNote(whiteInd);
    });
    btn.addEventListener("mouseenter", (e)=>{
        //only if the left mouse button is pressed down
        if(e.buttons == 1){
            playLocalNote(whiteInd);
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
        playLocalNote(blackInd);
    });
    btn.addEventListener("mouseup", ()=>{
        releaseLocalNote(blackInd);
    });
    btn.addEventListener("mouseleave", ()=>{
        releaseLocalNote(blackInd);
    });
    btn.addEventListener("mouseenter", (e)=>{
        //only if the left mouse button is pressed down
        if(e.buttons == 1){
            playLocalNote(blackInd);
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
    return ("../audio2/" + pitch + octave + ".wav");
}

//making the audio players
for(i = 0; i < 88; i ++){
    source = document.createElement("AUDIO");
    source.src = indexToFileName(i);
    audioSources.push(source);
    source.load(); //preload the audio so no delay
    source.volume = 0.6; //initial volume set a little lower than max
    audioContainer.appendChild(source);
}




///////////////////////////////////////////////////////////////client recieving information
//recieving notes
socket.on("playAudio", (note)=>{
    //console.log(note + " played");
    audioSources[note].currentTime = 0;
    audioSources[note].play();
    noteState.set(note, true);
    colorNote(note);

    
})

//stopping notes
socket.on("stopAudio", (note) =>{
    audioSources[note].pause();
    noteState.set(note, false);
    colorNote(note);
});



//coloring notes
const ONCOLOR = "#66d7eb";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const offset2 = [0, 0, 1, 2, 1, 3, 2, 4, 5, 3, 6, 4];

const RANGEON = "#51acc5";
const RANGEWHITE = "#B2FFFF";
const RANGEBLACK = "#1c3d52";

function inRange(note) {
    return (keyMaps.get('CapsLock') + shift <= note) 
        && (note <= keyMaps.get('Enter') + shift);
}

function colorNote(note){
    var on = noteState.get(note);
    var pitch = note % 12;
    var octave = Math.floor(note/12);

    //if its a black key
    if(pitch == 1 || pitch == 4 || pitch == 6 || pitch == 9 || pitch == 11){
        var ind = octave * 5 + offset2[pitch];
        if (on && inRange(note)) {
            blackKeys[ind].style.backgroundColor = RANGEON;
        }
        else if (on){
            blackKeys[ind].style.backgroundColor = ONCOLOR;
        }
        else if (inRange(note)) {
            blackKeys[ind].style.backgroundColor = RANGEBLACK;
        }
        else {
            blackKeys[ind].style.backgroundColor = BLACK;
        }
    }
    //if its a white key
    else{
        var ind = octave * 7 + offset2[pitch];
        if (on && inRange(note)) {
            whiteKeys[ind].style.backgroundColor = RANGEON;
        }
        else if (on) {
            whiteKeys[ind].style.backgroundColor = ONCOLOR;
        }
        else if (inRange(note)) {
            whiteKeys[ind].style.backgroundColor = RANGEWHITE;
        }
        else {
            whiteKeys[ind].style.backgroundColor = WHITE;
        }
    }
}




///////////////////////////////////////////////////////////key shortcuts
//A0 = 0
//C1 = 3, C2 = 15, C3 = 27, C4 = 39, C5 = 51, C6 = 63, C7 = 75, C8 = 87

const keyMapsArray = 
[['ShiftK', -100000], ['CapsLock', 46], ['q', 47], ['a', 48], ['w', 49], ['s', 50], 
['d', 51], ['r', 52], ['f', 53], ['t', 54], ['g', 55], ['h', 56], ['u', 57], ['j', 58], ['i', 59], ['k', 60], ['o', 61], ['l', 62], 
[';', 63], ['[', 64], ["'", 65], [']', 66], ['Enter', 67]];
//turn keyMapsArray into map
const keyMaps = new Map();

const curPressed = new Map(); //keep track of which notes are pressed to prevent input spam

for (pair of keyMapsArray){
    keyMaps.set(pair[0], pair[1]);
    curPressed.set(pair[0], false);
}

const noteState = new Map();
for (i = 0; i < 88; i++) {
    noteState.set(i, false);
}

shift = 0;
const shift_rlim = 36;
const shift_llim = -60;

//add listeners for each key in the keymap
document.addEventListener("keydown", (e)=>{

    var key = e.key;

    //detect if key is a shift key
    if(e.key == 'Shift' && !curPressed.get('ShiftK')) {
        curPressed.set('ShiftK', true);
        if(e.location == KeyboardEvent.DOM_KEY_LOCATION_LEFT) { // Left Shift
            if (shift-12 >= shift_llim) {
                changeShift(-12);
            }
        }
        else { // Right Shift
            if (shift+12 <= shift_rlim) {
                changeShift(12);
            }
        }
    }
    // left arrow
    else if(e.key == 'ArrowLeft') {
        if (shift-1 >= shift_llim) {
            changeShift(-1);
        }
    }
    else if (e.key == 'ArrowRight') {
        if (shift+1 <= shift_rlim) {
            changeShift(1);
        }
    }
    else {
        //take care of caps lock first
        if(e.key.length == 1){
            key = key.toLowerCase();
        }
        
        //play key accordingly
        if(keyMaps.get(key) && !curPressed.get(key)){
            playKey(key);    
        }
    }
});

function changeShift(delta) {
    // unpress all currently pressed keys + repress them in new shift
    for (const [key, value] of curPressed.entries()) {
        if (value) {  // if key pressed
            releaseKey(key);
            shift += delta;
            playKey(key);
            shift -= delta;
        }
    }
    shift += delta;
    colorNotes();
}

document.addEventListener("keyup", (e)=>{
    //take care of caps lock first
    var key = e.key;
    if(e.key.length == 1){
        key = key.toLowerCase();
    }

    if(e.key == 'Shift') {
        curPressed.set('ShiftK', false);
    }

    //release key accordingly
    if(keyMaps.get(key)){
        releaseKey(key);
    }
});

function playKey(key) {
    curPressed.set(key, true);
    var cnote = keyMaps.get(key) + shift; // value of note pressed
    if (0 <= cnote && cnote <= 87) {
        playLocalNote(cnote);
    }
}

function releaseKey(key) {
    curPressed.set(key, false);
    var cnote = keyMaps.get(key) + shift; // value of note pressed
    if (0 <= cnote && cnote <= 87) {
        releaseLocalNote(cnote);
    }
}





////////////////////////////////////////////////////////////////MAIN NOTE PLAYING FUNCTIONS
function playLocalNote(note){
    socket.emit("playNote", {note: note, room: roomCode});
    audioSources[note].currentTime = 0;
    audioSources[note].play();
    noteState.set(note, true);
    //colorNote(note);
    colorNotes();
}

function releaseLocalNote(note){
    socket.emit("releaseNote", {note: note, room: roomCode});
    audioSources[note].pause();
    noteState.set(note, false);
    //colorNote(note);
    colorNotes();
}

function colorNotes() {
    // super jank and temporary
    for (i = 0; i < 88; i++) {
        colorNote(i);
    }
}



///////////////////////////////////////////VOLUME CONTROL AND FADING(TODO)
volumeSlider.onchange = ()=>{
    for(i = 0; i < audioSources.length; i ++){
        audioSources[i].volume = volumeSlider.value/100;
    }

    
}
