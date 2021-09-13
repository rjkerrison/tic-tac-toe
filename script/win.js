'use strict'

const getWinCombos = (function () {
  function* getAdjacents(size, length) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - (length - 1); j++) {
        // horizontal
        yield Array.from({ length }, (_, idx) => j + (i * size) + idx)
        // vertical
        yield Array.from({ length }, (_, idx) => i + (j + idx) * size)
      }
    }
  }

  const getNwseDiagonal = (size, length, i, j) => {
    const start = i + (j * size)
    return Array.from({ length }, (_, idx) => start + idx * (size + 1))
  }

  const getNeswDiagonal = (size, length, i, j) => {
    const start = (size - i) + (j * size) - 1
    return Array.from({ length }, (_, idx) => start + idx * (size - 1))
  }

  function* getDiagonals(size, length) {
    for (let i = 0; i < size - (length - 1); i++) {
      for (let j = 0; j < size - (length - 1); j++) {
        yield getNwseDiagonal(size, length, i, j)
        yield getNeswDiagonal(size, length, i, j)
      }
    }
  }

  // We could hardcode this for 3 of them
  // const winCombos = [
  //   [0, 1, 2], [3, 4, 5], [6, 7, 8],
  //   [0, 3, 6], [1, 4, 7], [4, 5, 8],
  //   [0, 4, 8], [2, 4, 6]
  // ]
  function getWinCombos(boardSize, comboLength) {
    return [
      ...getAdjacents(boardSize, comboLength),
      ...getDiagonals(boardSize, comboLength),
    ]
  }

  return getWinCombos
})()
