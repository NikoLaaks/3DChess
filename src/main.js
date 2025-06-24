import { initAIGame } from './modes/aiGame.js';
import { initLocalMultiplayer } from './modes/localMultiplayer.js';
import { initLandingAnimation, resumeLandingAnimation } from './landingAnimation.js';
import { toggleSetting } from './game/settings.js';

initLandingAnimation();


let currentMode = null;
let difficultySelect = document.getElementById('difficulty');

// Handle "Play Local Multiplayer" button
document.getElementById('btnLocalMultiplayer').addEventListener('click', () => {
  currentMode = 'local';
  switchToView('game');
  document.getElementById('gameHeader').style.display = 'flex'; // Show top bar
  initLocalMultiplayer();
});

// Handle "play against AI as white" button
document.getElementById('btnAIisBlack').addEventListener('click', () => {
  currentMode = 'AI';
  const selectedDifficulty = parseInt(difficultySelect.value);
  switchToView('game');
  document.getElementById('gameHeader').style.display = 'flex';
  initAIGame("white", selectedDifficulty);
});

// Handle "play against AI as black" button
document.getElementById('btnAIisWhite').addEventListener('click', () => {
  currentMode = 'AI';
  const selectedDifficulty = parseInt(difficultySelect.value);
  switchToView('game');
  document.getElementById('gameHeader').style.display = 'flex';
  initAIGame("black", selectedDifficulty);
});

// Handle "Restart" button on header
document.getElementById('btnRestart').addEventListener('click', () => {
  if (currentMode === 'local') {
    initLocalMultiplayer(); // Restart the current game mode
  }
});

// Handle "Back to Menu" button on header
document.getElementById('btnBackToMenu').addEventListener('click', () => {
  currentMode = null;
  switchToView('landingPage');
  document.getElementById('gameHeader').style.display = 'none'; // Hide top bar
  resumeLandingAnimation(); // Resume the landing page animation
});

document.getElementById('toggleValidMoves').addEventListener('click', () => {
  toggleSetting('showValidMoves');
});

// Restart button in game over modal
document.getElementById('btnRestartGame').addEventListener('click', () => {
  if (currentMode === 'local') {
    initLocalMultiplayer();
    document.getElementById('gameOverOverlay').style.display = 'none' // Hide modal
  }
});

// Back to menu button in game over modal
document.getElementById('btnReturnToMenu').addEventListener('click', () => {
  currentMode = null;
  switchToView('landingPage');
  document.getElementById('gameHeader').style.display = 'none'; // Hide top bar
  document.getElementById('gameOverOverlay').style.display = 'none' // Hide modal
  resumeLandingAnimation(); // Resume the landing page animation
});


// Switch visible view
function switchToView(view) {
  document.querySelectorAll('.view').forEach(el => el.style.display = 'none');
  document.getElementById(view).style.display = 'block';
}