const userId = 'user123'; // Replace with actual user ID

document.addEventListener('DOMContentLoaded', () => {
  const port = chrome.runtime.connect({ name: 'messaging' });

  port.postMessage({ type: 'init', userId });

  document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    port.postMessage({ type: 'send', userId, message });
    document.getElementById('message').value = '';
    displayMessage('Me', message);
  });

  port.onMessage.addListener((msg) => {
    if (msg.type === 'message') {
      displayMessage('User', msg.message);
    }
  });

  function displayMessage(sender, message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageElement);
  }
});
