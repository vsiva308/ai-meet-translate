if (!('webkitSpeechRecognition' in window)) {
    console.error('Web Speech API is not supported by this browser.');
} else {
    window.recognition = new webkitSpeechRecognition();
    window.recognition.continuous = true;
    window.recognition.interimResults = true;

    window.recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            console.log('Final transcript:', event.results[i][0].transcript);
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
        }
        if (interim_transcript) {
        console.log('Interim transcript:', interim_transcript);
        }
    };

    window.recognition.onstart = function() {
        console.log('Speech recognition started.');
        window.recognitionRunning = true;
    };

    window.recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    window.recognition.onend = function() {
        console.log('Speech recognition ended.');
        window.recognitionRunning = false;
    };

    window.recognitionRunning = false; // Initial state
}
