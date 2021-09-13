'use strict'

function setupBoard() {
  function createCell() {
    const cell = document.createElement('li')
    cell.classList.add('cell')
    return cell
  }

  function createDummyLi() {
    const dummy = document.createElement('li')
    dummy.classList.add('hidden')
    return dummy
  }

  function getCellAdderForBoardSize(size) {
    if (size % 2 === 0) {
      // include a dummy li on line ends for CSS purposes (not pretty)
      return (cell, i) => {
        if (i % size === 0) {
          board.appendChild(createDummyLi())
        }
        board.appendChild(cell)
      }
    }
    return (cell) => board.appendChild(cell)
  }

  const board = document.getElementById('board')
  function resetBoard(size = 3) {
    board.innerHTML = ''
    board.classList.add('fade-in')
    board.classList.remove('hidden')
    board.classList.remove('spin')
    board.classList.remove('tilt')
    board.style.setProperty('--size', size)

    const cells = Array.from({ length: size * size }, createCell)
    let cellAdder = getCellAdderForBoardSize(size)
    cells.forEach(cellAdder)
    return cells
  }

  return { board, resetBoard }
}
