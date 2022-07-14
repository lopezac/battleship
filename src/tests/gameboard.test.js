const Gameboard = require("../modules/gameboard.js");
const Ship = require("../modules/ship.js");

describe("placeShip works", () => {
  const ship1 = Ship(1);
  const ship2 = Ship(2);
  const ship3 = Ship(3);
  const ship4 = Ship(4);

  test("places a ship of size 1 horizontal", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship1, [[0, 0]]);
    expect(gameboard.getShip([0, 0])).toEqual(ship1);
  });

  test("places a ship of size 4 horizontal", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship4, [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ]);
    expect(gameboard.getShip([4, 0]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([4, 1]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([4, 2]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([4, 3]).getSurface().length).toEqual(4);
  });

  test("places a ship of size 4 vertical", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship4, [
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
    ]);
    expect(gameboard.getShip([4, 2]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([5, 2]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([6, 2]).getSurface().length).toEqual(4);
    expect(gameboard.getShip([7, 2])).toEqual(ship4);
  });

  test("doesn't place a ship when space is occupied horizontal", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship2, [
      [3, 2],
      [3, 3],
    ]);
    gameboard.placeShip(ship4, [
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ]);
    expect(gameboard.getShip([3, 2])).toEqual(ship2);
    expect(gameboard.getShip([3, 3])).toEqual(ship2);
    expect(gameboard.getShip([3, 4])).toEqual("");
    expect(gameboard.getShip([3, 5])).toEqual("");
    expect(gameboard.getShip([3, 6])).toEqual("");
  });

  test("doesn't place ships size 1 near another ship size 2", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship2, [
      [5, 5],
      [5, 6],
    ]);
    gameboard.placeShip(ship1, [[5, 4]]);
    gameboard.placeShip(ship1, [[5, 7]]);

    expect(gameboard.getShip([5, 5])).toEqual(ship2);
    expect(gameboard.getShip([5, 6])).toEqual(ship2);

    expect(gameboard.getShip([5, 4])).toEqual("");
    expect(gameboard.getShip([5, 7])).toEqual("");
  });

  test("doesn't place ships near another ship", () => {
    const gameboard = Gameboard(Ship);
    let ship22 = Ship(2);

    gameboard.placeShip(ship22, [
      [5, 5],
      [5, 6],
    ]);
    gameboard.placeShip(ship3, [
      [4, 4],
      [4, 5],
      [4, 6],
    ]);

    expect(gameboard.getShip([5, 5]).getSurface().length).toEqual(2);
    expect(gameboard.getShip([5, 6]).getSurface().length).toEqual(2);

    expect(gameboard.getShip([4, 4])).toEqual("");
    expect(gameboard.getShip([4, 5])).toEqual("");
    expect(gameboard.getShip([4, 6])).toEqual("");

    gameboard.placeShip(ship4, [
      [6, 4],
      [6, 5],
      [6, 6],
      [6, 7],
    ]);
    expect(gameboard.getShip([6, 4])).toEqual("");
    expect(gameboard.getShip([6, 5])).toEqual("");
    expect(gameboard.getShip([6, 6])).toEqual("");
    expect(gameboard.getShip([6, 7])).toEqual("");
  });

  test("doesn't place ships near another ship near borders", () => {
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship1, [[0, 0]]);
    gameboard.placeShip(ship1, [[0, 1]]);
    gameboard.placeShip(ship1, [[1, 1]]);
    gameboard.placeShip(ship4, [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ]);

    expect(gameboard.getShip([0, 0])).toEqual(ship1);
    expect(gameboard.getShip([0, 1])).toEqual("");
    expect(gameboard.getShip([1, 1])).toEqual("");
    expect(gameboard.getShip([1, 0])).toEqual("");
    expect(gameboard.getShip([1, 1])).toEqual("");
    expect(gameboard.getShip([1, 1])).toEqual("");
    expect(gameboard.getShip([1, 1])).toEqual("");
  });
});

