const http = require('http');
const app = require('./server/app');
const setupWebSocket = require('./server/websocket');

// Запуск HTTP сервера
const server = http.createServer(app);

// Настройка WebSocket
const websocket = setupWebSocket(server);
app.set('websocket', websocket);

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
