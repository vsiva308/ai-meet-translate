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
