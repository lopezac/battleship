const Ship = (size) => {
  let surface;

  const hit = (position) => {
    surface[position] = "x";
  };

  const isSunk = () => {
    for (const cell of getSurface()) {
      if (cell === "") return false;
    }
    return true;
  };

  const setSurface = (size) => {
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
  };
};

module.exports = Ship;
