const urlSearchParams = new URLSearchParams(window.location.search);
const roomCode = urlSearchParams.get('room');

//if room code is not valid, go back or redirect
//currently, this code redirects back to home
if(!validRoomCode(roomCode)){
    window.location.href = "/";
}


//function to determine if room code is valid
function validRoomCode(str){
    //no need to check for null code
    
    return true;
}