describe("receiveAttack works", () => {
  test("ship size 1 receives attack", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(1);
    gameboard.placeShip(ship1, [
      [0, 0],
      [0, 0],
    ]);
    gameboard.receiveAttack([0, 0]);

    expect(gameboard.getShip([0, 0])).toEqual("h");
    expect(ship1.getSurface()).toEqual(["x"]);
  });

  test("ship size 2 receives attack", () => {
    const ship2 = Ship(2);
    const gameboard = Gameboard(Ship);
    gameboard.placeShip(ship2, [
      [0, 0],
      [0, 1],
    ]);
    gameboard.receiveAttack([0, 0]);

    expect(gameboard.getShip([0, 0])).toEqual("h");
    expect(gameboard.getShip([0, 1])).toEqual(ship2);
    expect(gameboard.getShip([0, 1]).getSurface()).toEqual(["x", ""]);
  });

  test("ship size 2 receives attack vertical", () => {
    const gameboard = Gameboard(Ship);
    const ship2 = Ship(2);
    gameboard.placeShip(ship2, [
      [0, 0],
      [1, 0],
    ]);
    gameboard.receiveAttack([0, 0]);

    expect(gameboard.getShip([0, 0])).toEqual("h");
    expect(gameboard.getShip([1, 0])).toEqual(ship2);
    expect(gameboard.getShip([1, 0]).getSurface()).toEqual(["x", ""]);
  });

  test("ship size 4 receives a attack", () => {
    const gameboard = Gameboard(Ship);
    const ship4 = Ship(4);
    gameboard.placeShip(ship4, [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
    gameboard.receiveAttack([1, 0]);

    expect(gameboard.getShip([0, 0])).toEqual(ship4);
    expect(gameboard.getShip([1, 0])).toEqual("h");
    expect(gameboard.getShip([2, 0])).toEqual(ship4);
    expect(gameboard.getShip([3, 0])).toEqual(ship4);

    expect(gameboard.getShip([0, 0]).getSurface()).toEqual(["x", "", "", ""]);
    expect(gameboard.getShip([2, 0]).getSurface()).toEqual(["x", "", "", ""]);
    expect(gameboard.getShip([3, 0]).getSurface()).toEqual(["x", "", "", ""]);
  });

  test("ship size 4 receives 2 attacks", () => {
    const gameboard = Gameboard(Ship);
    const ship4 = Ship(4);
    gameboard.placeShip(ship4, [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([3, 0]);

    expect(gameboard.getShip([0, 0])).toEqual(ship4);
    expect(gameboard.getShip([1, 0])).toEqual("h");
    expect(gameboard.getShip([2, 0])).toEqual(ship4);
    expect(gameboard.getShip([3, 0])).toEqual("h");

    expect(gameboard.getShip([0, 0]).getSurface()).toEqual(["x", "x", "", ""]);
    expect(gameboard.getShip([2, 0]).getSurface()).toEqual(["x", "x", "", ""]);
  });

  test("ship size 3 receives 3 attacks", () => {
    const gameboard = Gameboard(Ship);
    const ship3 = Ship(3);
    gameboard.placeShip(ship3, [
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([2, 0]);

    expect(gameboard.getShip([0, 0])).toEqual("h");
    expect(gameboard.getShip([1, 0])).toEqual("h");
    expect(gameboard.getShip([2, 0])).toEqual("h");
  });

  test("hit empty position works", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(1);
    gameboard.placeShip(ship1, [[6, 0]]);

    gameboard.receiveAttack([7, 0]);
    gameboard.receiveAttack([6, 1]);
    gameboard.receiveAttack([5, 0]);

    expect(gameboard.getShip([6, 0])).toEqual(ship1);
    expect(gameboard.getShip([6, 0]).getSurface()).toEqual([""]);
    expect(gameboard.getShip([7, 0])).toEqual("m");
    expect(gameboard.getShip([6, 1])).toEqual("m");
    expect(gameboard.getShip([5, 0])).toEqual("m");
  });
});

describe("allShipsSunk works", () => {
  test.only("returns true if gameboard is empty", () => {
    const gameboard = Gameboard(Ship);

    expect(gameboard.allShipsSunk()).toEqual(true);
  });

  test.only("returns false if there is a ship", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(1);
    gameboard.placeShip(ship1, [[6, 5]]);

    expect(gameboard.allShipsSunk()).toEqual(false);
  });

  test.only("returns false if there is a hitted ship", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(2);
    gameboard.placeShip(ship1, [
      [6, 5],
      [7, 5],
    ]);
    gameboard.receiveAttack([7, 5]);

    expect(gameboard.allShipsSunk()).toEqual(false);
  });

  test.only("return false if there is a hitted ship and missed hits", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(2);
    gameboard.placeShip(ship1, [
      [6, 5],
      [7, 5],
    ]);
    gameboard.receiveAttack([7, 5]);
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([2, 5]);
    gameboard.receiveAttack([8, 2]);

    expect(gameboard.allShipsSunk()).toEqual(false);
  });

  test.only("return true if there is only a sunk ship", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(2);
    gameboard.placeShip(ship1, [
      [6, 5],
      [7, 5],
    ]);
    gameboard.receiveAttack([7, 5]);
    gameboard.receiveAttack([6, 5]);

    expect(gameboard.allShipsSunk()).toEqual(true);
  });

  test.only("return true if there is a sunk ship and missed hits", () => {
    const gameboard = Gameboard(Ship);
    const ship1 = Ship(2);
    gameboard.placeShip(ship1, [
      [6, 5],
      [7, 5],
    ]);
    gameboard.receiveAttack([7, 5]);
    gameboard.receiveAttack([6, 5]);
    gameboard.receiveAttack([2, 5]);
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([0, 1]);

    expect(gameboard.allShipsSunk()).toEqual(true);
  });
});
