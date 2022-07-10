import PitClass from './pit_class';

//*  ======================= Public - exported =======================
export const playersMove2 = (data, selectedPitNum) => {
  const move = initialMove({ ...data }, selectedPitNum);

  const toReturn = {
    moveResalt: move.moveResalt,
    moveStatus: undefined,
  };

  //* If a player's turn ends at the bank he gets another turn
  if (move.lastPit === 'bank') {
    toReturn.moveStatus = 'Another-turn';

    //* If a player's turn ends in his pit - he steals the beans from the opponent's parallel well
  } else if (move.lastPit !== 'opponent') {
    toReturn.moveStatus = 'Beans to steal from ' + move.lastPit;
  }

  return toReturn;
};
export const playersMove = (data, selectedPitNum) => {
  const move = gameMove({ ...data }, selectedPitNum, 'user');

  const toReturn = {
    moveResalt: move.moveResalt,
    moveStatus: undefined,
  };

  //* If a player's turn ends at the bank he gets another turn
  if (move.lastPit === 'bank') {
    toReturn.moveStatus = 'Another-turn';

    //* If a player's turn ends in his pit - he steals the beans from the opponent's parallel well
  } else if (move.lastPit !== 'opponent') {
    toReturn.moveStatus = 'Beans to steal from ' + move.lastPit;
  }

  return toReturn;
};

export const opponentMove = (gameData, pitNum) => {
  if (!pitNum) if (pitNum !== 0) return gameData;

  const move = opponentInitialMove({ ...gameData }, pitNum);

  const toReturn = {
    moveResalt: move.moveResalt,
    moveStatus: undefined,
  };
  //* If a player's turn ends at the bank he gets another turn
  if (move.lastPit === 'bank') {
    toReturn.moveStatus = 'Another-turn';

    //* If a opponent's turn ends in his pit - he steals the beans from the user's parallel well
  } else if (move.lastPit !== 'user') {
    toReturn.moveStatus = 'Beans to steal from ' + move.lastPit;
  }

  return toReturn;
};

export const generateInitGame = () => {
  const data = {
    userPits: [
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
    ],
    userBank: new PitClass({ bins: 0 }),
    opponentPits: [
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
      { bins: 4 },
    ],
    opponentBank: new PitClass({ bins: 0 }),
  };

  data.userPits = data.userPits.map((pit) => {
    return new PitClass(pit);
  });
  data.opponentPits = data.opponentPits.map((pit) => {
    return new PitClass(pit);
  });

  return data;
};

export const areBeansToSteal = ({ opponentPits, userPits }, moveStatus) => {
  if (!moveStatus.startsWith('Beans to steal from')) return false; // Did the move ended in the user's side? // Did the move ended in the user's side?

  const userLastPit = moveStatus.slice(-1) * 1;
  const pitToStealFrom = 5 - userLastPit;

  if (1 !== userPits[userLastPit].getBins()) return false; // Did the move ended up in an empty pit? (now have 1 bean)

  return 0 !== opponentPits[pitToStealFrom].getBins(); // Is ther anything to steal?!
};

export const areBeansToStealFromUser = (
  { opponentPits, userPits },
  moveStatus
) => {
  if (!moveStatus.startsWith('Beans to steal from')) return false; // Did the move ended in the user's side?

  const opponentLastPit = moveStatus.slice(-1) * 1;
  const pitToStealFrom = 5 - opponentLastPit;

  if (1 !== opponentPits[opponentLastPit].getBins()) return false; // Did the move ended up in an empty pit? (now have 1 bean)

  return 0 !== userPits[pitToStealFrom].getBins(); // Is ther anything to steal?!
};

export const stealBeans = (
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
  console.log({ userPits, userPits, userBank, opponentBank });

  return { userPits, opponentPits, userBank, opponentBank };
};

//* ======================= Static - Local use only =======================
const gameMove = (
  { userPits, opponentPits, userBank, opponentBank },
  selectedPitNum,
  player
) => {
  const closePits = player === 'user' ? userPits : opponentPits;
  const farPits = player === 'user' ? opponentPits : userPits;
  const activBank = player === 'user' ? userBank : opponentBank;
  const inactivBank = player === 'user' ? opponentBank : userBank;

  let binsInHand = closePits[selectedPitNum].getBins();
  closePits[selectedPitNum].setBins(0);
  let i = selectedPitNum + 1;
  let lastPit = i;
  let delay = 1;

  while (binsInHand) {
    for (; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(closePits[i], delay);
      lastPit = i + '';
    }

    if (binsInHand) {
      delay = updatePitAndIncDelay(activBank, delay);
      binsInHand--;
      lastPit = 'bank';
    }

    for (i = 0; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(farPits[i], delay);
      lastPit = player == 'user' ? 'opponent' : 'user';
    }
    i = 0;
  }

  const toReturn = {
    moveResalt: {
      userPits: player === 'user' ? closePits : farPits,
      opponentPits: player === 'user' ? farPits : closePits,
      userBank: player === 'user' ? activBank : inactivBank,
      opponentBank: player === 'user' ? inactivBank : activBank,
    },
    lastPit,
  };

  return toReturn;
};

const initialMove = (
  { userPits, opponentPits, userBank, opponentBank },
  selectedPitNum
) => {
  let binsInHand = userPits[selectedPitNum].getBins();
  userPits[selectedPitNum].setBins(0);
  let i = selectedPitNum + 1;
  let lastPit = i;
  let delay = 1;

  while (binsInHand) {
    for (; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(userPits[i], delay);
      lastPit = i + '';
    }

    if (binsInHand) {
      delay = updatePitAndIncDelay(userBank, delay);
      binsInHand--;
      lastPit = 'bank';
    }

    for (i = 0; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(opponentPits[i], delay);
      lastPit = 'opponent';
    }
    i = 0;
  }

  const toReturn = {
    moveResalt: { userPits, opponentPits, userBank, opponentBank },
    lastPit,
  };

  return toReturn;
};

const updatePitAndIncDelay = (pit, delay) => {
  pit.incrementBins();
  pit.setDelay(delay);
  return delay + 1;
};

const opponentInitialMove = (
  { userPits, opponentPits, userBank, opponentBank },
  selectedPitNum
) => {
  let binsInHand = opponentPits[selectedPitNum].getBins();
  opponentPits[selectedPitNum].setBins(0);
  let i = selectedPitNum + 1;
  let lastPit = i;
  let delay = 1;

  while (binsInHand) {
    for (; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(opponentPits[i], delay);
      lastPit = i + '';
    }

    if (binsInHand) {
      delay = updatePitAndIncDelay(opponentBank, delay);
      binsInHand--;
      lastPit = 'bank';
    }

    for (i = 0; i < 6 && binsInHand; i++) {
      binsInHand--;
      delay = updatePitAndIncDelay(userPits[i], delay);
      lastPit = 'user';
    }
    i = 0;
  }

  const toReturn = {
    moveResalt: { userPits, opponentPits, userBank, opponentBank },
    lastPit,
  };

  return toReturn;
};
