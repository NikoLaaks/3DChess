export function checkGameStatus(chess) {
  if (chess.isGameOver()) {
    console.log("Game over");
    // Implement game over logic here (e.g., show message, reset game, etc.)
  } else if (chess.inCheck()) {
    console.log("Check!");
  }
}
