'use strict';

(function () {
  function isEmptyCell(cell) {
    return cell.classList.contains('cell') && !cell.getAttribute('team')
  }

  const { board, resetBoard } = setupBoard()

  const game = setupGame({
    teams: ['Robin', 'Joan', 'Emile'],
    size: 5,
    resetBoard,
    board
  })

  const handleClick = (event) => {
    if (!game.isActive) {
      return
    }

    const cell = event.target
    if (!isEmptyCell(cell)) {
      return
    }

    game.move(cell)
  }

  setupCustomisation(game)

  board.addEventListener('click', handleClick)
  play.addEventListener('click', () => game.start())
})()
