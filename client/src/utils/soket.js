import socketIOClient from 'socket.io-client';

const ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? 'https://ofer-mancala.herokuapp.com/'
    : 'http://127.0.0.1:5000/server/';

// const [response, setResponse] = useState('');
// const pings = ['Ping!', 'Pssss', 'Pong', 'Hi!!', 'Oi!'];

const socket = socketIOClient(ENDPOINT);
socket.on('massage', (data) => {
  console.log(data);
});

export default socket;
