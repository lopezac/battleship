const Player = (gameboard, robot = false) => {
  const computer = robot;

  function attack(position = []) {
    if (isAComputer()) position = computerMove();
    gameboard.receiveAttack(position);
  }

  function computerMove() {
    const position = randomMove();
    if (!gameboard.availablePosition([position])) attack();

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
    attack,
    isAComputer,
  };
};

module.exports = Player;
