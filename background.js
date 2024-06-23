let connections = {};

// Function to initialize WebSocket connection
function initWebSocket(userId) {
  const socket = new WebSocket('ws://3.147.70.239:4000');

  socket.onopen = () => {
    console.log('WebSocket connection opened');
    socket.send(JSON.stringify({ type: 'connect', userId }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      chrome.runtime.sendMessage(data);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    delete connections[userId];
  };

  socket.onerror = (error) => {
    console.error('WebSocket error', error);
  };

  connections[userId] = socket;
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.type === 'init') {
      initWebSocket(msg.userId);
    } else if (msg.type === 'send') {
      const socket = connections[msg.userId];
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'message', message: msg.message }));
      }
    }
  });
});
