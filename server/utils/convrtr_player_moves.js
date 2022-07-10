const convertPlayerMoveToOpponent = (moveResalt) => {
  // console.log(moveResalt);
  const convertedData = {
    userPits: moveResalt.opponentPits,
    opponentPits: moveResalt.opponentPits,
    userBank: moveResalt.opponentBank,
    opponentBank: moveResalt.userBank,
  };

  return convertedData;
};

const convertMoves = {
  convertPlayerMoveToOpponent,
};

module.exports = convertMoves;
