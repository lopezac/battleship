const gameDOM = (() => {
  const pBoardDiv = document.querySelector(".player-board");
  const cBoardDiv = document.querySelector(".computer-board");
  createBoard(pBoardDiv);
  createBoard(cBoardDiv);
  const cBoardCells = cBoardDiv.querySelectorAll(".cell");

  const listenBoard = (playerTurn) => {
    for (let cell of cBoardCells) {
      cell.addEventListener("click", () => {
        const position = getCellPosition(cell);
        console.log(position);
        playerTurn(position);
        attack(cBoardDiv, position);
      });
    }
  };

  function getCellPosition(cellDiv) {
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 10; row++) {
        const cell = cBoardDiv.childNodes[col].childNodes[row];
        if (cell === cellDiv) return [row, col];
      }
    }
  }

  function createBoard(board) {
    resetBoard(board);
    for (let row = 0; row < 10; row++) {
      const row = createRow();
      board.appendChild(row);
    }
  }

  function resetBoard(board) {
    if (board.lastChild) {
      while (board.lastChild) board.removeChild(board.lastChild);
    }
  }

  function createRow() {
    const row = document.createElement("div");
    row.classList.add("row");
    createColumns(row);
    return row;
  }

  function createColumns(row) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }
  }

  function getCell(board, position) {
    return board.childNodes[position[1]].childNodes[position[0]];
  }

  function placeShip(board, position) {
    for (const cellPos of position) {
      const cell = getCell(board, cellPos);
      cell.classList.add("ship");
    }
  }

  function placeShips(boardDiv, board) {
    const gameboard = board.getBoard();
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = board.getShip([row, col]);
        if (cell) placeShip(boardDiv, [[row, col]]);
      }
    }
  }

  function attack(board, boardDiv, position) {
    const cellDiv = getCell(boardDiv, position);
    const cell = board.getShip(position);

    if (cell === "h") {
      cellDiv.classList.remove("ship");
      cellDiv.classList.add("shipHitted");
    } else if (cell === "m") {
      cellDiv.classList.add("miss");
    }
  }

  function getComputerBoard() {
    return cBoardDiv;
  }

  function getPlayerBoard() {
    return pBoardDiv;
  }

  function getComputerBoardCells() {
    return cBoardCells; //document.querySelectorAll(".computer-board .cell");
  }

  function getPlayerBoardCells() {
    return document.querySelectorAll(".player-board .cell");
  }

  return {
    listenBoard,
    getCellPosition,
    createBoard,
    attack,
    placeShips,
    getComputerBoard,
    getPlayerBoard,
    getComputerBoardCells,
    getPlayerBoardCells,
  };
})();

module.exports = gameDOM;
