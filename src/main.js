import { initLocalMultiplayer } from './modes/localMultiplayer.js';

document.getElementById('btnLocalMultiplayer').addEventListener('click', () => {
  switchToView('game');
  initLocalMultiplayer();
});

function switchToView(view) {
  document.querySelectorAll('.view').forEach(el => el.style.display = 'none');
  document.getElementById(view).style.display = 'block';
}