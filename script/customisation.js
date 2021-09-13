'use strict'

function setupCustomisation(game) {
  // Customisation
  const customiseButton = document.getElementById('customise')
  const addTeamButton = document.getElementById('add-team')
  const teamList = document.querySelector('fieldset#teams .team-list')
  const boardSettings = document.querySelector('fieldset#board-settings')
  const customisationForm = document.querySelector('form')

  teamList.addEventListener('change', ({ target }) => updateTeams(target))
  boardSettings.addEventListener('change', ({ target }) => updateSettings(target))
  customisationForm.addEventListener('click', (event) => {
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
}