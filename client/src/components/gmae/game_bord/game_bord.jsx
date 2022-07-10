import Pit from '../pit/pit';

export const GameBord = ({ data, onPlayersMove }) => {
  const doNothing = (arg) => void arg;
  return (
    <div className="game-bord">
      <Bank beans={data.opponentBank} owner="opponent" />
      <div className="pist-section">
        <PitsLine
          onPlayersMove={doNothing}
          owner="opponent"
          data={data.opponentPits}
        />
        <PitsLine
          onPlayersMove={onPlayersMove}
          owner="user"
          data={data.userPits}
        />
      </div>
      <Bank beans={data.userBank} owner="user" />
    </div>
  );
};

export const Bank = ({ beans, owner }) => {
  return (
    <div className={`bank-wraper ${owner}`}>
      <div className="bank">{beans}</div>
    </div>
  );
};

export const PitsLine = ({ data, owner, onPlayersMove }) => {
  const mapPits = () => {
    return data.map((pit, index) => {
      return (
        <Pit
          key={index}
          beans={pit}
          pitNum={index}
          onPlayersMove={onPlayersMove}
        />
      );
    });
  };

  return <div className={`pits-line ${owner}`}>{mapPits()}</div>;
};
