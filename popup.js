document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "start" }, (response) => {
        if (response && response.success) {
          console.log("Recording started");
        }
      });
    });
  
    document.getElementById("stop").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "stop" }, (response) => {
        if (response && response.success) {
          console.log("Recording stopped and playback started");
        }
      });
    });
  });
  