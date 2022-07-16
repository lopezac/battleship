/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Player = __webpack_require__(/*! ./player.js */ "./src/modules/player.js");

const Ship = __webpack_require__(/*! ./ship.js */ "./src/modules/ship.js");

const Gameboard = __webpack_require__(/*! ./gameboard.js */ "./src/modules/gameboard.js");

const GameDOM = __webpack_require__(/*! ./gameDOM.js */ "./src/modules/gameDOM.js");

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
    gameboard.placeShip(Ship(1), [[0, 9]]); // gameboard.placeShip(Ship(2), [
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
    start
  };
})(GameDOM, Ship);

module.exports = Game;

/***/ }),

/***/ "./src/modules/gameDOM.js":
/*!********************************!*\
  !*** ./src/modules/gameDOM.js ***!
  \********************************/
/***/ ((module) => {

const gameDOM = (() => {
  const pBoardDiv = document.querySelector(".player-board");
  const cBoardDiv = document.querySelector(".computer-board");
  createBoard(pBoardDiv);
  createBoard(cBoardDiv);
  const cBoardCells = cBoardDiv.querySelectorAll(".cell");

  const listenBoard = playerTurn => {
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
    return document.querySelectorAll(".computer-board .cell");
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
    getPlayerBoardCells
  };
})();

module.exports = gameDOM;

/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((module) => {

const Gameboard = Ship => {
  let board = createBoard();

  function placeShip(ship, position) {
    if (!availablePosition(position)) return;

    for (let cell of position) {
      board[cell[0]][cell[1]] = ship;
    }
  }

  function receiveAttack(position) {
    const ship = getShip(position); // h means hitted a ship, m means missed and hit water

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
    return [...Array(10)].map(o => [...Array(10)].map(i => ""));
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
    attackedPosition
  };
};

module.exports = Gameboard;

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((module) => {

const Player = function (gameboard) {
  let robot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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
    getComputerMove
  };
};

module.exports = Player;

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((module) => {

const Ship = size => {
  let surface;

  const hit = position => {
    // surface[position] = "x";
    for (let i = 0; i < surface.length; i++) {
      if (surface[i] === "") return surface[i] = "x";
    }
  };

  const isSunk = () => {
    for (const cell of getSurface()) {
      if (cell === "") return false;
    }

    return true;
  };

  const setSurface = size => {
    surface = Array(size).fill("");
  };

  const getSurface = () => {
    return surface;
  };

  setSurface(size);
  return {
    hit,
    isSunk,
    getSurface,
    surface //for development

  };
};

module.exports = Ship;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/modern-normalize/modern-normalize.css":
/*!**************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/modern-normalize/modern-normalize.css ***!
  \**************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n::before,\n::after {\n\tbox-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\nhtml {\n\t-moz-tab-size: 4;\n\ttab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n\tline-height: 1.15; /* 1 */\n\t-webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n\tmargin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n\theight: 0; /* 1 */\n\tcolor: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n\ttext-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n\tfont-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n\tfont-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n\tfont-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -0.25em;\n}\n\nsup {\n\ttop: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n\ttext-indent: 0; /* 1 */\n\tborder-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tfont-family: inherit; /* 1 */\n\tfont-size: 100%; /* 1 */\n\tline-height: 1.15; /* 1 */\n\tmargin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n\ttext-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n\t-webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n::-moz-focus-inner {\n\tborder-style: none;\n\tpadding: 0;\n}\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n:-moz-focusring {\n\toutline: 1px dotted ButtonText;\n}\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n:-moz-ui-invalid {\n\tbox-shadow: none;\n}\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n\tpadding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n\tvertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n\t-webkit-appearance: textfield; /* 1 */\n\toutline-offset: -2px; /* 2 */\n}\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n::-webkit-file-upload-button {\n\t-webkit-appearance: button; /* 1 */\n\tfont: inherit; /* 2 */\n}\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n\tdisplay: list-item;\n}\n", "",{"version":3,"sources":["webpack://./node_modules/modern-normalize/modern-normalize.css"],"names":[],"mappings":"AAAA,8FAA8F;;AAE9F;;;CAGC;;AAED;;CAEC;;AAED;;;CAGC,sBAAsB;AACvB;;AAEA;;CAEC;;AAED;CACC,gBAAgB;CAChB,WAAW;AACZ;;AAEA;;;CAGC;;AAED;CACC,iBAAiB,EAAE,MAAM;CACzB,8BAA8B,EAAE,MAAM;AACvC;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;CACC,SAAS;AACV;;AAEA;;CAEC;;AAED;CACC;;;;;;;;;kBASiB;AAClB;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;CACC,SAAS,EAAE,MAAM;CACjB,cAAc,EAAE,MAAM;AACvB;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;CACC,iCAAiC;AAClC;;AAEA;;CAEC;;AAED;;CAEC,mBAAmB;AACpB;;AAEA;;;CAGC;;AAED;;;;CAIC;;;;;;WAMU,EAAE,MAAM;CAClB,cAAc,EAAE,MAAM;AACvB;;AAEA;;CAEC;;AAED;CACC,cAAc;AACf;;AAEA;;CAEC;;AAED;;CAEC,cAAc;CACd,cAAc;CACd,kBAAkB;CAClB,wBAAwB;AACzB;;AAEA;CACC,eAAe;AAChB;;AAEA;CACC,WAAW;AACZ;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;CACC,cAAc,EAAE,MAAM;CACtB,qBAAqB,EAAE,MAAM;AAC9B;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;;;;;CAKC,oBAAoB,EAAE,MAAM;CAC5B,eAAe,EAAE,MAAM;CACvB,iBAAiB,EAAE,MAAM;CACzB,SAAS,EAAE,MAAM;AAClB;;AAEA;;;CAGC;;AAED;SACS,MAAM;CACd,oBAAoB;AACrB;;AAEA;;CAEC;;AAED;;;;CAIC,0BAA0B;AAC3B;;AAEA;;CAEC;;AAED;CACC,kBAAkB;CAClB,UAAU;AACX;;AAEA;;CAEC;;AAED;CACC,8BAA8B;AAC/B;;AAEA;;;CAGC;;AAED;CACC,gBAAgB;AACjB;;AAEA;;CAEC;;AAED;CACC,UAAU;AACX;;AAEA;;CAEC;;AAED;CACC,wBAAwB;AACzB;;AAEA;;CAEC;;AAED;;CAEC,YAAY;AACb;;AAEA;;;CAGC;;AAED;CACC,6BAA6B,EAAE,MAAM;CACrC,oBAAoB,EAAE,MAAM;AAC7B;;AAEA;;CAEC;;AAED;CACC,wBAAwB;AACzB;;AAEA;;;CAGC;;AAED;CACC,0BAA0B,EAAE,MAAM;CAClC,aAAa,EAAE,MAAM;AACtB;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;CACC,kBAAkB;AACnB","sourcesContent":["/*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n::before,\n::after {\n\tbox-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\nhtml {\n\t-moz-tab-size: 4;\n\ttab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n\tline-height: 1.15; /* 1 */\n\t-webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n\tmargin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n\tfont-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n\theight: 0; /* 1 */\n\tcolor: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n\ttext-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n\tfont-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n\tfont-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n\tfont-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -0.25em;\n}\n\nsup {\n\ttop: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n\ttext-indent: 0; /* 1 */\n\tborder-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tfont-family: inherit; /* 1 */\n\tfont-size: 100%; /* 1 */\n\tline-height: 1.15; /* 1 */\n\tmargin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n\ttext-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n\t-webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n::-moz-focus-inner {\n\tborder-style: none;\n\tpadding: 0;\n}\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n:-moz-focusring {\n\toutline: 1px dotted ButtonText;\n}\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n:-moz-ui-invalid {\n\tbox-shadow: none;\n}\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n\tpadding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n\tvertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n\t-webkit-appearance: textfield; /* 1 */\n\toutline-offset: -2px; /* 2 */\n}\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n::-webkit-file-upload-button {\n\t-webkit-appearance: button; /* 1 */\n\tfont: inherit; /* 2 */\n}\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n\tdisplay: list-item;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "html {\n  height: 100%;\n}\n\nbody {\n  min-height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n/* Boards */\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n/* individual board */\n.player-board,\n.computer-board {\n  width: 300px;\n  height: 300px;\n  display: flex;\n}\n\n/* Cells */\n.row > .cell {\n  width: 30px;\n  height: 30px;\n  border-right: 1px solid black;\n  border-bottom: 1px solid black;\n}\n\n.row:nth-child(1) {\n  border-left: 1px solid black;\n}\n\n.row > .cell:nth-child(1) {\n  border-top: 1px solid black;\n}\n\n.row > .cell.ship {\n  background-color: blue;\n}\n\n.row > .cell.shipHitted {\n  background-color: red;\n}\n\n.row > .cell.miss {\n  background-color: lightskyblue;\n}\n", "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;EACE,YAAY;AACd;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA,WAAW;AACX;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA,qBAAqB;AACrB;;EAEE,YAAY;EACZ,aAAa;EACb,aAAa;AACf;;AAEA,UAAU;AACV;EACE,WAAW;EACX,YAAY;EACZ,6BAA6B;EAC7B,8BAA8B;AAChC;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,8BAA8B;AAChC","sourcesContent":["html {\n  height: 100%;\n}\n\nbody {\n  min-height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n/* Boards */\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n/* individual board */\n.player-board,\n.computer-board {\n  width: 300px;\n  height: 300px;\n  display: flex;\n}\n\n/* Cells */\n.row > .cell {\n  width: 30px;\n  height: 30px;\n  border-right: 1px solid black;\n  border-bottom: 1px solid black;\n}\n\n.row:nth-child(1) {\n  border-left: 1px solid black;\n}\n\n.row > .cell:nth-child(1) {\n  border-top: 1px solid black;\n}\n\n.row > .cell.ship {\n  background-color: blue;\n}\n\n.row > .cell.shipHitted {\n  background-color: red;\n}\n\n.row > .cell.miss {\n  background-color: lightskyblue;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/modern-normalize/modern-normalize.css":
/*!************************************************************!*\
  !*** ./node_modules/modern-normalize/modern-normalize.css ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_modern_normalize_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js!./modern-normalize.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/modern-normalize/modern-normalize.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_modern_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_modern_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_modern_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_modern_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var modern_normalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modern-normalize */ "./node_modules/modern-normalize/modern-normalize.css");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.css */ "./src/styles.css");
/* harmony import */ var _modules_game_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/game.js */ "./src/modules/game.js");
/* harmony import */ var _modules_game_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modules_game_js__WEBPACK_IMPORTED_MODULE_2__);



_modules_game_js__WEBPACK_IMPORTED_MODULE_2___default().start();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O1VDZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBRUE7QUFFQUcsNkRBQUEsRyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lRE9NLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL21vZGVybi1ub3JtYWxpemUvbW9kZXJuLW5vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZXMuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL21vZGVybi1ub3JtYWxpemUvbW9kZXJuLW5vcm1hbGl6ZS5jc3M/MWY2MiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy5jc3M/NDRiMiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vcGxheWVyLmpzXCIpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL3NoaXAuanNcIik7XG5jb25zdCBHYW1lYm9hcmQgPSByZXF1aXJlKFwiLi9nYW1lYm9hcmQuanNcIik7XG5jb25zdCBHYW1lRE9NID0gcmVxdWlyZShcIi4vZ2FtZURPTS5qc1wiKTtcblxuY29uc3QgR2FtZSA9ICgoZ2FtZURPTSwgU2hpcCkgPT4ge1xuICBsZXQgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChTaGlwKTtcbiAgbGV0IGNvbXB1dGVyID0gUGxheWVyKGNvbXB1dGVyQm9hcmQsIHRydWUpO1xuICBjb25zdCBjb21wdXRlckJvYXJkRGl2ID0gZ2FtZURPTS5nZXRDb21wdXRlckJvYXJkKCk7XG4gIGxldCBjb21wdXRlckJvYXJkQ2VsbHMgPSBnYW1lRE9NLmdldENvbXB1dGVyQm9hcmRDZWxscygpO1xuXG4gIGxldCBwbGF5ZXJCb2FyZCA9IEdhbWVib2FyZChTaGlwKTtcbiAgbGV0IHBsYXllciA9IFBsYXllcihwbGF5ZXJCb2FyZCk7XG4gIGNvbnN0IHBsYXllckJvYXJkRGl2ID0gZ2FtZURPTS5nZXRQbGF5ZXJCb2FyZCgpO1xuICBjb25zdCBwbGF5ZXJCb2FyZENlbGxzID0gZ2FtZURPTS5nZXRQbGF5ZXJCb2FyZENlbGxzKCk7XG5cbiAgbGV0IGN1cnJlbnRQbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgcG9wdWxhdGVHYW1lYm9hcmQoY29tcHV0ZXJCb2FyZCk7XG4gICAgcG9wdWxhdGVHYW1lYm9hcmQocGxheWVyQm9hcmQpO1xuICAgIGdhbWVET00ucGxhY2VTaGlwcyhjb21wdXRlckJvYXJkRGl2LCBjb21wdXRlckJvYXJkKTtcbiAgICBnYW1lRE9NLnBsYWNlU2hpcHMocGxheWVyQm9hcmREaXYsIHBsYXllckJvYXJkKTtcbiAgICBsaXN0ZW5Cb2FyZCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuQm9hcmQoKSB7XG4gICAgZm9yIChsZXQgY2VsbCBvZiBjb21wdXRlckJvYXJkQ2VsbHMpIHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IHBsYXllcikgcGxheWVyVHVybihjZWxsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXllclR1cm4oY2VsbCkge1xuICAgIGlmIChnYW1lT3ZlcigpKSB7XG4gICAgICByZXNldCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbiA9IGdhbWVET00uZ2V0Q2VsbFBvc2l0aW9uKGNlbGwpO1xuICAgIGlmIChjb21wdXRlckJvYXJkLmF0dGFja2VkUG9zaXRpb24ocG9zaXRpb24pKSByZXR1cm47XG4gICAgY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHBvc2l0aW9uKTtcbiAgICBnYW1lRE9NLmF0dGFjayhjb21wdXRlckJvYXJkLCBjb21wdXRlckJvYXJkRGl2LCBwb3NpdGlvbik7XG5cbiAgICBzd2l0Y2hQbGF5ZXIoKTtcbiAgICBjb21wdXRlclR1cm4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVyVHVybigpIHtcbiAgICBpZiAoZ2FtZU92ZXIoKSkge1xuICAgICAgcmVzZXQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb24gPSBjb21wdXRlci5nZXRDb21wdXRlck1vdmUoKTtcbiAgICBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHBvc2l0aW9uKTtcbiAgICBnYW1lRE9NLmF0dGFjayhwbGF5ZXJCb2FyZCwgcGxheWVyQm9hcmREaXYsIHBvc2l0aW9uKTtcblxuICAgIHN3aXRjaFBsYXllcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3dpdGNoUGxheWVyKCkge1xuICAgIGN1cnJlbnRQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSBwbGF5ZXIgPyBjb21wdXRlciA6IHBsYXllcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIHJldHVybiBwbGF5ZXJCb2FyZC5hbGxTaGlwc1N1bmsoKSB8fCBjb21wdXRlckJvYXJkLmFsbFNoaXBzU3VuaygpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgY29tcHV0ZXJCb2FyZCA9IEdhbWVib2FyZChTaGlwKTtcbiAgICBjb21wdXRlciA9IFBsYXllcihjb21wdXRlckJvYXJkLCB0cnVlKTtcblxuICAgIHBsYXllckJvYXJkID0gR2FtZWJvYXJkKFNoaXApO1xuICAgIHBsYXllciA9IFBsYXllcihwbGF5ZXJCb2FyZCk7XG5cbiAgICBnYW1lRE9NLmNyZWF0ZUJvYXJkKHBsYXllckJvYXJkRGl2KTtcbiAgICBnYW1lRE9NLmNyZWF0ZUJvYXJkKGNvbXB1dGVyQm9hcmREaXYpO1xuXG4gICAgY29tcHV0ZXJCb2FyZENlbGxzID0gZ2FtZURPTS5nZXRDb21wdXRlckJvYXJkQ2VsbHMoKTtcbiAgICBjdXJyZW50UGxheWVyID0gcGxheWVyO1xuICAgIHN0YXJ0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBwb3B1bGF0ZUdhbWVib2FyZChnYW1lYm9hcmQpIHtcbiAgICAvLyBpbXBsZW1lbnQgaXQgbGF0ZXJcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMSksIFtbMCwgMF1dKTtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMSksIFtbOSwgOV1dKTtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMSksIFtbOSwgMF1dKTtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMSksIFtbMCwgOV1dKTtcblxuICAgIC8vIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgyKSwgW1xuICAgIC8vICAgWzIsIDBdLFxuICAgIC8vICAgWzMsIDBdLFxuICAgIC8vIF0pO1xuICAgIC8vIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgyKSwgW1xuICAgIC8vICAgWzIsIDldLFxuICAgIC8vICAgWzMsIDldLFxuICAgIC8vIF0pO1xuICAgIC8vIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgyKSwgW1xuICAgIC8vICAgWzUsIDhdLFxuICAgIC8vICAgWzUsIDldLFxuICAgIC8vIF0pO1xuXG4gICAgLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDMpLCBbXG4gICAgLy8gICBbNCwgMl0sXG4gICAgLy8gICBbNCwgM10sXG4gICAgLy8gICBbNCwgNF0sXG4gICAgLy8gXSk7XG4gICAgLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDMpLCBbXG4gICAgLy8gICBbNiwgMl0sXG4gICAgLy8gICBbNiwgM10sXG4gICAgLy8gICBbNiwgNF0sXG4gICAgLy8gXSk7XG5cbiAgICAvLyBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMyksIFtcbiAgICAvLyAgIFsyLCAzXSxcbiAgICAvLyAgIFs2LCAzXSxcbiAgICAvLyAgIFs2LCA0XSxcbiAgICAvLyBdKTtcblxuICAgIC8vIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCg0KSwgW1xuICAgIC8vICAgWzgsIDNdLFxuICAgIC8vICAgWzgsIDRdLFxuICAgIC8vICAgWzgsIDVdLFxuICAgIC8vICAgWzgsIDZdLFxuICAgIC8vIF0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydCxcbiAgfTtcbn0pKEdhbWVET00sIFNoaXApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4iLCJjb25zdCBnYW1lRE9NID0gKCgpID0+IHtcbiAgY29uc3QgcEJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItYm9hcmRcIik7XG4gIGNvbnN0IGNCb2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItYm9hcmRcIik7XG4gIGNyZWF0ZUJvYXJkKHBCb2FyZERpdik7XG4gIGNyZWF0ZUJvYXJkKGNCb2FyZERpdik7XG4gIGNvbnN0IGNCb2FyZENlbGxzID0gY0JvYXJkRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2VsbFwiKTtcblxuICBjb25zdCBsaXN0ZW5Cb2FyZCA9IChwbGF5ZXJUdXJuKSA9PiB7XG4gICAgZm9yIChsZXQgY2VsbCBvZiBjQm9hcmRDZWxscykge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGdldENlbGxQb3NpdGlvbihjZWxsKTtcbiAgICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICBwbGF5ZXJUdXJuKHBvc2l0aW9uKTtcbiAgICAgICAgYXR0YWNrKGNCb2FyZERpdiwgcG9zaXRpb24pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGdldENlbGxQb3NpdGlvbihjZWxsRGl2KSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93KyspIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGNCb2FyZERpdi5jaGlsZE5vZGVzW2NvbF0uY2hpbGROb2Rlc1tyb3ddO1xuICAgICAgICBpZiAoY2VsbCA9PT0gY2VsbERpdikgcmV0dXJuIFtyb3csIGNvbF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQm9hcmQoYm9hcmQpIHtcbiAgICByZXNldEJvYXJkKGJvYXJkKTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93KyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IGNyZWF0ZVJvdygpO1xuICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNldEJvYXJkKGJvYXJkKSB7XG4gICAgaWYgKGJvYXJkLmxhc3RDaGlsZCkge1xuICAgICAgd2hpbGUgKGJvYXJkLmxhc3RDaGlsZCkgYm9hcmQucmVtb3ZlQ2hpbGQoYm9hcmQubGFzdENoaWxkKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSb3coKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICByb3cuY2xhc3NMaXN0LmFkZChcInJvd1wiKTtcbiAgICBjcmVhdGVDb2x1bW5zKHJvdyk7XG4gICAgcmV0dXJuIHJvdztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbHVtbnMocm93KSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2VsbChib2FyZCwgcG9zaXRpb24pIHtcbiAgICByZXR1cm4gYm9hcmQuY2hpbGROb2Rlc1twb3NpdGlvblsxXV0uY2hpbGROb2Rlc1twb3NpdGlvblswXV07XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoYm9hcmQsIHBvc2l0aW9uKSB7XG4gICAgZm9yIChjb25zdCBjZWxsUG9zIG9mIHBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBjZWxsID0gZ2V0Q2VsbChib2FyZCwgY2VsbFBvcyk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcHMoYm9hcmREaXYsIGJvYXJkKSB7XG4gICAgY29uc3QgZ2FtZWJvYXJkID0gYm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wrKykge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmQuZ2V0U2hpcChbcm93LCBjb2xdKTtcbiAgICAgICAgaWYgKGNlbGwpIHBsYWNlU2hpcChib2FyZERpdiwgW1tyb3csIGNvbF1dKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2soYm9hcmQsIGJvYXJkRGl2LCBwb3NpdGlvbikge1xuICAgIGNvbnN0IGNlbGxEaXYgPSBnZXRDZWxsKGJvYXJkRGl2LCBwb3NpdGlvbik7XG4gICAgY29uc3QgY2VsbCA9IGJvYXJkLmdldFNoaXAocG9zaXRpb24pO1xuXG4gICAgaWYgKGNlbGwgPT09IFwiaFwiKSB7XG4gICAgICBjZWxsRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwXCIpO1xuICAgICAgY2VsbERpdi5jbGFzc0xpc3QuYWRkKFwic2hpcEhpdHRlZFwiKTtcbiAgICB9IGVsc2UgaWYgKGNlbGwgPT09IFwibVwiKSB7XG4gICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbXB1dGVyQm9hcmQoKSB7XG4gICAgcmV0dXJuIGNCb2FyZERpdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsYXllckJvYXJkKCkge1xuICAgIHJldHVybiBwQm9hcmREaXY7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb21wdXRlckJvYXJkQ2VsbHMoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tcHV0ZXItYm9hcmQgLmNlbGxcIik7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJCb2FyZENlbGxzKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYXllci1ib2FyZCAuY2VsbFwiKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGlzdGVuQm9hcmQsXG4gICAgZ2V0Q2VsbFBvc2l0aW9uLFxuICAgIGNyZWF0ZUJvYXJkLFxuICAgIGF0dGFjayxcbiAgICBwbGFjZVNoaXBzLFxuICAgIGdldENvbXB1dGVyQm9hcmQsXG4gICAgZ2V0UGxheWVyQm9hcmQsXG4gICAgZ2V0Q29tcHV0ZXJCb2FyZENlbGxzLFxuICAgIGdldFBsYXllckJvYXJkQ2VsbHMsXG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVET007XG4iLCJjb25zdCBHYW1lYm9hcmQgPSAoU2hpcCkgPT4ge1xuICBsZXQgYm9hcmQgPSBjcmVhdGVCb2FyZCgpO1xuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCBwb3NpdGlvbikge1xuICAgIGlmICghYXZhaWxhYmxlUG9zaXRpb24ocG9zaXRpb24pKSByZXR1cm47XG4gICAgZm9yIChsZXQgY2VsbCBvZiBwb3NpdGlvbikge1xuICAgICAgYm9hcmRbY2VsbFswXV1bY2VsbFsxXV0gPSBzaGlwO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socG9zaXRpb24pIHtcbiAgICBjb25zdCBzaGlwID0gZ2V0U2hpcChwb3NpdGlvbik7XG4gICAgLy8gaCBtZWFucyBoaXR0ZWQgYSBzaGlwLCBtIG1lYW5zIG1pc3NlZCBhbmQgaGl0IHdhdGVyXG4gICAgY29uc3QgcmVzdWx0ID0gc2hpcCA/IFwiaFwiIDogXCJtXCI7XG4gICAgaWYgKGlzQVNoaXAoc2hpcCkpIHNoaXAuaGl0KCk7XG4gICAgYm9hcmRbcG9zaXRpb25bMF1dW3Bvc2l0aW9uWzFdXSA9IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQVNoaXAoY2VsbCkge1xuICAgIHJldHVybiAhW1wiXCIsIFwiaFwiLCBcIm1cIl0uaW5jbHVkZXMoY2VsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBhbGxTaGlwc1N1bmsoKSB7XG4gICAgZm9yIChsZXQgcm93IG9mIGdldEJvYXJkKCkpIHtcbiAgICAgIGZvciAobGV0IGNlbGwgb2Ygcm93KSB7XG4gICAgICAgIGlmICghW1wiXCIsIFwiaFwiLCBcIm1cIl0uaW5jbHVkZXMoY2VsbCkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBhbnlNb3ZlV2FzTWFkZSgpIHtcbiAgICBmb3IgKGxldCByb3cgb2YgZ2V0Qm9hcmQoKSkge1xuICAgICAgZm9yIChsZXQgY2VsbCBvZiByb3cpIHtcbiAgICAgICAgaWYgKFtcImhcIiwgXCJtXCJdLmluY2x1ZGVzKGNlbGwpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gYXZhaWxhYmxlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBpZiAoaXNBU2hpcE5lYXIocG9zaXRpb24pKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBjZWxsIG9mIHBvc2l0aW9uKSB7XG4gICAgICBpZiAoZ2V0U2hpcChjZWxsKSAhPT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQVNoaXBOZWFyKHBvc2l0aW9uKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBwb3NpdGlvblswXTtcbiAgICBjb25zdCBlbmQgPSBwb3NpdGlvbltwb3NpdGlvbi5sZW5ndGggLSAxXTtcblxuICAgIGZvciAobGV0IHJvdyA9IHN0YXJ0WzBdIC0gMTsgcm93IDw9IGVuZFswXSArIDE7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSBzdGFydFsxXSAtIDE7IGNvbCA8PSBlbmRbMV0gKyAxOyBjb2wrKykge1xuICAgICAgICBpZiAoY2hlY2tQb3NpdGlvbihwb3NpdGlvbiwgW3JvdywgY29sXSkpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja1Bvc2l0aW9uKHBvc2l0aW9uLCBjZWxsKSB7XG4gICAgaWYgKHBvc2l0aW9uLmluY2x1ZGVzKGNlbGwpIHx8IGlzT3V0c2lkZUJvcmRlcihjZWxsKSkgcmV0dXJuO1xuICAgIGlmIChnZXRTaGlwKGNlbGwpICE9PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNoaXAocG9zaXRpb24pIHtcbiAgICByZXR1cm4gZ2V0Qm9hcmQoKVtwb3NpdGlvblswXV1bcG9zaXRpb25bMV1dO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQm9hcmQoKSB7XG4gICAgcmV0dXJuIFsuLi5BcnJheSgxMCldLm1hcCgobykgPT4gWy4uLkFycmF5KDEwKV0ubWFwKChpKSA9PiBcIlwiKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCb2FyZCgpIHtcbiAgICByZXR1cm4gYm9hcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc091dHNpZGVCb3JkZXIoY2VsbCkge1xuICAgIGNvbnN0IHJvdyA9IGNlbGxbMF07XG4gICAgY29uc3QgY29sID0gY2VsbFsxXTtcbiAgICByZXR1cm4gcm93IDwgMCB8fCByb3cgPiA5IHx8IGNvbCA8IDAgfHwgY29sID4gOTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja2VkUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCBjZWxsID0gYm9hcmRbcG9zaXRpb25bMF1dW3Bvc2l0aW9uWzFdXTtcbiAgICByZXR1cm4gW1wiaFwiLCBcIm1cIl0uaW5jbHVkZXMoY2VsbCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICBnZXRTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgZ2V0Qm9hcmQsXG4gICAgYWxsU2hpcHNTdW5rLFxuICAgIGFueU1vdmVXYXNNYWRlLFxuICAgIGF0dGFja2VkUG9zaXRpb24sXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVib2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChnYW1lYm9hcmQsIHJvYm90ID0gZmFsc2UpID0+IHtcbiAgY29uc3QgY29tcHV0ZXIgPSByb2JvdDtcblxuICBmdW5jdGlvbiBnZXRDb21wdXRlck1vdmUoKSB7XG4gICAgbGV0IHBvc2l0aW9uID0gcmFuZG9tTW92ZSgpO1xuICAgIHdoaWxlIChnYW1lYm9hcmQuYXR0YWNrZWRQb3NpdGlvbihwb3NpdGlvbikpIHtcbiAgICAgIHBvc2l0aW9uID0gcmFuZG9tTW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbU1vdmUoKSB7XG4gICAgcmV0dXJuIFtyYW5kb21OdW1iZXIoKSwgcmFuZG9tTnVtYmVyKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tTnVtYmVyKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FDb21wdXRlcigpIHtcbiAgICByZXR1cm4gY29tcHV0ZXI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGlzQUNvbXB1dGVyLFxuICAgIGdldENvbXB1dGVyTW92ZSxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IChzaXplKSA9PiB7XG4gIGxldCBzdXJmYWNlO1xuXG4gIGNvbnN0IGhpdCA9IChwb3NpdGlvbikgPT4ge1xuICAgIC8vIHN1cmZhY2VbcG9zaXRpb25dID0gXCJ4XCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdXJmYWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc3VyZmFjZVtpXSA9PT0gXCJcIikgcmV0dXJuIChzdXJmYWNlW2ldID0gXCJ4XCIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBjZWxsIG9mIGdldFN1cmZhY2UoKSkge1xuICAgICAgaWYgKGNlbGwgPT09IFwiXCIpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3VyZmFjZSA9IChzaXplKSA9PiB7XG4gICAgc3VyZmFjZSA9IEFycmF5KHNpemUpLmZpbGwoXCJcIik7XG4gIH07XG5cbiAgY29uc3QgZ2V0U3VyZmFjZSA9ICgpID0+IHtcbiAgICByZXR1cm4gc3VyZmFjZTtcbiAgfTtcblxuICBzZXRTdXJmYWNlKHNpemUpO1xuXG4gIHJldHVybiB7XG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICBnZXRTdXJmYWNlLFxuICAgIHN1cmZhY2UsIC8vZm9yIGRldmVsb3BtZW50XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIvKiEgbW9kZXJuLW5vcm1hbGl6ZSB2MS4xLjAgfCBNSVQgTGljZW5zZSB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvbW9kZXJuLW5vcm1hbGl6ZSAqL1xcblxcbi8qXFxuRG9jdW1lbnRcXG49PT09PT09PVxcbiovXFxuXFxuLyoqXFxuVXNlIGEgYmV0dGVyIGJveCBtb2RlbCAob3BpbmlvbmF0ZWQpLlxcbiovXFxuXFxuKixcXG46OmJlZm9yZSxcXG46OmFmdGVyIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4vKipcXG5Vc2UgYSBtb3JlIHJlYWRhYmxlIHRhYiBzaXplIChvcGluaW9uYXRlZCkuXFxuKi9cXG5cXG5odG1sIHtcXG5cXHQtbW96LXRhYi1zaXplOiA0O1xcblxcdHRhYi1zaXplOiA0O1xcbn1cXG5cXG4vKipcXG4xLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuKi9cXG5cXG5odG1sIHtcXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKlxcblNlY3Rpb25zXFxuPT09PT09PT1cXG4qL1xcblxcbi8qKlxcblJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbmJvZHkge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuSW1wcm92ZSBjb25zaXN0ZW5jeSBvZiBkZWZhdWx0IGZvbnRzIGluIGFsbCBicm93c2Vycy4gKGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvbW9kZXJuLW5vcm1hbGl6ZS9pc3N1ZXMvMylcXG4qL1xcblxcbmJvZHkge1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdHN5c3RlbS11aSxcXG5cXHRcXHQtYXBwbGUtc3lzdGVtLCAvKiBGaXJlZm94IHN1cHBvcnRzIHRoaXMgYnV0IG5vdCB5ZXQgYHN5c3RlbS11aWAgKi9cXG5cXHRcXHQnU2Vnb2UgVUknLFxcblxcdFxcdFJvYm90byxcXG5cXHRcXHRIZWx2ZXRpY2EsXFxuXFx0XFx0QXJpYWwsXFxuXFx0XFx0c2Fucy1zZXJpZixcXG5cXHRcXHQnQXBwbGUgQ29sb3IgRW1vamknLFxcblxcdFxcdCdTZWdvZSBVSSBFbW9qaSc7XFxufVxcblxcbi8qXFxuR3JvdXBpbmcgY29udGVudFxcbj09PT09PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbjEuIEFkZCB0aGUgY29ycmVjdCBoZWlnaHQgaW4gRmlyZWZveC5cXG4yLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBvZiBib3JkZXIgY29sb3IgaW4gRmlyZWZveC4gKGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTE5MDY1NSlcXG4qL1xcblxcbmhyIHtcXG5cXHRoZWlnaHQ6IDA7IC8qIDEgKi9cXG5cXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKlxcblRleHQtbGV2ZWwgc2VtYW50aWNzXFxuPT09PT09PT09PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbkFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcXG59XFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIEVkZ2UgYW5kIFNhZmFyaS5cXG4qL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4xLiBJbXByb3ZlIGNvbnNpc3RlbmN5IG9mIGRlZmF1bHQgZm9udHMgaW4gYWxsIGJyb3dzZXJzLiAoaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplL2lzc3Vlcy8zKVxcbjIuIENvcnJlY3QgdGhlIG9kZCAnZW0nIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAsXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHR1aS1tb25vc3BhY2UsXFxuXFx0XFx0U0ZNb25vLVJlZ3VsYXIsXFxuXFx0XFx0Q29uc29sYXMsXFxuXFx0XFx0J0xpYmVyYXRpb24gTW9ubycsXFxuXFx0XFx0TWVubG8sXFxuXFx0XFx0bW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcblByZXZlbnQgJ3N1YicgYW5kICdzdXAnIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLypcXG5UYWJ1bGFyIGRhdGFcXG49PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbjEuIFJlbW92ZSB0ZXh0IGluZGVudGF0aW9uIGZyb20gdGFibGUgY29udGVudHMgaW4gQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05OTkwODgsIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0yMDEyOTcpXFxuMi4gQ29ycmVjdCB0YWJsZSBib3JkZXIgY29sb3IgaW5oZXJpdGFuY2UgaW4gYWxsIENocm9tZSBhbmQgU2FmYXJpLiAoaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9OTM1NzI5LCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTk1MDE2KVxcbiovXFxuXFxudGFibGUge1xcblxcdHRleHQtaW5kZW50OiAwOyAvKiAxICovXFxuXFx0Ym9yZGVyLWNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuRm9ybXNcXG49PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuXFx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UgYW5kIEZpcmVmb3guXFxuMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG5cXHR0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuLyoqXFxuQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4qL1xcblxcbmJ1dHRvbixcXG5bdHlwZT0nYnV0dG9uJ10sXFxuW3R5cGU9J3Jlc2V0J10sXFxuW3R5cGU9J3N1Ym1pdCddIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4qL1xcblxcbjo6LW1vei1mb2N1cy1pbm5lciB7XFxuXFx0Ym9yZGVyLXN0eWxlOiBub25lO1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcblJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4qL1xcblxcbjotbW96LWZvY3VzcmluZyB7XFxuXFx0b3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGFkZGl0aW9uYWwgJzppbnZhbGlkJyBzdHlsZXMgaW4gRmlyZWZveC5cXG5TZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL2dlY2tvLWRldi9ibG9iLzJmOWVhY2Q5ZDNkOTk1YzkzN2I0MjUxYTU1NTdkOTVkNDk0YzliZTEvbGF5b3V0L3N0eWxlL3Jlcy9mb3Jtcy5jc3MjTDcyOC1MNzM3XFxuKi9cXG5cXG46LW1vei11aS1pbnZhbGlkIHtcXG5cXHRib3gtc2hhZG93OiBub25lO1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0ICdmaWVsZHNldCcgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxubGVnZW5kIHtcXG5cXHRwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSBhbmQgRmlyZWZveC5cXG4qL1xcblxcbnByb2dyZXNzIHtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbkNvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIFNhZmFyaS5cXG4qL1xcblxcbjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG46Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuKi9cXG5cXG5bdHlwZT0nc2VhcmNoJ10ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuXFx0b3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiovXFxuXFxuOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbjEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byAnaW5oZXJpdCcgaW4gU2FmYXJpLlxcbiovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG5cXHRmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuSW50ZXJhY3RpdmVcXG49PT09PT09PT09PVxcbiovXFxuXFxuLypcXG5BZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4qL1xcblxcbnN1bW1hcnkge1xcblxcdGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vbm9kZV9tb2R1bGVzL21vZGVybi1ub3JtYWxpemUvbW9kZXJuLW5vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsOEZBQThGOztBQUU5Rjs7O0NBR0M7O0FBRUQ7O0NBRUM7O0FBRUQ7OztDQUdDLHNCQUFzQjtBQUN2Qjs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLGdCQUFnQjtDQUNoQixXQUFXO0FBQ1o7O0FBRUE7OztDQUdDOztBQUVEO0NBQ0MsaUJBQWlCLEVBQUUsTUFBTTtDQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3ZDOztBQUVBOzs7Q0FHQzs7QUFFRDs7Q0FFQzs7QUFFRDtDQUNDLFNBQVM7QUFDVjs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDOzs7Ozs7Ozs7a0JBU2lCO0FBQ2xCOztBQUVBOzs7Q0FHQzs7QUFFRDs7O0NBR0M7O0FBRUQ7Q0FDQyxTQUFTLEVBQUUsTUFBTTtDQUNqQixjQUFjLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTs7O0NBR0M7O0FBRUQ7O0NBRUM7O0FBRUQ7Q0FDQyxpQ0FBaUM7QUFDbEM7O0FBRUE7O0NBRUM7O0FBRUQ7O0NBRUMsbUJBQW1CO0FBQ3BCOztBQUVBOzs7Q0FHQzs7QUFFRDs7OztDQUlDOzs7Ozs7V0FNVSxFQUFFLE1BQU07Q0FDbEIsY0FBYyxFQUFFLE1BQU07QUFDdkI7O0FBRUE7O0NBRUM7O0FBRUQ7Q0FDQyxjQUFjO0FBQ2Y7O0FBRUE7O0NBRUM7O0FBRUQ7O0NBRUMsY0FBYztDQUNkLGNBQWM7Q0FDZCxrQkFBa0I7Q0FDbEIsd0JBQXdCO0FBQ3pCOztBQUVBO0NBQ0MsZUFBZTtBQUNoQjs7QUFFQTtDQUNDLFdBQVc7QUFDWjs7QUFFQTs7O0NBR0M7O0FBRUQ7OztDQUdDOztBQUVEO0NBQ0MsY0FBYyxFQUFFLE1BQU07Q0FDdEIscUJBQXFCLEVBQUUsTUFBTTtBQUM5Qjs7QUFFQTs7O0NBR0M7O0FBRUQ7OztDQUdDOztBQUVEOzs7OztDQUtDLG9CQUFvQixFQUFFLE1BQU07Q0FDNUIsZUFBZSxFQUFFLE1BQU07Q0FDdkIsaUJBQWlCLEVBQUUsTUFBTTtDQUN6QixTQUFTLEVBQUUsTUFBTTtBQUNsQjs7QUFFQTs7O0NBR0M7O0FBRUQ7U0FDUyxNQUFNO0NBQ2Qsb0JBQW9CO0FBQ3JCOztBQUVBOztDQUVDOztBQUVEOzs7O0NBSUMsMEJBQTBCO0FBQzNCOztBQUVBOztDQUVDOztBQUVEO0NBQ0Msa0JBQWtCO0NBQ2xCLFVBQVU7QUFDWDs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLDhCQUE4QjtBQUMvQjs7QUFFQTs7O0NBR0M7O0FBRUQ7Q0FDQyxnQkFBZ0I7QUFDakI7O0FBRUE7O0NBRUM7O0FBRUQ7Q0FDQyxVQUFVO0FBQ1g7O0FBRUE7O0NBRUM7O0FBRUQ7Q0FDQyx3QkFBd0I7QUFDekI7O0FBRUE7O0NBRUM7O0FBRUQ7O0NBRUMsWUFBWTtBQUNiOztBQUVBOzs7Q0FHQzs7QUFFRDtDQUNDLDZCQUE2QixFQUFFLE1BQU07Q0FDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7O0NBR0M7O0FBRUQ7Q0FDQywwQkFBMEIsRUFBRSxNQUFNO0NBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3RCOztBQUVBOzs7Q0FHQzs7QUFFRDs7Q0FFQzs7QUFFRDtDQUNDLGtCQUFrQjtBQUNuQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbW9kZXJuLW5vcm1hbGl6ZSB2MS4xLjAgfCBNSVQgTGljZW5zZSB8IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvbW9kZXJuLW5vcm1hbGl6ZSAqL1xcblxcbi8qXFxuRG9jdW1lbnRcXG49PT09PT09PVxcbiovXFxuXFxuLyoqXFxuVXNlIGEgYmV0dGVyIGJveCBtb2RlbCAob3BpbmlvbmF0ZWQpLlxcbiovXFxuXFxuKixcXG46OmJlZm9yZSxcXG46OmFmdGVyIHtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4vKipcXG5Vc2UgYSBtb3JlIHJlYWRhYmxlIHRhYiBzaXplIChvcGluaW9uYXRlZCkuXFxuKi9cXG5cXG5odG1sIHtcXG5cXHQtbW96LXRhYi1zaXplOiA0O1xcblxcdHRhYi1zaXplOiA0O1xcbn1cXG5cXG4vKipcXG4xLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuKi9cXG5cXG5odG1sIHtcXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKlxcblNlY3Rpb25zXFxuPT09PT09PT1cXG4qL1xcblxcbi8qKlxcblJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbmJvZHkge1xcblxcdG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuSW1wcm92ZSBjb25zaXN0ZW5jeSBvZiBkZWZhdWx0IGZvbnRzIGluIGFsbCBicm93c2Vycy4gKGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvbW9kZXJuLW5vcm1hbGl6ZS9pc3N1ZXMvMylcXG4qL1xcblxcbmJvZHkge1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdHN5c3RlbS11aSxcXG5cXHRcXHQtYXBwbGUtc3lzdGVtLCAvKiBGaXJlZm94IHN1cHBvcnRzIHRoaXMgYnV0IG5vdCB5ZXQgYHN5c3RlbS11aWAgKi9cXG5cXHRcXHQnU2Vnb2UgVUknLFxcblxcdFxcdFJvYm90byxcXG5cXHRcXHRIZWx2ZXRpY2EsXFxuXFx0XFx0QXJpYWwsXFxuXFx0XFx0c2Fucy1zZXJpZixcXG5cXHRcXHQnQXBwbGUgQ29sb3IgRW1vamknLFxcblxcdFxcdCdTZWdvZSBVSSBFbW9qaSc7XFxufVxcblxcbi8qXFxuR3JvdXBpbmcgY29udGVudFxcbj09PT09PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbjEuIEFkZCB0aGUgY29ycmVjdCBoZWlnaHQgaW4gRmlyZWZveC5cXG4yLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBvZiBib3JkZXIgY29sb3IgaW4gRmlyZWZveC4gKGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTE5MDY1NSlcXG4qL1xcblxcbmhyIHtcXG5cXHRoZWlnaHQ6IDA7IC8qIDEgKi9cXG5cXHRjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKlxcblRleHQtbGV2ZWwgc2VtYW50aWNzXFxuPT09PT09PT09PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbkFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYWJiclt0aXRsZV0ge1xcblxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDtcXG59XFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIEVkZ2UgYW5kIFNhZmFyaS5cXG4qL1xcblxcbmIsXFxuc3Ryb25nIHtcXG5cXHRmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4xLiBJbXByb3ZlIGNvbnNpc3RlbmN5IG9mIGRlZmF1bHQgZm9udHMgaW4gYWxsIGJyb3dzZXJzLiAoaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplL2lzc3Vlcy8zKVxcbjIuIENvcnJlY3QgdGhlIG9kZCAnZW0nIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAsXFxucHJlIHtcXG5cXHRmb250LWZhbWlseTpcXG5cXHRcXHR1aS1tb25vc3BhY2UsXFxuXFx0XFx0U0ZNb25vLVJlZ3VsYXIsXFxuXFx0XFx0Q29uc29sYXMsXFxuXFx0XFx0J0xpYmVyYXRpb24gTW9ubycsXFxuXFx0XFx0TWVubG8sXFxuXFx0XFx0bW9ub3NwYWNlOyAvKiAxICovXFxuXFx0Zm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5zbWFsbCB7XFxuXFx0Zm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcblByZXZlbnQgJ3N1YicgYW5kICdzdXAnIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG5cXHRmb250LXNpemU6IDc1JTtcXG5cXHRsaW5lLWhlaWdodDogMDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcblxcdGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG5cXHR0b3A6IC0wLjVlbTtcXG59XFxuXFxuLypcXG5UYWJ1bGFyIGRhdGFcXG49PT09PT09PT09PT1cXG4qL1xcblxcbi8qKlxcbjEuIFJlbW92ZSB0ZXh0IGluZGVudGF0aW9uIGZyb20gdGFibGUgY29udGVudHMgaW4gQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05OTkwODgsIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0yMDEyOTcpXFxuMi4gQ29ycmVjdCB0YWJsZSBib3JkZXIgY29sb3IgaW5oZXJpdGFuY2UgaW4gYWxsIENocm9tZSBhbmQgU2FmYXJpLiAoaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9OTM1NzI5LCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTk1MDE2KVxcbiovXFxuXFxudGFibGUge1xcblxcdHRleHQtaW5kZW50OiAwOyAvKiAxICovXFxuXFx0Ym9yZGVyLWNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuRm9ybXNcXG49PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuXFx0Zm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG5cXHRsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcblxcdG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UgYW5kIEZpcmVmb3guXFxuMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG5cXHR0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuLyoqXFxuQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4qL1xcblxcbmJ1dHRvbixcXG5bdHlwZT0nYnV0dG9uJ10sXFxuW3R5cGU9J3Jlc2V0J10sXFxuW3R5cGU9J3N1Ym1pdCddIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4qL1xcblxcbjo6LW1vei1mb2N1cy1pbm5lciB7XFxuXFx0Ym9yZGVyLXN0eWxlOiBub25lO1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcblJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4qL1xcblxcbjotbW96LWZvY3VzcmluZyB7XFxuXFx0b3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGFkZGl0aW9uYWwgJzppbnZhbGlkJyBzdHlsZXMgaW4gRmlyZWZveC5cXG5TZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL2dlY2tvLWRldi9ibG9iLzJmOWVhY2Q5ZDNkOTk1YzkzN2I0MjUxYTU1NTdkOTVkNDk0YzliZTEvbGF5b3V0L3N0eWxlL3Jlcy9mb3Jtcy5jc3MjTDcyOC1MNzM3XFxuKi9cXG5cXG46LW1vei11aS1pbnZhbGlkIHtcXG5cXHRib3gtc2hhZG93OiBub25lO1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0ICdmaWVsZHNldCcgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxubGVnZW5kIHtcXG5cXHRwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSBhbmQgRmlyZWZveC5cXG4qL1xcblxcbnByb2dyZXNzIHtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbkNvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIFNhZmFyaS5cXG4qL1xcblxcbjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG46Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcblxcdGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuKi9cXG5cXG5bdHlwZT0nc2VhcmNoJ10ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuXFx0b3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiovXFxuXFxuOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbjEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byAnaW5oZXJpdCcgaW4gU2FmYXJpLlxcbiovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG5cXHRmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuSW50ZXJhY3RpdmVcXG49PT09PT09PT09PVxcbiovXFxuXFxuLypcXG5BZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4qL1xcblxcbnN1bW1hcnkge1xcblxcdGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiaHRtbCB7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbmJvZHkge1xcbiAgbWluLWhlaWdodDogMTAwJTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi8qIEJvYXJkcyAqL1xcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4vKiBpbmRpdmlkdWFsIGJvYXJkICovXFxuLnBsYXllci1ib2FyZCxcXG4uY29tcHV0ZXItYm9hcmQge1xcbiAgd2lkdGg6IDMwMHB4O1xcbiAgaGVpZ2h0OiAzMDBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi8qIENlbGxzICovXFxuLnJvdyA+IC5jZWxsIHtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgYmxhY2s7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5yb3c6bnRoLWNoaWxkKDEpIHtcXG4gIGJvcmRlci1sZWZ0OiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5yb3cgPiAuY2VsbDpudGgtY2hpbGQoMSkge1xcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4ucm93ID4gLmNlbGwuc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibHVlO1xcbn1cXG5cXG4ucm93ID4gLmNlbGwuc2hpcEhpdHRlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVxcblxcbi5yb3cgPiAuY2VsbC5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0c2t5Ymx1ZTtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUI7QUFDekI7O0FBRUEsV0FBVztBQUNYO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtBQUMvQjs7QUFFQSxxQkFBcUI7QUFDckI7O0VBRUUsWUFBWTtFQUNaLGFBQWE7RUFDYixhQUFhO0FBQ2Y7O0FBRUEsVUFBVTtBQUNWO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWiw2QkFBNkI7RUFDN0IsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsOEJBQThCO0FBQ2hDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImh0bWwge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4vKiBCb2FyZHMgKi9cXG4uYm9hcmRzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLyogaW5kaXZpZHVhbCBib2FyZCAqL1xcbi5wbGF5ZXItYm9hcmQsXFxuLmNvbXB1dGVyLWJvYXJkIHtcXG4gIHdpZHRoOiAzMDBweDtcXG4gIGhlaWdodDogMzAwcHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4vKiBDZWxscyAqL1xcbi5yb3cgPiAuY2VsbCB7XFxuICB3aWR0aDogMzBweDtcXG4gIGhlaWdodDogMzBweDtcXG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4ucm93Om50aC1jaGlsZCgxKSB7XFxuICBib3JkZXItbGVmdDogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4ucm93ID4gLmNlbGw6bnRoLWNoaWxkKDEpIHtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnJvdyA+IC5jZWxsLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcXG59XFxuXFxuLnJvdyA+IC5jZWxsLnNoaXBIaXR0ZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4ucm93ID4gLmNlbGwubWlzcyB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodHNreWJsdWU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2Rlcm4tbm9ybWFsaXplLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2Rlcm4tbm9ybWFsaXplLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIm1vZGVybi1ub3JtYWxpemVcIjtcbmltcG9ydCBcIi4vc3R5bGVzLmNzc1wiO1xuXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9tb2R1bGVzL2dhbWUuanNcIjtcblxuR2FtZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbIlBsYXllciIsInJlcXVpcmUiLCJTaGlwIiwiR2FtZWJvYXJkIiwiR2FtZURPTSIsIkdhbWUiLCJnYW1lRE9NIiwiY29tcHV0ZXJCb2FyZCIsImNvbXB1dGVyIiwiY29tcHV0ZXJCb2FyZERpdiIsImdldENvbXB1dGVyQm9hcmQiLCJjb21wdXRlckJvYXJkQ2VsbHMiLCJnZXRDb21wdXRlckJvYXJkQ2VsbHMiLCJwbGF5ZXJCb2FyZCIsInBsYXllciIsInBsYXllckJvYXJkRGl2IiwiZ2V0UGxheWVyQm9hcmQiLCJwbGF5ZXJCb2FyZENlbGxzIiwiZ2V0UGxheWVyQm9hcmRDZWxscyIsImN1cnJlbnRQbGF5ZXIiLCJzdGFydCIsInBvcHVsYXRlR2FtZWJvYXJkIiwicGxhY2VTaGlwcyIsImxpc3RlbkJvYXJkIiwiY2VsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJwbGF5ZXJUdXJuIiwiZ2FtZU92ZXIiLCJyZXNldCIsInBvc2l0aW9uIiwiZ2V0Q2VsbFBvc2l0aW9uIiwiYXR0YWNrZWRQb3NpdGlvbiIsInJlY2VpdmVBdHRhY2siLCJhdHRhY2siLCJzd2l0Y2hQbGF5ZXIiLCJjb21wdXRlclR1cm4iLCJnZXRDb21wdXRlck1vdmUiLCJhbGxTaGlwc1N1bmsiLCJjcmVhdGVCb2FyZCIsImdhbWVib2FyZCIsInBsYWNlU2hpcCIsIm1vZHVsZSIsImV4cG9ydHMiLCJwQm9hcmREaXYiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjQm9hcmREaXYiLCJjQm9hcmRDZWxscyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjb25zb2xlIiwibG9nIiwiY2VsbERpdiIsImNvbCIsInJvdyIsImNoaWxkTm9kZXMiLCJib2FyZCIsInJlc2V0Qm9hcmQiLCJjcmVhdGVSb3ciLCJhcHBlbmRDaGlsZCIsImxhc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImNyZWF0ZUNvbHVtbnMiLCJnZXRDZWxsIiwiY2VsbFBvcyIsImJvYXJkRGl2IiwiZ2V0Qm9hcmQiLCJnZXRTaGlwIiwicmVtb3ZlIiwic2hpcCIsImF2YWlsYWJsZVBvc2l0aW9uIiwicmVzdWx0IiwiaXNBU2hpcCIsImhpdCIsImluY2x1ZGVzIiwiYW55TW92ZVdhc01hZGUiLCJpc0FTaGlwTmVhciIsImVuZCIsImxlbmd0aCIsImNoZWNrUG9zaXRpb24iLCJpc091dHNpZGVCb3JkZXIiLCJBcnJheSIsIm1hcCIsIm8iLCJpIiwicm9ib3QiLCJyYW5kb21Nb3ZlIiwicmFuZG9tTnVtYmVyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaXNBQ29tcHV0ZXIiLCJzaXplIiwic3VyZmFjZSIsImlzU3VuayIsImdldFN1cmZhY2UiLCJzZXRTdXJmYWNlIiwiZmlsbCJdLCJzb3VyY2VSb290IjoiIn0=