'use strict'

function setupGame(options) {
  const { board, resetBoard, ...otherOptions } = options
  if (!board) {
    throw new Error('Game setup must include a board element.')
  }

  const game = {
    board,
    resetBoard,
    sounds: setupSounds(),
    size: 3,
    winLength: 3,
    teams: ['X', 'O'],
    // We can override any of the above options
    ...otherOptions,
    isActive: false,
    start() {
      this.winCombos = getWinCombos(this.size, this.winLength)
      this.currentTeam = this.teams[0],
        this.cells = this.resetBoard(this.size)
      shrinkHeading()
      hideButton()
      display('')
      this.sounds.start()
      this.isActive = true
    },
    isWin() {
      const winningCombo = this.winCombos.find((combo) =>
        combo.every((i) => {
          try {
            return (this.cells[i].getAttribute('team') === this.currentTeam)
          } catch (e) {
            console.log('errored with', combo, i)
            throw e
          }
        })
      )
      return winningCombo
    },
    isDraw() {
      return this.cells.every((cell) => cell.getAttribute('team'))
    },
    move(cell) {
      assign(cell, this.currentTeam)

      const winningCombo = this.isWin()
      if (winningCombo) {
        this.win(winningCombo)
      }
      else if (this.isDraw()) {
        this.draw()
      }
      else {
        this.advanceTeam()
      }
    },
    win(winningCombo) {
      setTimeout(
        () =>
          winningCombo.forEach((cellIndex) => {
            this.cells[cellIndex].classList.add('font-grow')
          })
        , 500)
      display(`${this.currentTeam} wins!`)
      this.isActive = false
      reappearButton()
      this.board.classList.add('spin')
      this.sounds.end()
    },
    draw() {
      display('Game drawn!')
      this.isActive = false
      reappearButton()
      this.board.classList.add('tilt')
      this.sounds.end()
    },
    advanceTeam() {
      const currentIndex = this.teams.indexOf(this.currentTeam)
      const nextIndex = (currentIndex + 1) % this.teams.length
      this.currentTeam = this.teams[nextIndex]
      this.sounds.score(currentIndex)
      display(`${this.currentTeam}'s turn!`, false)
    }
  }

  return game
}

function assign(cell, team) {
  cell.setAttribute('team', team)
  cell.textContent = team[0] // just one character per box
}