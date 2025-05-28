import { initLocalMultiplayer } from './modes/localMultiplayer.js';

let currentMode = null;

// Handle "Play Local Multiplayer" button
document.getElementById('btnLocalMultiplayer').addEventListener('click', () => {
  currentMode = 'local';
  switchToView('game');
  document.getElementById('gameHeader').style.display = 'flex'; // Show top bar
  initLocalMultiplayer();
});

// Handle "Restart" button
document.getElementById('btnRestart').addEventListener('click', () => {
  if (currentMode === 'local') {
    initLocalMultiplayer(); // Restart the current game mode
  }
});

// Handle "Back to Menu" button
document.getElementById('btnBackToMenu').addEventListener('click', () => {
  currentMode = null;
  switchToView('landingPage');
  document.getElementById('gameHeader').style.display = 'none'; // Hide top bar
});

// Switch visible view
function switchToView(view) {
  document.querySelectorAll('.view').forEach(el => el.style.display = 'none');
  document.getElementById(view).style.display = 'block';
}