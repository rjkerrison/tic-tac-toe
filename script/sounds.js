'use strict'

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
