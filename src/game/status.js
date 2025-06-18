export function checkGameStatus(chess) {
  let resultText;
  if (chess.isGameOver()) {
    if (chess.isCheckmate()){
      const winner = chess.turn() === 'w' ? 'Black' : 'White';
      resultText = `Checkmate! ${winner} wins`;
    } else if (chess.isStalemate()) {
      resultText = "Draw by stalemate";
    } else if (chess.isThreefoldRepetion()) {
      resultText = "Draw by threefold repetition";
    } else if (chess.isInufficientMaterial()) {
      resultText = "Draw by insufficient material";
    } else if (chess.isDraw()) {
      resultText = "Draw"
    } else {
      resultText = "Game over, unknown reason"
    }
    const overlay = document.getElementById('gameOverOverlay');
    const message = document.getElementById('gameOverMessage');
    message.textContent = resultText;
    overlay.style.display = 'flex';
    
  } else if (chess.inCheck()) {
    console.log("Check!");
  }
}
