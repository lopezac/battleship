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
    gameboard.placeShip(Ship(1), [[0, 9]]);
    gameboard.placeShip(Ship(2), [[2, 0], [3, 0]]);
    gameboard.placeShip(Ship(2), [[2, 9], [3, 9]]);
    gameboard.placeShip(Ship(2), [[5, 8], [5, 9]]);
    gameboard.placeShip(Ship(3), [[4, 2], [4, 3], [4, 4]]);
    gameboard.placeShip(Ship(3), [[6, 2], [6, 3], [6, 4]]);
    gameboard.placeShip(Ship(3), [[2, 3], [6, 3], [6, 4]]);
    gameboard.placeShip(Ship(4), [[8, 3], [8, 4], [8, 5], [8, 6]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7VUNmQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFFQTtBQUVBRyw2REFBQSxHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVET00uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbW9kZXJuLW5vcm1hbGl6ZS9tb2Rlcm4tbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbW9kZXJuLW5vcm1hbGl6ZS9tb2Rlcm4tbm9ybWFsaXplLmNzcz8xZjYyIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGVzLmNzcz80NGIyIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9wbGF5ZXIuanNcIik7XG5jb25zdCBTaGlwID0gcmVxdWlyZShcIi4vc2hpcC5qc1wiKTtcbmNvbnN0IEdhbWVib2FyZCA9IHJlcXVpcmUoXCIuL2dhbWVib2FyZC5qc1wiKTtcbmNvbnN0IEdhbWVET00gPSByZXF1aXJlKFwiLi9nYW1lRE9NLmpzXCIpO1xuXG5jb25zdCBHYW1lID0gKChnYW1lRE9NLCBTaGlwKSA9PiB7XG4gIGxldCBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKFNoaXApO1xuICBsZXQgY29tcHV0ZXIgPSBQbGF5ZXIoY29tcHV0ZXJCb2FyZCwgdHJ1ZSk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmREaXYgPSBnYW1lRE9NLmdldENvbXB1dGVyQm9hcmQoKTtcbiAgbGV0IGNvbXB1dGVyQm9hcmRDZWxscyA9IGdhbWVET00uZ2V0Q29tcHV0ZXJCb2FyZENlbGxzKCk7XG5cbiAgbGV0IHBsYXllckJvYXJkID0gR2FtZWJvYXJkKFNoaXApO1xuICBsZXQgcGxheWVyID0gUGxheWVyKHBsYXllckJvYXJkKTtcbiAgY29uc3QgcGxheWVyQm9hcmREaXYgPSBnYW1lRE9NLmdldFBsYXllckJvYXJkKCk7XG4gIGNvbnN0IHBsYXllckJvYXJkQ2VsbHMgPSBnYW1lRE9NLmdldFBsYXllckJvYXJkQ2VsbHMoKTtcblxuICBsZXQgY3VycmVudFBsYXllciA9IHBsYXllcjtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBwb3B1bGF0ZUdhbWVib2FyZChjb21wdXRlckJvYXJkKTtcbiAgICBwb3B1bGF0ZUdhbWVib2FyZChwbGF5ZXJCb2FyZCk7XG4gICAgZ2FtZURPTS5wbGFjZVNoaXBzKGNvbXB1dGVyQm9hcmREaXYsIGNvbXB1dGVyQm9hcmQpO1xuICAgIGdhbWVET00ucGxhY2VTaGlwcyhwbGF5ZXJCb2FyZERpdiwgcGxheWVyQm9hcmQpO1xuICAgIGxpc3RlbkJvYXJkKCk7XG4gIH1cblxuICBmdW5jdGlvbiBsaXN0ZW5Cb2FyZCgpIHtcbiAgICBmb3IgKGxldCBjZWxsIG9mIGNvbXB1dGVyQm9hcmRDZWxscykge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gcGxheWVyKSBwbGF5ZXJUdXJuKGNlbGwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxheWVyVHVybihjZWxsKSB7XG4gICAgaWYgKGdhbWVPdmVyKCkpIHtcbiAgICAgIHJlc2V0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9uID0gZ2FtZURPTS5nZXRDZWxsUG9zaXRpb24oY2VsbCk7XG4gICAgaWYgKGNvbXB1dGVyQm9hcmQuYXR0YWNrZWRQb3NpdGlvbihwb3NpdGlvbikpIHJldHVybjtcbiAgICBjb21wdXRlckJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIGdhbWVET00uYXR0YWNrKGNvbXB1dGVyQm9hcmQsIGNvbXB1dGVyQm9hcmREaXYsIHBvc2l0aW9uKTtcblxuICAgIHN3aXRjaFBsYXllcigpO1xuICAgIGNvbXB1dGVyVHVybigpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZXJUdXJuKCkge1xuICAgIGlmIChnYW1lT3ZlcigpKSB7XG4gICAgICByZXNldCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvbXB1dGVyLmdldENvbXB1dGVyTW92ZSgpO1xuICAgIHBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2socG9zaXRpb24pO1xuICAgIGdhbWVET00uYXR0YWNrKHBsYXllckJvYXJkLCBwbGF5ZXJCb2FyZERpdiwgcG9zaXRpb24pO1xuXG4gICAgc3dpdGNoUGxheWVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzd2l0Y2hQbGF5ZXIoKSB7XG4gICAgY3VycmVudFBsYXllciA9IGN1cnJlbnRQbGF5ZXIgPT09IHBsYXllciA/IGNvbXB1dGVyIDogcGxheWVyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgcmV0dXJuIHBsYXllckJvYXJkLmFsbFNoaXBzU3VuaygpIHx8IGNvbXB1dGVyQm9hcmQuYWxsU2hpcHNTdW5rKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBjb21wdXRlckJvYXJkID0gR2FtZWJvYXJkKFNoaXApO1xuICAgIGNvbXB1dGVyID0gUGxheWVyKGNvbXB1dGVyQm9hcmQsIHRydWUpO1xuXG4gICAgcGxheWVyQm9hcmQgPSBHYW1lYm9hcmQoU2hpcCk7XG4gICAgcGxheWVyID0gUGxheWVyKHBsYXllckJvYXJkKTtcblxuICAgIGdhbWVET00uY3JlYXRlQm9hcmQocGxheWVyQm9hcmREaXYpO1xuICAgIGdhbWVET00uY3JlYXRlQm9hcmQoY29tcHV0ZXJCb2FyZERpdik7XG5cbiAgICBjb21wdXRlckJvYXJkQ2VsbHMgPSBnYW1lRE9NLmdldENvbXB1dGVyQm9hcmRDZWxscygpO1xuICAgIGN1cnJlbnRQbGF5ZXIgPSBwbGF5ZXI7XG4gICAgc3RhcnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvcHVsYXRlR2FtZWJvYXJkKGdhbWVib2FyZCkge1xuICAgIC8vIGltcGxlbWVudCBpdCBsYXRlclxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgxKSwgW1swLCAwXV0pO1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgxKSwgW1s5LCA5XV0pO1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgxKSwgW1s5LCAwXV0pO1xuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgxKSwgW1swLCA5XV0pO1xuXG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDIpLCBbXG4gICAgICBbMiwgMF0sXG4gICAgICBbMywgMF0sXG4gICAgXSk7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDIpLCBbXG4gICAgICBbMiwgOV0sXG4gICAgICBbMywgOV0sXG4gICAgXSk7XG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDIpLCBbXG4gICAgICBbNSwgOF0sXG4gICAgICBbNSwgOV0sXG4gICAgXSk7XG5cbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMyksIFtcbiAgICAgIFs0LCAyXSxcbiAgICAgIFs0LCAzXSxcbiAgICAgIFs0LCA0XSxcbiAgICBdKTtcbiAgICBnYW1lYm9hcmQucGxhY2VTaGlwKFNoaXAoMyksIFtcbiAgICAgIFs2LCAyXSxcbiAgICAgIFs2LCAzXSxcbiAgICAgIFs2LCA0XSxcbiAgICBdKTtcblxuICAgIGdhbWVib2FyZC5wbGFjZVNoaXAoU2hpcCgzKSwgW1xuICAgICAgWzIsIDNdLFxuICAgICAgWzYsIDNdLFxuICAgICAgWzYsIDRdLFxuICAgIF0pO1xuXG4gICAgZ2FtZWJvYXJkLnBsYWNlU2hpcChTaGlwKDQpLCBbXG4gICAgICBbOCwgM10sXG4gICAgICBbOCwgNF0sXG4gICAgICBbOCwgNV0sXG4gICAgICBbOCwgNl0sXG4gICAgXSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0LFxuICB9O1xufSkoR2FtZURPTSwgU2hpcCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsImNvbnN0IGdhbWVET00gPSAoKCkgPT4ge1xuICBjb25zdCBwQm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1ib2FyZFwiKTtcbiAgY29uc3QgY0JvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1ib2FyZFwiKTtcbiAgY3JlYXRlQm9hcmQocEJvYXJkRGl2KTtcbiAgY3JlYXRlQm9hcmQoY0JvYXJkRGl2KTtcbiAgY29uc3QgY0JvYXJkQ2VsbHMgPSBjQm9hcmREaXYucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpO1xuXG4gIGNvbnN0IGxpc3RlbkJvYXJkID0gKHBsYXllclR1cm4pID0+IHtcbiAgICBmb3IgKGxldCBjZWxsIG9mIGNCb2FyZENlbGxzKSB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0Q2VsbFBvc2l0aW9uKGNlbGwpO1xuICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgIHBsYXllclR1cm4ocG9zaXRpb24pO1xuICAgICAgICBhdHRhY2soY0JvYXJkRGl2LCBwb3NpdGlvbik7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0Q2VsbFBvc2l0aW9uKGNlbGxEaXYpIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3crKykge1xuICAgICAgICBjb25zdCBjZWxsID0gY0JvYXJkRGl2LmNoaWxkTm9kZXNbY29sXS5jaGlsZE5vZGVzW3Jvd107XG4gICAgICAgIGlmIChjZWxsID09PSBjZWxsRGl2KSByZXR1cm4gW3JvdywgY29sXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVCb2FyZChib2FyZCkge1xuICAgIHJlc2V0Qm9hcmQoYm9hcmQpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3crKykge1xuICAgICAgY29uc3Qgcm93ID0gY3JlYXRlUm93KCk7XG4gICAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0Qm9hcmQoYm9hcmQpIHtcbiAgICBpZiAoYm9hcmQubGFzdENoaWxkKSB7XG4gICAgICB3aGlsZSAoYm9hcmQubGFzdENoaWxkKSBib2FyZC5yZW1vdmVDaGlsZChib2FyZC5sYXN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJvdygpIHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIGNyZWF0ZUNvbHVtbnMocm93KTtcbiAgICByZXR1cm4gcm93O1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ29sdW1ucyhyb3cpIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCAxMDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDZWxsKGJvYXJkLCBwb3NpdGlvbikge1xuICAgIHJldHVybiBib2FyZC5jaGlsZE5vZGVzW3Bvc2l0aW9uWzFdXS5jaGlsZE5vZGVzW3Bvc2l0aW9uWzBdXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChib2FyZCwgcG9zaXRpb24pIHtcbiAgICBmb3IgKGNvbnN0IGNlbGxQb3Mgb2YgcG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsKGJvYXJkLCBjZWxsUG9zKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwcyhib2FyZERpdiwgYm9hcmQpIHtcbiAgICBjb25zdCBnYW1lYm9hcmQgPSBib2FyZC5nZXRCb2FyZCgpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDEwOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgMTA7IGNvbCsrKSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZC5nZXRTaGlwKFtyb3csIGNvbF0pO1xuICAgICAgICBpZiAoY2VsbCkgcGxhY2VTaGlwKGJvYXJkRGl2LCBbW3JvdywgY29sXV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFjayhib2FyZCwgYm9hcmREaXYsIHBvc2l0aW9uKSB7XG4gICAgY29uc3QgY2VsbERpdiA9IGdldENlbGwoYm9hcmREaXYsIHBvc2l0aW9uKTtcbiAgICBjb25zdCBjZWxsID0gYm9hcmQuZ2V0U2hpcChwb3NpdGlvbik7XG5cbiAgICBpZiAoY2VsbCA9PT0gXCJoXCIpIHtcbiAgICAgIGNlbGxEaXYuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoXCJzaGlwSGl0dGVkXCIpO1xuICAgIH0gZWxzZSBpZiAoY2VsbCA9PT0gXCJtXCIpIHtcbiAgICAgIGNlbGxEaXYuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29tcHV0ZXJCb2FyZCgpIHtcbiAgICByZXR1cm4gY0JvYXJkRGl2O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGxheWVyQm9hcmQoKSB7XG4gICAgcmV0dXJuIHBCb2FyZERpdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbXB1dGVyQm9hcmRDZWxscygpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb21wdXRlci1ib2FyZCAuY2VsbFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsYXllckJvYXJkQ2VsbHMoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyLWJvYXJkIC5jZWxsXCIpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsaXN0ZW5Cb2FyZCxcbiAgICBnZXRDZWxsUG9zaXRpb24sXG4gICAgY3JlYXRlQm9hcmQsXG4gICAgYXR0YWNrLFxuICAgIHBsYWNlU2hpcHMsXG4gICAgZ2V0Q29tcHV0ZXJCb2FyZCxcbiAgICBnZXRQbGF5ZXJCb2FyZCxcbiAgICBnZXRDb21wdXRlckJvYXJkQ2VsbHMsXG4gICAgZ2V0UGxheWVyQm9hcmRDZWxscyxcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZURPTTtcbiIsImNvbnN0IEdhbWVib2FyZCA9IChTaGlwKSA9PiB7XG4gIGxldCBib2FyZCA9IGNyZWF0ZUJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHBvc2l0aW9uKSB7XG4gICAgaWYgKCFhdmFpbGFibGVQb3NpdGlvbihwb3NpdGlvbikpIHJldHVybjtcbiAgICBmb3IgKGxldCBjZWxsIG9mIHBvc2l0aW9uKSB7XG4gICAgICBib2FyZFtjZWxsWzBdXVtjZWxsWzFdXSA9IHNoaXA7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhwb3NpdGlvbikge1xuICAgIGNvbnN0IHNoaXAgPSBnZXRTaGlwKHBvc2l0aW9uKTtcbiAgICAvLyBoIG1lYW5zIGhpdHRlZCBhIHNoaXAsIG0gbWVhbnMgbWlzc2VkIGFuZCBoaXQgd2F0ZXJcbiAgICBjb25zdCByZXN1bHQgPSBzaGlwID8gXCJoXCIgOiBcIm1cIjtcbiAgICBpZiAoaXNBU2hpcChzaGlwKSkgc2hpcC5oaXQoKTtcbiAgICBib2FyZFtwb3NpdGlvblswXV1bcG9zaXRpb25bMV1dID0gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBU2hpcChjZWxsKSB7XG4gICAgcmV0dXJuICFbXCJcIiwgXCJoXCIsIFwibVwiXS5pbmNsdWRlcyhjZWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsbFNoaXBzU3VuaygpIHtcbiAgICBmb3IgKGxldCByb3cgb2YgZ2V0Qm9hcmQoKSkge1xuICAgICAgZm9yIChsZXQgY2VsbCBvZiByb3cpIHtcbiAgICAgICAgaWYgKCFbXCJcIiwgXCJoXCIsIFwibVwiXS5pbmNsdWRlcyhjZWxsKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFueU1vdmVXYXNNYWRlKCkge1xuICAgIGZvciAobGV0IHJvdyBvZiBnZXRCb2FyZCgpKSB7XG4gICAgICBmb3IgKGxldCBjZWxsIG9mIHJvdykge1xuICAgICAgICBpZiAoW1wiaFwiLCBcIm1cIl0uaW5jbHVkZXMoY2VsbCkpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBhdmFpbGFibGVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGlmIChpc0FTaGlwTmVhcihwb3NpdGlvbikpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGNlbGwgb2YgcG9zaXRpb24pIHtcbiAgICAgIGlmIChnZXRTaGlwKGNlbGwpICE9PSBcIlwiKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBU2hpcE5lYXIocG9zaXRpb24pIHtcbiAgICBjb25zdCBzdGFydCA9IHBvc2l0aW9uWzBdO1xuICAgIGNvbnN0IGVuZCA9IHBvc2l0aW9uW3Bvc2l0aW9uLmxlbmd0aCAtIDFdO1xuXG4gICAgZm9yIChsZXQgcm93ID0gc3RhcnRbMF0gLSAxOyByb3cgPD0gZW5kWzBdICsgMTsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IHN0YXJ0WzFdIC0gMTsgY29sIDw9IGVuZFsxXSArIDE7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjaGVja1Bvc2l0aW9uKHBvc2l0aW9uLCBbcm93LCBjb2xdKSkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrUG9zaXRpb24ocG9zaXRpb24sIGNlbGwpIHtcbiAgICBpZiAocG9zaXRpb24uaW5jbHVkZXMoY2VsbCkgfHwgaXNPdXRzaWRlQm9yZGVyKGNlbGwpKSByZXR1cm47XG4gICAgaWYgKGdldFNoaXAoY2VsbCkgIT09IFwiXCIpIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2hpcChwb3NpdGlvbikge1xuICAgIHJldHVybiBnZXRCb2FyZCgpW3Bvc2l0aW9uWzBdXVtwb3NpdGlvblsxXV07XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVCb2FyZCgpIHtcbiAgICByZXR1cm4gWy4uLkFycmF5KDEwKV0ubWFwKChvKSA9PiBbLi4uQXJyYXkoMTApXS5tYXAoKGkpID0+IFwiXCIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvYXJkKCkge1xuICAgIHJldHVybiBib2FyZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT3V0c2lkZUJvcmRlcihjZWxsKSB7XG4gICAgY29uc3Qgcm93ID0gY2VsbFswXTtcbiAgICBjb25zdCBjb2wgPSBjZWxsWzFdO1xuICAgIHJldHVybiByb3cgPCAwIHx8IHJvdyA+IDkgfHwgY29sIDwgMCB8fCBjb2wgPiA5O1xuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrZWRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IGNlbGwgPSBib2FyZFtwb3NpdGlvblswXV1bcG9zaXRpb25bMV1dO1xuICAgIHJldHVybiBbXCJoXCIsIFwibVwiXS5pbmNsdWRlcyhjZWxsKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGxhY2VTaGlwLFxuICAgIGdldFNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnZXRCb2FyZCxcbiAgICBhbGxTaGlwc1N1bmssXG4gICAgYW55TW92ZVdhc01hZGUsXG4gICAgYXR0YWNrZWRQb3NpdGlvbixcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkO1xuIiwiY29uc3QgUGxheWVyID0gKGdhbWVib2FyZCwgcm9ib3QgPSBmYWxzZSkgPT4ge1xuICBjb25zdCBjb21wdXRlciA9IHJvYm90O1xuXG4gIGZ1bmN0aW9uIGdldENvbXB1dGVyTW92ZSgpIHtcbiAgICBsZXQgcG9zaXRpb24gPSByYW5kb21Nb3ZlKCk7XG4gICAgd2hpbGUgKGdhbWVib2FyZC5hdHRhY2tlZFBvc2l0aW9uKHBvc2l0aW9uKSkge1xuICAgICAgcG9zaXRpb24gPSByYW5kb21Nb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tTW92ZSgpIHtcbiAgICByZXR1cm4gW3JhbmRvbU51bWJlcigpLCByYW5kb21OdW1iZXIoKV07XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQUNvbXB1dGVyKCkge1xuICAgIHJldHVybiBjb21wdXRlcjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaXNBQ29tcHV0ZXIsXG4gICAgZ2V0Q29tcHV0ZXJNb3ZlLFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7XG4iLCJjb25zdCBTaGlwID0gKHNpemUpID0+IHtcbiAgbGV0IHN1cmZhY2U7XG5cbiAgY29uc3QgaGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgLy8gc3VyZmFjZVtwb3NpdGlvbl0gPSBcInhcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1cmZhY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdXJmYWNlW2ldID09PSBcIlwiKSByZXR1cm4gKHN1cmZhY2VbaV0gPSBcInhcIik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IGNlbGwgb2YgZ2V0U3VyZmFjZSgpKSB7XG4gICAgICBpZiAoY2VsbCA9PT0gXCJcIikgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzZXRTdXJmYWNlID0gKHNpemUpID0+IHtcbiAgICBzdXJmYWNlID0gQXJyYXkoc2l6ZSkuZmlsbChcIlwiKTtcbiAgfTtcblxuICBjb25zdCBnZXRTdXJmYWNlID0gKCkgPT4ge1xuICAgIHJldHVybiBzdXJmYWNlO1xuICB9O1xuXG4gIHNldFN1cmZhY2Uoc2l6ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFN1cmZhY2UsXG4gICAgc3VyZmFjZSwgLy9mb3IgZGV2ZWxvcG1lbnRcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qISBtb2Rlcm4tbm9ybWFsaXplIHYxLjEuMCB8IE1JVCBMaWNlbnNlIHwgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplICovXFxuXFxuLypcXG5Eb2N1bWVudFxcbj09PT09PT09XFxuKi9cXG5cXG4vKipcXG5Vc2UgYSBiZXR0ZXIgYm94IG1vZGVsIChvcGluaW9uYXRlZCkuXFxuKi9cXG5cXG4qLFxcbjo6YmVmb3JlLFxcbjo6YWZ0ZXIge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbi8qKlxcblVzZSBhIG1vcmUgcmVhZGFibGUgdGFiIHNpemUgKG9waW5pb25hdGVkKS5cXG4qL1xcblxcbmh0bWwge1xcblxcdC1tb3otdGFiLXNpemU6IDQ7XFxuXFx0dGFiLXNpemU6IDQ7XFxufVxcblxcbi8qKlxcbjEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4yLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4qL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qXFxuU2VjdGlvbnNcXG49PT09PT09PVxcbiovXFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG5JbXByb3ZlIGNvbnNpc3RlbmN5IG9mIGRlZmF1bHQgZm9udHMgaW4gYWxsIGJyb3dzZXJzLiAoaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplL2lzc3Vlcy8zKVxcbiovXFxuXFxuYm9keSB7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sIC8qIEZpcmVmb3ggc3VwcG9ydHMgdGhpcyBidXQgbm90IHlldCBgc3lzdGVtLXVpYCAqL1xcblxcdFxcdCdTZWdvZSBVSScsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdEhlbHZldGljYSxcXG5cXHRcXHRBcmlhbCxcXG5cXHRcXHRzYW5zLXNlcmlmLFxcblxcdFxcdCdBcHBsZSBDb2xvciBFbW9qaScsXFxuXFx0XFx0J1NlZ29lIFVJIEVtb2ppJztcXG59XFxuXFxuLypcXG5Hcm91cGluZyBjb250ZW50XFxuPT09PT09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gQWRkIHRoZSBjb3JyZWN0IGhlaWdodCBpbiBGaXJlZm94LlxcbjIuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIG9mIGJvcmRlciBjb2xvciBpbiBGaXJlZm94LiAoaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTkwNjU1KVxcbiovXFxuXFxuaHIge1xcblxcdGhlaWdodDogMDsgLyogMSAqL1xcblxcdGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG49PT09PT09PT09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gRWRnZSBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYixcXG5zdHJvbmcge1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbjEuIEltcHJvdmUgY29uc2lzdGVuY3kgb2YgZGVmYXVsdCBmb250cyBpbiBhbGwgYnJvd3NlcnMuIChodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL21vZGVybi1ub3JtYWxpemUvaXNzdWVzLzMpXFxuMi4gQ29ycmVjdCB0aGUgb2RkICdlbScgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCxcXG5wcmUge1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdHVpLW1vbm9zcGFjZSxcXG5cXHRcXHRTRk1vbm8tUmVndWxhcixcXG5cXHRcXHRDb25zb2xhcyxcXG5cXHRcXHQnTGliZXJhdGlvbiBNb25vJyxcXG5cXHRcXHRNZW5sbyxcXG5cXHRcXHRtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbnNtYWxsIHtcXG5cXHRmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuUHJldmVudCAnc3ViJyBhbmQgJ3N1cCcgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbnN1YixcXG5zdXAge1xcblxcdGZvbnQtc2l6ZTogNzUlO1xcblxcdGxpbmUtaGVpZ2h0OiAwO1xcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuXFx0Ym90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcblxcdHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKlxcblRhYnVsYXIgZGF0YVxcbj09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gUmVtb3ZlIHRleHQgaW5kZW50YXRpb24gZnJvbSB0YWJsZSBjb250ZW50cyBpbiBDaHJvbWUgYW5kIFNhZmFyaS4gKGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTk5OTA4OCwgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTIwMTI5NylcXG4yLiBDb3JyZWN0IHRhYmxlIGJvcmRlciBjb2xvciBpbmhlcml0YW5jZSBpbiBhbGwgQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05MzU3MjksIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xOTUwMTYpXFxuKi9cXG5cXG50YWJsZSB7XFxuXFx0dGV4dC1pbmRlbnQ6IDA7IC8qIDEgKi9cXG5cXHRib3JkZXItY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLypcXG5Gb3Jtc1xcbj09PT09XFxuKi9cXG5cXG4vKipcXG4xLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4yLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSBhbmQgRmlyZWZveC5cXG4xLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG5Db3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYnV0dG9uLFxcblt0eXBlPSdidXR0b24nXSxcXG5bdHlwZT0ncmVzZXQnXSxcXG5bdHlwZT0nc3VibWl0J10ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiovXFxuXFxuOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiovXFxuXFxuOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgYWRkaXRpb25hbCAnOmludmFsaWQnIHN0eWxlcyBpbiBGaXJlZm94LlxcblNlZTogaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvZ2Vja28tZGV2L2Jsb2IvMmY5ZWFjZDlkM2Q5OTVjOTM3YjQyNTFhNTU1N2Q5NWQ0OTRjOWJlMS9sYXlvdXQvc3R5bGUvcmVzL2Zvcm1zLmNzcyNMNzI4LUw3MzdcXG4qL1xcblxcbjotbW96LXVpLWludmFsaWQge1xcblxcdGJveC1zaGFkb3c6IG5vbmU7XFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXQgJ2ZpZWxkc2V0JyBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5sZWdlbmQge1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbkFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lIGFuZCBGaXJlZm94LlxcbiovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gU2FmYXJpLlxcbiovXFxuXFxuOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4xLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4yLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4qL1xcblxcblt0eXBlPSdzZWFyY2gnXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuKi9cXG5cXG46Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4yLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvICdpbmhlcml0JyBpbiBTYWZhcmkuXFxuKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcblxcdGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLypcXG5JbnRlcmFjdGl2ZVxcbj09PT09PT09PT09XFxuKi9cXG5cXG4vKlxcbkFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiovXFxuXFxuc3VtbWFyeSB7XFxuXFx0ZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9ub2RlX21vZHVsZXMvbW9kZXJuLW5vcm1hbGl6ZS9tb2Rlcm4tbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSw4RkFBOEY7O0FBRTlGOzs7Q0FHQzs7QUFFRDs7Q0FFQzs7QUFFRDs7O0NBR0Msc0JBQXNCO0FBQ3ZCOztBQUVBOztDQUVDOztBQUVEO0NBQ0MsZ0JBQWdCO0NBQ2hCLFdBQVc7QUFDWjs7QUFFQTs7O0NBR0M7O0FBRUQ7Q0FDQyxpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDdkM7O0FBRUE7OztDQUdDOztBQUVEOztDQUVDOztBQUVEO0NBQ0MsU0FBUztBQUNWOztBQUVBOztDQUVDOztBQUVEO0NBQ0M7Ozs7Ozs7OztrQkFTaUI7QUFDbEI7O0FBRUE7OztDQUdDOztBQUVEOzs7Q0FHQzs7QUFFRDtDQUNDLFNBQVMsRUFBRSxNQUFNO0NBQ2pCLGNBQWMsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOzs7Q0FHQzs7QUFFRDs7Q0FFQzs7QUFFRDtDQUNDLGlDQUFpQztBQUNsQzs7QUFFQTs7Q0FFQzs7QUFFRDs7Q0FFQyxtQkFBbUI7QUFDcEI7O0FBRUE7OztDQUdDOztBQUVEOzs7O0NBSUM7Ozs7OztXQU1VLEVBQUUsTUFBTTtDQUNsQixjQUFjLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLGNBQWM7QUFDZjs7QUFFQTs7Q0FFQzs7QUFFRDs7Q0FFQyxjQUFjO0NBQ2QsY0FBYztDQUNkLGtCQUFrQjtDQUNsQix3QkFBd0I7QUFDekI7O0FBRUE7Q0FDQyxlQUFlO0FBQ2hCOztBQUVBO0NBQ0MsV0FBVztBQUNaOztBQUVBOzs7Q0FHQzs7QUFFRDs7O0NBR0M7O0FBRUQ7Q0FDQyxjQUFjLEVBQUUsTUFBTTtDQUN0QixxQkFBcUIsRUFBRSxNQUFNO0FBQzlCOztBQUVBOzs7Q0FHQzs7QUFFRDs7O0NBR0M7O0FBRUQ7Ozs7O0NBS0Msb0JBQW9CLEVBQUUsTUFBTTtDQUM1QixlQUFlLEVBQUUsTUFBTTtDQUN2QixpQkFBaUIsRUFBRSxNQUFNO0NBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ2xCOztBQUVBOzs7Q0FHQzs7QUFFRDtTQUNTLE1BQU07Q0FDZCxvQkFBb0I7QUFDckI7O0FBRUE7O0NBRUM7O0FBRUQ7Ozs7Q0FJQywwQkFBMEI7QUFDM0I7O0FBRUE7O0NBRUM7O0FBRUQ7Q0FDQyxrQkFBa0I7Q0FDbEIsVUFBVTtBQUNYOztBQUVBOztDQUVDOztBQUVEO0NBQ0MsOEJBQThCO0FBQy9COztBQUVBOzs7Q0FHQzs7QUFFRDtDQUNDLGdCQUFnQjtBQUNqQjs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLFVBQVU7QUFDWDs7QUFFQTs7Q0FFQzs7QUFFRDtDQUNDLHdCQUF3QjtBQUN6Qjs7QUFFQTs7Q0FFQzs7QUFFRDs7Q0FFQyxZQUFZO0FBQ2I7O0FBRUE7OztDQUdDOztBQUVEO0NBQ0MsNkJBQTZCLEVBQUUsTUFBTTtDQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0FBQzdCOztBQUVBOztDQUVDOztBQUVEO0NBQ0Msd0JBQXdCO0FBQ3pCOztBQUVBOzs7Q0FHQzs7QUFFRDtDQUNDLDBCQUEwQixFQUFFLE1BQU07Q0FDbEMsYUFBYSxFQUFFLE1BQU07QUFDdEI7O0FBRUE7OztDQUdDOztBQUVEOztDQUVDOztBQUVEO0NBQ0Msa0JBQWtCO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBtb2Rlcm4tbm9ybWFsaXplIHYxLjEuMCB8IE1JVCBMaWNlbnNlIHwgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplICovXFxuXFxuLypcXG5Eb2N1bWVudFxcbj09PT09PT09XFxuKi9cXG5cXG4vKipcXG5Vc2UgYSBiZXR0ZXIgYm94IG1vZGVsIChvcGluaW9uYXRlZCkuXFxuKi9cXG5cXG4qLFxcbjo6YmVmb3JlLFxcbjo6YWZ0ZXIge1xcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbi8qKlxcblVzZSBhIG1vcmUgcmVhZGFibGUgdGFiIHNpemUgKG9waW5pb25hdGVkKS5cXG4qL1xcblxcbmh0bWwge1xcblxcdC1tb3otdGFiLXNpemU6IDQ7XFxuXFx0dGFiLXNpemU6IDQ7XFxufVxcblxcbi8qKlxcbjEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4yLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4qL1xcblxcbmh0bWwge1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qXFxuU2VjdGlvbnNcXG49PT09PT09PVxcbiovXFxuXFxuLyoqXFxuUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxuYm9keSB7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG5JbXByb3ZlIGNvbnNpc3RlbmN5IG9mIGRlZmF1bHQgZm9udHMgaW4gYWxsIGJyb3dzZXJzLiAoaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9tb2Rlcm4tbm9ybWFsaXplL2lzc3Vlcy8zKVxcbiovXFxuXFxuYm9keSB7XFxuXFx0Zm9udC1mYW1pbHk6XFxuXFx0XFx0c3lzdGVtLXVpLFxcblxcdFxcdC1hcHBsZS1zeXN0ZW0sIC8qIEZpcmVmb3ggc3VwcG9ydHMgdGhpcyBidXQgbm90IHlldCBgc3lzdGVtLXVpYCAqL1xcblxcdFxcdCdTZWdvZSBVSScsXFxuXFx0XFx0Um9ib3RvLFxcblxcdFxcdEhlbHZldGljYSxcXG5cXHRcXHRBcmlhbCxcXG5cXHRcXHRzYW5zLXNlcmlmLFxcblxcdFxcdCdBcHBsZSBDb2xvciBFbW9qaScsXFxuXFx0XFx0J1NlZ29lIFVJIEVtb2ppJztcXG59XFxuXFxuLypcXG5Hcm91cGluZyBjb250ZW50XFxuPT09PT09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gQWRkIHRoZSBjb3JyZWN0IGhlaWdodCBpbiBGaXJlZm94LlxcbjIuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIG9mIGJvcmRlciBjb2xvciBpbiBGaXJlZm94LiAoaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTkwNjU1KVxcbiovXFxuXFxuaHIge1xcblxcdGhlaWdodDogMDsgLyogMSAqL1xcblxcdGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qXFxuVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG49PT09PT09PT09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkO1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gRWRnZSBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYixcXG5zdHJvbmcge1xcblxcdGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbjEuIEltcHJvdmUgY29uc2lzdGVuY3kgb2YgZGVmYXVsdCBmb250cyBpbiBhbGwgYnJvd3NlcnMuIChodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL21vZGVybi1ub3JtYWxpemUvaXNzdWVzLzMpXFxuMi4gQ29ycmVjdCB0aGUgb2RkICdlbScgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCxcXG5wcmUge1xcblxcdGZvbnQtZmFtaWx5OlxcblxcdFxcdHVpLW1vbm9zcGFjZSxcXG5cXHRcXHRTRk1vbm8tUmVndWxhcixcXG5cXHRcXHRDb25zb2xhcyxcXG5cXHRcXHQnTGliZXJhdGlvbiBNb25vJyxcXG5cXHRcXHRNZW5sbyxcXG5cXHRcXHRtb25vc3BhY2U7IC8qIDEgKi9cXG5cXHRmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5BZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbnNtYWxsIHtcXG5cXHRmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuUHJldmVudCAnc3ViJyBhbmQgJ3N1cCcgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4qL1xcblxcbnN1YixcXG5zdXAge1xcblxcdGZvbnQtc2l6ZTogNzUlO1xcblxcdGxpbmUtaGVpZ2h0OiAwO1xcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuXFx0Ym90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcblxcdHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKlxcblRhYnVsYXIgZGF0YVxcbj09PT09PT09PT09PVxcbiovXFxuXFxuLyoqXFxuMS4gUmVtb3ZlIHRleHQgaW5kZW50YXRpb24gZnJvbSB0YWJsZSBjb250ZW50cyBpbiBDaHJvbWUgYW5kIFNhZmFyaS4gKGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTk5OTA4OCwgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTIwMTI5NylcXG4yLiBDb3JyZWN0IHRhYmxlIGJvcmRlciBjb2xvciBpbmhlcml0YW5jZSBpbiBhbGwgQ2hyb21lIGFuZCBTYWZhcmkuIChodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD05MzU3MjksIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xOTUwMTYpXFxuKi9cXG5cXG50YWJsZSB7XFxuXFx0dGV4dC1pbmRlbnQ6IDA7IC8qIDEgKi9cXG5cXHRib3JkZXItY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLypcXG5Gb3Jtc1xcbj09PT09XFxuKi9cXG5cXG4vKipcXG4xLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4yLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG5cXHRmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcblxcdGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcblxcdGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuXFx0bWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSBhbmQgRmlyZWZveC5cXG4xLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcblxcdHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG5Db3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiovXFxuXFxuYnV0dG9uLFxcblt0eXBlPSdidXR0b24nXSxcXG5bdHlwZT0ncmVzZXQnXSxcXG5bdHlwZT0nc3VibWl0J10ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiovXFxuXFxuOjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXItc3R5bGU6IG5vbmU7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiovXFxuXFxuOi1tb3otZm9jdXNyaW5nIHtcXG5cXHRvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgYWRkaXRpb25hbCAnOmludmFsaWQnIHN0eWxlcyBpbiBGaXJlZm94LlxcblNlZTogaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvZ2Vja28tZGV2L2Jsb2IvMmY5ZWFjZDlkM2Q5OTVjOTM3YjQyNTFhNTU1N2Q5NWQ0OTRjOWJlMS9sYXlvdXQvc3R5bGUvcmVzL2Zvcm1zLmNzcyNMNzI4LUw3MzdcXG4qL1xcblxcbjotbW96LXVpLWludmFsaWQge1xcblxcdGJveC1zaGFkb3c6IG5vbmU7XFxufVxcblxcbi8qKlxcblJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXQgJ2ZpZWxkc2V0JyBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuKi9cXG5cXG5sZWdlbmQge1xcblxcdHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbkFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lIGFuZCBGaXJlZm94LlxcbiovXFxuXFxucHJvZ3Jlc3Mge1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gU2FmYXJpLlxcbiovXFxuXFxuOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuXFx0aGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4xLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4yLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4qL1xcblxcblt0eXBlPSdzZWFyY2gnXSB7XFxuXFx0LXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG5cXHRvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG5SZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuKi9cXG5cXG46Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcblxcdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4yLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvICdpbmhlcml0JyBpbiBTYWZhcmkuXFxuKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG5cXHQtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcblxcdGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLypcXG5JbnRlcmFjdGl2ZVxcbj09PT09PT09PT09XFxuKi9cXG5cXG4vKlxcbkFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiovXFxuXFxuc3VtbWFyeSB7XFxuXFx0ZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJodG1sIHtcXG4gIGhlaWdodDogMTAwJTtcXG59XFxuXFxuYm9keSB7XFxuICBtaW4taGVpZ2h0OiAxMDAlO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLyogQm9hcmRzICovXFxuLmJvYXJkcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxufVxcblxcbi8qIGluZGl2aWR1YWwgYm9hcmQgKi9cXG4ucGxheWVyLWJvYXJkLFxcbi5jb21wdXRlci1ib2FyZCB7XFxuICB3aWR0aDogMzAwcHg7XFxuICBoZWlnaHQ6IDMwMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLyogQ2VsbHMgKi9cXG4ucm93ID4gLmNlbGwge1xcbiAgd2lkdGg6IDMwcHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCBibGFjaztcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnJvdzpudGgtY2hpbGQoMSkge1xcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBibGFjaztcXG59XFxuXFxuLnJvdyA+IC5jZWxsOm50aC1jaGlsZCgxKSB7XFxuICBib3JkZXItdG9wOiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5yb3cgPiAuY2VsbC5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsdWU7XFxufVxcblxcbi5yb3cgPiAuY2VsbC5zaGlwSGl0dGVkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXG59XFxuXFxuLnJvdyA+IC5jZWxsLm1pc3Mge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRza3libHVlO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtBQUN6Qjs7QUFFQSxXQUFXO0FBQ1g7RUFDRSxhQUFhO0VBQ2IsNkJBQTZCO0FBQy9COztBQUVBLHFCQUFxQjtBQUNyQjs7RUFFRSxZQUFZO0VBQ1osYUFBYTtFQUNiLGFBQWE7QUFDZjs7QUFFQSxVQUFVO0FBQ1Y7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLDZCQUE2QjtFQUM3Qiw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSw4QkFBOEI7QUFDaENcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaHRtbCB7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbmJvZHkge1xcbiAgbWluLWhlaWdodDogMTAwJTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi8qIEJvYXJkcyAqL1xcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4vKiBpbmRpdmlkdWFsIGJvYXJkICovXFxuLnBsYXllci1ib2FyZCxcXG4uY29tcHV0ZXItYm9hcmQge1xcbiAgd2lkdGg6IDMwMHB4O1xcbiAgaGVpZ2h0OiAzMDBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi8qIENlbGxzICovXFxuLnJvdyA+IC5jZWxsIHtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgYmxhY2s7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5yb3c6bnRoLWNoaWxkKDEpIHtcXG4gIGJvcmRlci1sZWZ0OiAxcHggc29saWQgYmxhY2s7XFxufVxcblxcbi5yb3cgPiAuY2VsbDpudGgtY2hpbGQoMSkge1xcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4ucm93ID4gLmNlbGwuc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibHVlO1xcbn1cXG5cXG4ucm93ID4gLmNlbGwuc2hpcEhpdHRlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVxcblxcbi5yb3cgPiAuY2VsbC5taXNzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0c2t5Ymx1ZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vZGVybi1ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vZGVybi1ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwibW9kZXJuLW5vcm1hbGl6ZVwiO1xuaW1wb3J0IFwiLi9zdHlsZXMuY3NzXCI7XG5cbmltcG9ydCBHYW1lIGZyb20gXCIuL21vZHVsZXMvZ2FtZS5qc1wiO1xuXG5HYW1lLnN0YXJ0KCk7XG4iXSwibmFtZXMiOlsiUGxheWVyIiwicmVxdWlyZSIsIlNoaXAiLCJHYW1lYm9hcmQiLCJHYW1lRE9NIiwiR2FtZSIsImdhbWVET00iLCJjb21wdXRlckJvYXJkIiwiY29tcHV0ZXIiLCJjb21wdXRlckJvYXJkRGl2IiwiZ2V0Q29tcHV0ZXJCb2FyZCIsImNvbXB1dGVyQm9hcmRDZWxscyIsImdldENvbXB1dGVyQm9hcmRDZWxscyIsInBsYXllckJvYXJkIiwicGxheWVyIiwicGxheWVyQm9hcmREaXYiLCJnZXRQbGF5ZXJCb2FyZCIsInBsYXllckJvYXJkQ2VsbHMiLCJnZXRQbGF5ZXJCb2FyZENlbGxzIiwiY3VycmVudFBsYXllciIsInN0YXJ0IiwicG9wdWxhdGVHYW1lYm9hcmQiLCJwbGFjZVNoaXBzIiwibGlzdGVuQm9hcmQiLCJjZWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsInBsYXllclR1cm4iLCJnYW1lT3ZlciIsInJlc2V0IiwicG9zaXRpb24iLCJnZXRDZWxsUG9zaXRpb24iLCJhdHRhY2tlZFBvc2l0aW9uIiwicmVjZWl2ZUF0dGFjayIsImF0dGFjayIsInN3aXRjaFBsYXllciIsImNvbXB1dGVyVHVybiIsImdldENvbXB1dGVyTW92ZSIsImFsbFNoaXBzU3VuayIsImNyZWF0ZUJvYXJkIiwiZ2FtZWJvYXJkIiwicGxhY2VTaGlwIiwibW9kdWxlIiwiZXhwb3J0cyIsInBCb2FyZERpdiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNCb2FyZERpdiIsImNCb2FyZENlbGxzIiwicXVlcnlTZWxlY3RvckFsbCIsImNvbnNvbGUiLCJsb2ciLCJjZWxsRGl2IiwiY29sIiwicm93IiwiY2hpbGROb2RlcyIsImJvYXJkIiwicmVzZXRCb2FyZCIsImNyZWF0ZVJvdyIsImFwcGVuZENoaWxkIiwibGFzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiY3JlYXRlQ29sdW1ucyIsImdldENlbGwiLCJjZWxsUG9zIiwiYm9hcmREaXYiLCJnZXRCb2FyZCIsImdldFNoaXAiLCJyZW1vdmUiLCJzaGlwIiwiYXZhaWxhYmxlUG9zaXRpb24iLCJyZXN1bHQiLCJpc0FTaGlwIiwiaGl0IiwiaW5jbHVkZXMiLCJhbnlNb3ZlV2FzTWFkZSIsImlzQVNoaXBOZWFyIiwiZW5kIiwibGVuZ3RoIiwiY2hlY2tQb3NpdGlvbiIsImlzT3V0c2lkZUJvcmRlciIsIkFycmF5IiwibWFwIiwibyIsImkiLCJyb2JvdCIsInJhbmRvbU1vdmUiLCJyYW5kb21OdW1iZXIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpc0FDb21wdXRlciIsInNpemUiLCJzdXJmYWNlIiwiaXNTdW5rIiwiZ2V0U3VyZmFjZSIsInNldFN1cmZhY2UiLCJmaWxsIl0sInNvdXJjZVJvb3QiOiIifQ==