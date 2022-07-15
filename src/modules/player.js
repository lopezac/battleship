const Player = (gameboard, robot = false) => {
  const computer = robot;

  function getComputerMove() {
    let position = randomMove();
    while (gameboard.attackedPosition(position)) {
      position = randomMove();
    }

    return position;
  }

  function randomMove() {
    return [randomNumber(), randomNumber()];
  }

  function randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  function isAComputer() {
    return computer;
  }

  return {
    isAComputer,
    getComputerMove,
  };
};

module.exports = Player;
