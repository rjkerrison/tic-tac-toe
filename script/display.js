'use strict'

const {
  display,
  reappearButton,
  hideButton,
  shrinkHeading,
  playButton
} = (function () {
  const playButton = document.getElementById('play')

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

  const h1 = document.querySelector('h1')
  function shrinkHeading() {
    h1.classList.remove('large')
  }

  return {
    display,
    reappearButton,
    hideButton,
    shrinkHeading,
    playButton
  }
})()