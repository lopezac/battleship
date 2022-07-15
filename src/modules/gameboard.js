const Gameboard = (Ship) => {
  let board = createBoard();

  function placeShip(ship, position) {
    if (!availablePosition(position)) return;
    for (let cell of position) {
      board[cell[0]][cell[1]] = ship;
    }
  }

  function receiveAttack(position) {
    const ship = getShip(position);
    // h means hitted a ship, m means missed and hit water
    const result = ship ? "h" : "m";
    if (isAShip(ship)) ship.hit();
    board[position[0]][position[1]] = result;
  }

  function isAShip(cell) {
    return !["", "h", "m"].includes(cell);
  }

  function allShipsSunk() {
    for (let row of getBoard()) {
      for (let cell of row) {
        if (!["", "h", "m"].includes(cell)) return false;
      }
    }
    return true;
  }

  function anyMoveWasMade() {
    for (let row of getBoard()) {
      for (let cell of row) {
        if (["h", "m"].includes(cell)) return true;
      }
    }
    return false;
  }

  function availablePosition(position) {
    if (isAShipNear(position)) return false;

    for (let cell of position) {
      if (getShip(cell) !== "") return false;
    }
    return true;
  }

  function isAShipNear(position) {
    const start = position[0];
    const end = position[position.length - 1];

    for (let row = start[0] - 1; row <= end[0] + 1; row++) {
      for (let col = start[1] - 1; col <= end[1] + 1; col++) {
        if (checkPosition(position, [row, col])) return true;
      }
    }
    return false;
  }

  function checkPosition(position, cell) {
    if (position.includes(cell) || isOutsideBorder(cell)) return;
    if (getShip(cell) !== "") return true;
  }

  function getShip(position) {
    return getBoard()[position[0]][position[1]];
  }

  function createBoard() {
    return [...Array(10)].map((o) => [...Array(10)].map((i) => ""));
  }

  function getBoard() {
    return board;
  }

  function isOutsideBorder(cell) {
    const row = cell[0];
    const col = cell[1];
    return row < 0 || row > 9 || col < 0 || col > 9;
  }

  function attackedPosition(position) {
    const cell = board[position[0]][position[1]];
    return ["h", "m"].includes(cell);
  }

  return {
    placeShip,
    getShip,
    receiveAttack,
    getBoard,
    allShipsSunk,
    anyMoveWasMade,
    attackedPosition,
  };
};

module.exports = Gameboard;
