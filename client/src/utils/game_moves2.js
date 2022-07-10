export const STATUS = {
  BEANS_TO_STEAL: 'mayme bins to stil',
  ANOTHER_TURN: 'another turn',
  TURN_IS_OVER: 'turn is over',
  GAME_OVER: 'game over',
};

//
// * ----------- gameMove -----------------------
export const userMove = (gameData, pitNum, setData, socket) => {
  return gameMove(gameData, pitNum, 'user', setData, socket);
};
export const opponentMove = (gameData, pitNum) => {
  return gameMove(gameData, pitNum, 'opponent');
};

const gameMove = async (gameData, pitNum, player, setData, socket) => {
  let { closePits, farPits, activBank, inactivBank } = organizeDataByPlayer(
    { ...gameData },
    player
  );

  let binsInHand = closePits[pitNum];
  closePits[pitNum] = 0;
  setData(
    REorganizeDataByPlayer(
      { closePits, farPits, activBank, inactivBank },
      player
    )
  );
  let i = pitNum + 1;
  let turnStatus;
  let delay = 1;

  while (binsInHand) {
    for (; i < 6 && binsInHand; i++) {
      binsInHand--;
      closePits[i]++;
      turnStatus = STATUS.BEANS_TO_STEAL + ' from ' + i;
      setTimeout(() => {
        setData(
          REorganizeDataByPlayer(
            { closePits, farPits, activBank, inactivBank },
            player
          )
        );
      }, delay * 100);
    }

    if (binsInHand) {
      activBank++;
      binsInHand--;
      turnStatus = STATUS.ANOTHER_TURN;
      setData(
        REorganizeDataByPlayer(
          { closePits, farPits, activBank, inactivBank },
          player
        )
      );
    }

    for (i = 0; i < 6 && binsInHand; i++) {
      binsInHand--;
      farPits[i]++;
      turnStatus = STATUS.TURN_IS_OVER;
      setData(
        REorganizeDataByPlayer(
          { closePits, farPits, activBank, inactivBank },
          player
        )
      );
    }
    i = 0;
  }
  return {
    moveResalt: REorganizeDataByPlayer(
      { closePits, farPits, activBank, inactivBank },
      player
    ),
    turnStatus,
  };
};

//
// * ----------- areBeansToSteal -----------------------
export const areBeansToStealFromOpponent = ({ ...data }, turnStatus) => {
  return areBeansToSteal(data.userPits, data.opponentPits, turnStatus);
};

export const areBeansToStealFromUser = ({ ...data }, turnStatus) => {
  return areBeansToSteal(data.opponentPits, data.userPits, turnStatus);
};

const areBeansToSteal = (closePits, farPits, moveStatus) => {
  if (!moveStatus.startsWith(STATUS.BEANS_TO_STEAL)) return false; // Did the move ended in the user's side? // Did the move ended in the user's side?

  const playerLastPit = moveStatus.slice(-1) * 1;
  const pitToStealFrom = 5 - playerLastPit;

  if (1 !== closePits[playerLastPit].getBins()) return false; // Did the move ended up in an empty pit? (now have 1 bean)

  return 0 !== farPits[pitToStealFrom].getBins(); // Is ther anything to steal?!
};

//
// * ----------- stealBeans -----------------------

export const stealBeansFromOpponent = (
  { userPits, opponentPits, userBank, opponentBank },
  moveStatus
) => {
  const userLastPit = moveStatus.slice(-1) * 1;
  const pitToStealFrom = 5 - userLastPit;

  const beansToSteal =
    opponentPits[pitToStealFrom].getBins() + userPits[userLastPit].getBins();

  opponentPits[pitToStealFrom].setBins(0);
  userPits[userLastPit].setBins(0);
  userBank.setBins(userBank.getBins() + beansToSteal);

  return { userPits, opponentPits, userBank, opponentBank };
};

export const stealBeansFromUser = (
  { userPits, opponentPits, userBank, opponentBank },
  moveStatus
) => {
  const opponentLastPit = moveStatus.slice(-1) * 1;
  const pitToStealFrom = 5 - opponentLastPit;

  const beansToSteal =
    userPits[pitToStealFrom].getBins() +
    opponentPits[opponentLastPit].getBins();

  userPits[pitToStealFrom].setBins(0);
  opponentPits[opponentLastPit].setBins(0);
  opponentBank.setBins(opponentBank.getBins() + beansToSteal);

  return { userPits, opponentPits, userBank, opponentBank };
};

const organizeDataByPlayer = (
  { userPits, opponentPits, userBank, opponentBank },
  player
) => {
  return {
    closePits: player === 'user' ? userPits : opponentPits,
    farPits: player !== 'user' ? userPits : opponentPits,
    activBank: player === 'user' ? userBank : opponentBank,
    inactivBank: player !== 'user' ? userBank : opponentBank,
  };
};

const REorganizeDataByPlayer = (
  { closePits, farPits, activBank, inactivBank },
  player
) => {
  const toReturn = {
    userPits: player === 'user' ? closePits : farPits,
    opponentPits: player !== 'user' ? closePits : farPits,
    userBank: player === 'user' ? activBank : inactivBank,
    opponentBank: player !== 'user' ? activBank : inactivBank,
  };
  return toReturn;
};

// const updatePitAndIncDelay = (pit, delay) => {
//   pit.incrementBins();
//   pit.setDelay(delay);
//   return delay + 1;
// };
