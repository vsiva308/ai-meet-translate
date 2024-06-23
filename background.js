let stream = null;
let audioChunks = [];
let mediaRecorder = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "start") {
    chrome.tabCapture.capture({ audio: true }, (s) => {
      stream = s;
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.start();
      sendResponse({ success: true });
    });
  } else if (message.type === "stop") {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      sendResponse({ success: true });
    };
  }
  return true;
});
