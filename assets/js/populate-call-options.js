function addNewButton(onClickFunction, buttonText, buttonClass, buttonId, buttonStyle, parentId){
    const button = document.createElement("input");
    button.type = "button";
    button.value = buttonText;
    button.onclick = onClickFunction;
    button.className = buttonClass;
    button.id = buttonId;
    button.style = buttonStyle;

    const parent = document.getElementById(parentId);
    parent.appendChild(button);

    return button;
}

function populateCallOptionsDiv(phoneFieldId) {
    const divId = 'divCallOptions';
    //This original sipml5 had buttons for the keypad the HTLM looked like this
    //<input type="button" class="btn" style="" id="btnKeyPad" value="KeyPad" onclick='openKeyPad();' />
    //So we use our javascript to create the same button
    addNewButton(openKeyPad, "KeyPad", "btn", "btnKeyPad", "", divId);

    //We add a PushToTalk button that looked like this
    //<input type="button" id="btnptt" class="btn btn-success" style="" value="PTT"  />
    const pttButton = addNewButton(null, "PTT", "btn btn-success", "btnptt", "", divId);
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
    const calledNumber = document.getElementById(phoneFieldId).value;
    const radioConfig = JSON.parse(window.localStorage.getItem('edu.nmt.icasa.conference_details'));
    if(radioConfig && radioConfig[calledNumber]){

        //We use a fieldSet to hold the "call radio" buttons
        const fieldSet = document.createElement("FIELDSET");
        fieldSet.id = "radioField";
        const fieldLegend = document.createElement("LEGEND");
        fieldLegend.innerHTML = "Conference Radios";
        fieldSet.appendChild(fieldLegend);
        const parent = document.getElementById(divId);
        parent.appendChild(fieldSet);

        const radioInfoList = radioConfig[calledNumber];
        for(const radioInfo of radioInfoList){
            const radioFrequency = radioInfo.frequency;
            const keyPadId = radioInfo.keyPadId;
            const buttonText = radioFrequency + " - " + keyPadId;
            addNewButton(function(){
                txtCallStatus.innerHTML = "Called Radio: " + buttonText;
                sipSendDTMF(keyPadId);
            }, buttonText, "btn", keyPadId, "", fieldSet.id);
        }
    }else{
        const parent = document.getElementById(divId);
        const span = document.createElement("SPAN");
        span.textContent = "No conference config";
        parent.appendChild(span);
    }
}

function unpopulateCallOptionsDiv(){
    const divId = 'divCallOptions';
    const element = document.getElementById(divId);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}