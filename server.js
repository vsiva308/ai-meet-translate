const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });
let clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'connect') {
      clients[data.userId] = ws;
    } else if (data.type === 'message') {
      Object.keys(clients).forEach((clientId) => {
        if (clients[clientId] !== ws) {
          clients[clientId].send(JSON.stringify({ type: 'message', message: data.message }));
        }
      });
    }
  });

  ws.on('close', () => {
    Object.keys(clients).forEach((clientId) => {
      if (clients[clientId] === ws) {
        delete clients[clientId];
      }
    });
  });
});
console.log('WebSocket server is running on ws://localhost:4000')