if (!('webkitSpeechRecognition' in window)) {
    console.error('Web Speech API is not supported by this browser.');
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error detected:', event.error);
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    recognition.onresult = function(event) {
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
    
    recognition.start();
}
  