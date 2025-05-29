// Convert world coordinates to chessboard coordinates
export function worldToChess(x, z) {
  const file = String.fromCharCode(97 + Math.round(x + 3.5)); // 'a' + index
  const rank = (Math.round(-z + 3.5) + 1).toString(); // Flip z-axis for ranks
  return file + rank; // Example: "e4"
}
// Convert chessboard coordinates to world coordinates
export function chessToWorld(square) {
  const file = square.charCodeAt(0) - 97; // Convert 'a' to 0, 'b' to 1, ...
  const rank = parseInt(square[1]) - 1;
  return {
    x: file - 3.5,
    z: -(rank - 3.5),
  };
}


