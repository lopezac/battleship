const Player = require("../modules/player.js");
const Gameboard = require("../modules/gameboard.js");
const Ship = require("../modules/ship.js");

test.only("player can miss a attack", () => {
  const gameboard = Gameboard();
  const player = Player(gameboard);
  player.attack([0, 0]);
  expect(gameboard.getShip([0, 0])).toEqual("m");
});

test.only("player can hit a ship", () => {
  const gameboard = Gameboard();
  const player = Player(gameboard);
  const ship = Ship(1);

  gameboard.placeShip(ship, [[0, 0]]);
  player.attack([0, 0]);
  expect(gameboard.getShip([0, 0])).toEqual("h");
});

test.only("computer can make a random move", () => {
  const gameboard = Gameboard();
  const player = Player(gameboard, true);
  const ship = Ship(2);

  gameboard.placeShip(ship, [
    [0, 0],
    [1, 0],
  ]);
  expect(gameboard.anyMoveWasMade()).toEqual(false);
  player.attack();
  expect(gameboard.anyMoveWasMade()).toEqual(true);
});
