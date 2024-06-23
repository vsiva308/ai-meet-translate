let socket;
let targetLang = 'es';

function connectWebSocket() {
    socket = new WebSocket('ws://3.147.70.239:4000'); // Adjust URL to your WebSocket server

    socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
        console.log('Message received from server:', event.data);
        
        // TRANSLATE, HANDLE AND PLAY THE AUDIO HERE!!!
        //TRANSLATE
        // translateText(event.results[i][0].transcript, targetLang) // Translate from English to Spanish
        //     .then(translatedText => {
        //         console.log(translatedText);
        //     })
        //     .catch(error => {
        //         console.error('Error translating text:', error);
        //     });

        //THEN PLAY AUDIO

    };

    socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        // Attempt to reconnect every 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function sendMessageToWebSocket(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error('WebSocket is not open. Message not sent:', message);
    }
}

connectWebSocket();

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

                //FEED TRANSCRIPT INTO WEB SOCKET
                sendMessageToWebSocket(event.results[i][0].transcript);
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

async function translateText(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error('Error fetching translation:', error);
        throw error;
    }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'setTargetLang') {
        targetLang = request.targetLang;
        console.log('Target language set to:', targetLang);
        sendResponse({status: 'success', targetLang: targetLang});
    }
});