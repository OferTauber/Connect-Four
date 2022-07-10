function PitClass({ bins, delay }) {
  this.bins = bins;
  this.delay = delay === undefined ? 0 : delay;
  this.higlite = false;
}

PitClass.prototype.getBins = function () {
  return this.bins;
};

PitClass.prototype.setBins = function (bins) {
  this.bins = bins;
};

PitClass.prototype.incrementBins = function () {
  this.bins++;
};

PitClass.prototype.getDelay = function () {
  return this.delay;
};

PitClass.prototype.setDelay = function (delay) {
  this.delay = delay;
};

PitClass.prototype.higlitePit = function () {
  this.higlite = true;
  setTimeout(() => {
    this.higlite = false;
  }, 1000);
};

export default PitClass;

export const convertDataInboPitClass = (data) => {
  return {
    userPits: data.userPits.map((pit) => new PitClass(...pit)),
    opponentPits: data.opponentPits.map((pit) => new PitClass(...pit)),
    userBank: new PitClass(...data.userBank),
    opponentBank: new PitClass(...data.opponentBank),
  };
};
