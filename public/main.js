const inputbox = document.getElementById("inputbox");
const submitButton = document.getElementById("submitButton");



submitButton.addEventListener("click", ()=>{
    const txt = inputbox.value;
    console.log(txt);

    //process the input value?

    window.location.href = "play/?room=" + txt;

});