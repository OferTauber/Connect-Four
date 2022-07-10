const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
// const { convertPlayerMoveToOpponent } = require('./utils/convrtr_player_moves');

const port = process.env.PORT || 5000;
// const index = require('./src/routes/index');

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://ofer-mancala.herokuapp.com',
      '/',
    ],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('massage', 'Welcome');

  socket.on('ping', (ping) => {
    io.emit('massage', ping);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('move', (pitNum) => {
    // convertPlayerMoveToOpponent(moveResalt);
    socket.broadcast.emit('opponent-move', pitNum);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
