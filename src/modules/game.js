const Player = require("./player.js");
const Ship = require("./ship.js");
const Gameboard = require("./gameboard.js");
const GameDOM = require("./gameDOM.js");

const Game = ((gameDOM, Ship) => {
  let computerBoard = Gameboard(Ship);
  let computer = Player(computerBoard, true);
  const computerBoardDiv = gameDOM.getComputerBoard();
  let computerBoardCells = gameDOM.getComputerBoardCells();

  let playerBoard = Gameboard(Ship);
  let player = Player(playerBoard);
  const playerBoardDiv = gameDOM.getPlayerBoard();
  const playerBoardCells = gameDOM.getPlayerBoardCells();

  let currentPlayer = player;

  function start() {
    populateGameboard(computerBoard);
    populateGameboard(playerBoard);
    gameDOM.placeShips(computerBoardDiv, computerBoard);
    gameDOM.placeShips(playerBoardDiv, playerBoard);
    listenBoard();
  }

  function listenBoard() {
    for (let cell of computerBoardCells) {
      cell.addEventListener("click", () => {
        if (currentPlayer === player) playerTurn(cell);
      });
    }
  }

  function playerTurn(cell) {
    if (gameOver()) {
      reset();
      return;
    }
    const position = gameDOM.getCellPosition(cell);
    if (computerBoard.attackedPosition(position)) return;
    computerBoard.receiveAttack(position);
    gameDOM.attack(computerBoard, computerBoardDiv, position);

    switchPlayer();
    computerTurn();
  }

  function computerTurn() {
    if (gameOver()) {
      reset();
      return;
    }
    const position = computer.getComputerMove();
    playerBoard.receiveAttack(position);
    gameDOM.attack(playerBoard, playerBoardDiv, position);

    switchPlayer();
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === player ? computer : player;
  }

  function gameOver() {
    return playerBoard.allShipsSunk() || computerBoard.allShipsSunk();
  }

  function reset() {
    computerBoard = Gameboard(Ship);
    computer = Player(computerBoard, true);

    playerBoard = Gameboard(Ship);
    player = Player(playerBoard);

    gameDOM.createBoard(playerBoardDiv);
    gameDOM.createBoard(computerBoardDiv);

    computerBoardCells = gameDOM.getComputerBoardCells();
    currentPlayer = player;
    start();
  }

  function populateGameboard(gameboard) {
    // implement it later
    gameboard.placeShip(Ship(1), [[0, 0]]);
    gameboard.placeShip(Ship(1), [[9, 9]]);
    gameboard.placeShip(Ship(1), [[9, 0]]);
    gameboard.placeShip(Ship(1), [[0, 9]]);

    // gameboard.placeShip(Ship(2), [
    //   [2, 0],
    //   [3, 0],
    // ]);
    // gameboard.placeShip(Ship(2), [
    //   [2, 9],
    //   [3, 9],
    // ]);
    // gameboard.placeShip(Ship(2), [
    //   [5, 8],
    //   [5, 9],
    // ]);

    // gameboard.placeShip(Ship(3), [
    //   [4, 2],
    //   [4, 3],
    //   [4, 4],
    // ]);
    // gameboard.placeShip(Ship(3), [
    //   [6, 2],
    //   [6, 3],
    //   [6, 4],
    // ]);

    // gameboard.placeShip(Ship(3), [
    //   [2, 3],
    //   [6, 3],
    //   [6, 4],
    // ]);

    // gameboard.placeShip(Ship(4), [
    //   [8, 3],
    //   [8, 4],
    //   [8, 5],
    //   [8, 6],
    // ]);
  }

  return {
    start,
  };
})(GameDOM, Ship);

module.exports = Game;
