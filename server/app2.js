const express = require('express');
const cors = require('cors');
const http = require('http');
const route = require('./src/route');
const path = require('path');
// require('./mongodb/mongoose'); // todo  - set mongo atlas
const socketio = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use('/server', route);

// let interval;

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('massage', 'New user has conected');

  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response);
};

server.listen(PORT, (req, res) => {
  void req, res;
  console.log('Listen to port: ' + PORT);
});
