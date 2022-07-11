const Ship = require("../modules/ship.js");

// Hit method
describe("hit works with a ship of size 1", () => {
  const ship = Ship(1);

  test("hit works at position 0", () => {
    ship.hit(0);
    expect(ship.getSurface()).toEqual(["x"]);
  });
});

describe("hit works with a ship of size 4", () => {
  test("hit works at position 0", () => {
    const ship = Ship(4);
    ship.hit(0);
    expect(ship.getSurface()).toEqual(["x", "", "", ""]);
  });

  test("hit works at position 1", () => {
    const ship = Ship(4);
    ship.hit(1);
    expect(ship.getSurface()).toEqual(["", "x", "", ""]);
  });

  test("hit works at position 2", () => {
    const ship = Ship(4);
    ship.hit(2);
    expect(ship.getSurface()).toEqual(["", "", "x", ""]);
  });

  test("hit works at position 3", () => {
    const ship = Ship(4);
    ship.hit(3);
    expect(ship.getSurface()).toEqual(["", "", "", "x"]);
  });
});

// isSunk method
describe("isSunk works with a ship of size 1", () => {
  const ship = Ship(1);

  test("isSunk return true if hitted at position 0", () => {
    ship.hit(0);
    expect(ship.isSunk()).toBe(true);
  });
});

describe("isSunk works with a ship of size 4", () => {
  test("isSunk return false if hitted at position 0", () => {
    const ship = Ship(4);
    ship.hit(0);
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk return false if hitted at position 0 and 1", () => {
    const ship = Ship(4);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk return false if hitted at position 0, 1 and 2", () => {
    const ship = Ship(4);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk return false if hitted at position 0, 1, 2 and 3", () => {
    const ship = Ship(4);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    ship.hit(3);
    expect(ship.isSunk()).toBe(true);
  });
});
