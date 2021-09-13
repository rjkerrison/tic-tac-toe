'use strict'

const board = document.getElementById('board')
board.addEventListener('click', handleClick)

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

function resetBoard(size = 3) {
  board.innerHTML = ''
  board.classList.add('fade-in')
  board.classList.remove('hidden')
  board.classList.remove('spin')
  board.classList.remove('bend')
  board.style.setProperty('--size', size)

  const cells = Array.from({ length: size * size }, createCell)
  let cellAdder = getCellAdderForBoardSize(size)
  cells.forEach(cellAdder)
  return cells
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

function handleClick() {
  if (!game.isActive) {
    return
  }

  const cell = event.target
  if (!isEmptyCell(cell)) {
    return
  }

  game.move(cell)
}

function reappearButton() {
  playButton.classList.add('fade-in')
  playButton.classList.remove('hidden')
  setTimeout(() => {
    playButton.classList.remove('fade-in')
  }, 1000)
}

function hideButton() {
  playButton.classList.add('fade-out')
  setTimeout(() => {
    playButton.classList.remove('fade-out')
    playButton.classList.add('hidden')
  }, 1000)
}

const displayElement = document.getElementById('display')
function display(text, isFlash = true) {
  displayElement.textContent = text
  if (isFlash) {
    displayElement.classList.add('flash')
    setTimeout(() => displayElement.classList.remove('flash'), 1000)
  }
}

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

function getWinCombos(boardSize, comboLength) {
  return [
    ...getAdjacents(boardSize, comboLength),
    ...getDiagonals(boardSize, comboLength),
  ]
}

// We could hardcode this for 3 of them
// const winCombos = [
//   [0, 1, 2], [3, 4, 5], [6, 7, 8],
//   [0, 3, 6], [1, 4, 7], [4, 5, 8],
//   [0, 4, 8], [2, 4, 6]
// ]

function isEmptyCell(cell) {
  return cell.classList.contains('cell') && !cell.getAttribute('team')
}

function assign(cell, team) {
  cell.setAttribute('team', team)
  cell.textContent = team[0] // just one character per box
}

function shrinkHeading() {
  document.querySelector('h1').classList.remove('large')
}

function setupGame(options) {
  const game = {
    sounds: setupSounds(),
    size: 3,
    winLength: 3,
    teams: ['X', 'O'],
    // We can override any of the above options
    ...options,
    isActive: false,
    start() {
      this.winCombos = getWinCombos(this.size, this.winLength)
      this.currentTeam = this.teams[0],
        this.cells = resetBoard(this.size)
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
      board.classList.add('spin')
      this.sounds.end()
    },
    draw() {
      display('Game drawn!')
      this.isActive = false
      reappearButton()
      board.classList.add('bend')
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

function setupSounds() {
  // Sounds
  const loopSound = document.getElementById('loop-sound')
  const endGameSound = document.getElementById('end-game-sound')
  const scoreSounds = [
    document.getElementById('score-1-sound'),
    document.getElementById('score-2-sound'),
  ]
  const muteButton = document.getElementById('mute')
  let isMuted = false
  loopSound.volume = 0.2

  muteButton.addEventListener('click', () => {
    isMuted = !isMuted
    if (isMuted) {
      loopSound.pause()
      endGameSound.pause()
    } else {
      if (game.isActive) {
        loopSound.play()
      }
    }
    muteButton.textContent = isMuted ? 'Sounds' : 'Mute'
    console.log('muted', isMuted)
  })

  return {
    score: (teamIndex) => {
      if (!isMuted) {
        const index = teamIndex % scoreSounds.length
        // start it from the beginning in case it's still playing
        scoreSounds[index].currentTime = 0
        scoreSounds[index].play()
      }
    },
    end: () => {
      loopSound.pause()
      !isMuted && endGameSound.play()
    },
    start: () => !isMuted && loopSound.play()
  }
}

const game = setupGame({
  teams: ['Robin', 'Mike', 'Emile'],
  size: 5
})

// Customisation
const customiseButton = document.getElementById('customise')
const addTeamButton = document.getElementById('add-team')
const teamList = document.querySelector('fieldset#teams .team-list')
const boardSettings = document.querySelector('fieldset#board-settings')

teamList.addEventListener('change', ({ target }) => updateTeams(target))
boardSettings.addEventListener('change', ({ target }) => updateSettings(target))
document.querySelector('form').addEventListener('click', (event) => {
  event.preventDefault()

  if (event.target.tagName !== 'BUTTON') {
    return
  }

  console.log('form button click!', event.target)

  if (event.target === addTeamButton) {
    addTeam()
  }
  else if (event.target.classList.contains('delete')) {
    console.log('DELETE DELETE DELETE')
    const index = event.target.getAttribute('team-index')
    removeTeam(parseInt(index))
    showTeamInputs()
  }
})

async function addTeam() {
  const name = await getName()
  const newInput = addTeamInputs(name, game.teams.length)
  updateTeams(newInput)
}

async function getName() {
  const a = await Promise.race([
    fetch('https://randomuser.me/api/')
      .then(res => res.json())
      .then(data => data.results[0].name.first),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Bob');
      }, 500);
    })
  ])
  console.log(a)
  return a
}

function removeTeam(teamIndex) {
  game.teams.splice(teamIndex, 1)
}

function updateTeams(input) {
  const teamIndexAttribute = input.getAttribute('team-index')
  const teamIndex = parseInt(teamIndexAttribute)

  game.teams[teamIndex] = input.value
}

function tryGetInputInt({ name, value }) {
  const intValue = parseInt(value)
  if (isNaN(intValue)) {
    alert(`How did you make the ${name} input have a non int value like ${input.value}? Try again!`)
    return false
  }
  return intValue
}

function updateSettings(input) {
  switch (input.name) {
    case 'win':
      const nguyen = tryGetInputInt(input)
      if (nguyen) {
        game.winLength = nguyen
      }
      return
    case 'size':
      const newSize = tryGetInputInt(input)
      if (newSize) {
        game.size = newSize
      }
      return
  }
}

customiseButton.addEventListener('click', function () {
  document.querySelector('main').classList.toggle('hidden')
  document.querySelector('aside').classList.toggle('hidden')

  showTeamInputs()
})

function showTeamInputs() {
  teamList.querySelectorAll('div').forEach(el => el.remove())
  game.teams.map(addTeamInputs)
}

function addTeamInputs(team, i) {
  const input = document.createElement('input')
  const button = document.createElement('button')
  const div = document.createElement('div')
  input.value = team
  input.setAttribute('team-index', i)
  input.name = 'team' + i
  input.id = 'team' + i
  button.classList.add('delete')
  button.setAttribute('team-index', i)
  button.textContent = 'X'
  div.appendChild(input)
  div.appendChild(button)
  teamList.appendChild(div)
  return input
}

const playButton = document.getElementById('play')
play.addEventListener('click', () => game.start())
