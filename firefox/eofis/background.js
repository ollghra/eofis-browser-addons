/* Connect to eofis desktop app
 * Manifest files needed in specific places for macOS and linux
 * Registry Key needed for Windows pointing to manifest file location
 * */
//var eofisNative = browser.runtime.connectNative("eofis");

/* Listen for messages from the app */
//eofisNative.onMessage.addListener((response) => {
//	console.log(`Received: ${response} `);
//});

document.body.style.border = "5px solid red";

browser.contextMenus.create({
    id: 'eofisNoted',
    title: 'Note: "%s"',
    contexts: ["selection"]
});

var selectionText
browser.contextMenus.onClicked.addListener((info, tab) => {
    selectionText = info.selectionText;
    let message = {'text': selectionText};
    console.log(`Sending ${message['text']} to eofis app`);
    //eofisNative.postMessage(message);

    /* Connectionless */
    var eofisAppX = browser.runtime.sendNativeMessage(
        "eofis",
        message);
    eofisAppX.then((response) => {
        console.log(`RX: ${response}`);
    }, (error) => {
        console.log(`ERROR: ${error}`);
    });
    let popup = browser.runtime.getURL('popup/modify_note.html');
    browser.browserAction.setPopup({'popup': popup});
    browser.browserAction.openPopup();
});

browser.runtime.onMessage.addListener(message => {
    if (message.ok) {
        console.log("SENDING TEXT");
        browser.runtime.sendMessage(selectionText);
        selectionText = "";
    } else if (message.ok != null && message.ok === false) {
        console.error("An error occurred while opening the EOFIS Noted popup.");
        browser.runtime.sendMessage("An error occurred. Try again, then please report it.");
    }
});