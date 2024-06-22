chrome.runtime.onInstalled.addListener(() => {
    console.log('Meet Audio Transcription extension installed.');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content_script.js']
    });
  });
  