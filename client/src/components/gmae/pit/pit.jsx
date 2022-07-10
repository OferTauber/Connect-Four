const Pit = ({ beans, onPlayersMove, pitNum }) => {
  return (
    <div
      className="pit"
      onClick={() => {
        onPlayersMove(pitNum);
      }}
    >
      {beans}
    </div>
  );
};

export default Pit;
