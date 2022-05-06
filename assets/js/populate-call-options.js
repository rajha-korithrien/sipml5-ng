function addNewButton(onClickFunction, buttonText, buttonClass, buttonId, buttonStyle, parentId){
    const button = document.createElement("input");
    button.type = "button";
    button.value = buttonText;
    button.onclick = onClickFunction;
    button.className = buttonClass;
    button.id = buttonId;
    button.style = buttonStyle;

    console.log("Building button with text: " + buttonText);
    const parent = document.getElementById(parentId);
    parent.appendChild(button);

    return button;
}

function populateCallOptionsDiv() {
    //This original sipml5 had buttons for the keypad the HTLM looked like this
    //<input type="button" class="btn" style="" id="btnKeyPad" value="KeyPad" onclick='openKeyPad();' />
    //So we use our javascript to create the same button
    addNewButton(openKeyPad, "KeyPad", "btn", "btnKeyPad", "", 'divCallOptions');

    //We add a PushToTalk button that looked like this
    //<input type="button" id="btnptt" class="btn btn-success" style="" value="PTT"  />
    const pttButton = addNewButton(null, "PTT", "btn btn-success", "btnptt", "", 'divCallOptions');
    pttButton.onmousedown = function(){
        pttButton.value= 'PTT-TX';
        sipToggleMute();
        sipSendDTMF('#');
        pttButton.className = "btn btn-danger";
        txtCallStatus.innerHTML = "Transmitting...";


    };
    pttButton.onmouseup = function(){
        pttButton.value= 'PTT';
        sipToggleMute();
        sipSendDTMF('*');
        pttButton.className = "btn btn-success";
        txtCallStatus.innerHTML = "End Transmission...";


    };

    //If we have information about radios and conference rooms we process it here and use it to add buttons
    //const radioConfig = window.localStorage.getItem('edu.nmt.icasa.conference_details');
    const radioConfig = [{'roomNumber':'301', 'radioFrequency':'120.0Mhz'}, {'roomNumber':'302', 'radioFrequency':'560.0Mhz'}];
    if(radioConfig){

    }else{
        const parent = document.getElementById(parentId);
        console.log("Do not have radio/room configuration.");
    }
}