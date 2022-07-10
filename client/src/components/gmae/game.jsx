import { useState } from 'react';
import './game.css';
import socketIOClient from 'socket.io-client';
import { GameBord } from './game_bord/game_bord';
import { convertDataInboPitClass } from '../../utils/pit_class';
import { generateInitGame } from '../../utils/game_moves';
import {
  userMove,
  opponentMove,
  STATUS,
  areBeansToStealFromOpponent,
  areBeansToStealFromUser,
  stealBeansFromOpponent,
  stealBeansFromUser,
} from '../../utils/game_moves2';

// const ENDPOINT =
//   process.env.NODE_ENV === 'production'
//     ? 'https://ofer-mancala.herokuapp.com/'
//     : 'http://127.0.0.1:5000/server/';
const ENDPOINT = 'http://127.0.0.1:5000';

const Game = (/* user */) => {
  const [gameData, setGameData] = useState({
    userPits: [4, 4, 4, 4, 4, 4],
    userBank: 0,
    opponentPits: [4, 4, 4, 4, 4, 4],
    opponentBank: 0,
  });
  //TODO const [userTurn, setUserTurn] = useState(true);

  const socket = socketIOClient(ENDPOINT);
  socket.on('massage', (data) => {
    console.log(data);
  });
  socket.on('opponent-move', (pitNum) => {
    onOpponentMove(pitNum);
  });

  const onPlayersMove = (pitNum) => {
    if (gameData.userPits[pitNum] === 0) return;

    const { moveResalt, turnStatus } = userMove(
      gameData,
      pitNum,
      setGameData,
      socket
    );
    // setGameData(moveResalt);
    // socket.emit('move', pitNum);

    if (areBeansToStealFromOpponent(moveResalt, turnStatus)) {
      const stolenBeans = stealBeansFromOpponent(moveResalt, turnStatus);
      setGameData(stolenBeans);
    }
  };

  const onOpponentMove = (pitNum) => {
    const { moveResalt, turnStatus } = opponentMove(gameData, pitNum);

    setGameData(moveResalt);

    if (areBeansToStealFromUser(moveResalt, turnStatus)) {
      const stolenBeans = stealBeansFromUser(moveResalt, turnStatus);
      setGameData(stolenBeans);
    }
  };

  const tempMove = (pitNum) => {
    onOpponentMove(pitNum);
  };

  if (!gameData || !gameData.userPits || !gameData.userPits[0])
    return console.log(gameData);

  return (
    // <SocketProvider>  {/* id={id}*/}

    <div className="game">
      <div className="temp">
        <button
          onClick={() => {
            tempMove(5);
          }}
        >
          -1-
        </button>
        <button
          onClick={() => {
            tempMove(4);
          }}
        >
          -2-
        </button>
        <button
          onClick={() => {
            tempMove(3);
          }}
        >
          -3-
        </button>
        <button
          onClick={() => {
            tempMove(2);
          }}
        >
          -4-
        </button>
        <button
          onClick={() => {
            tempMove(1);
          }}
        >
          -5-
        </button>
        <button
          onClick={() => {
            tempMove(0);
          }}
        >
          -6-
        </button>
      </div>
      <div className="player opponent">
        <div className="title">Omri</div>
      </div>
      <GameBord data={gameData} onPlayersMove={onPlayersMove} />
      <div className="player user ">
        <div className="title">You</div>
      </div>
    </div>
    // </SocketProvider>
  );
};

export default Game;
