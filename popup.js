document.getElementById('toggle-btn').addEventListener('click', function() {
    const button = this;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: toggleTranscription
        }, (results) => {
            // Update the button text based on the current state returned from the content script
            if (results[0].result) {
                button.textContent = 'Stop';
            } else {
                button.textContent = 'Start';
            }
        });
    });
});

document.getElementById('set-lang-btn').addEventListener('click', function() {
    const targetLang = document.getElementById('targetLang').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log('Sending message to set language...');
        chrome.tabs.sendMessage(tabs[0].id, { type: 'setTargetLang', targetLang: targetLang }, function(response) {
            if (response && response.status === 'success') {
                console.log('Target language set to:', response.targetLang);
            } else {
                console.error('Failed to set target language');
            }
        });
    });
});

function toggleTranscription() {
    const recognitionRunning = window.recognition && window.recognitionRunning;
    if (recognitionRunning) {
        window.recognition.stop();
        window.recognitionRunning = false;
        return false; // Indicate recognition stopped
    } else {
        window.recognition.start();
        window.recognitionRunning = true;
        return true; // Indicate recognition started
    }
}
