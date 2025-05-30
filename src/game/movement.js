import { worldToChess, chessToWorld } from "./utils.js";

/**
 * Get the chess square from a 3D piece object.
 */
export function getPieceSquareFromWorldCoordinates(piece) {
  const piecePosition = piece.position;
  return worldToChess(piecePosition.x, piecePosition.z);
}

/**
 * Move a piece on the board.
 * 
 * @param {string} from - Square to move from (e.g. "e2")
 * @param {string} to - Square to move to (e.g. "e4")
 * @param {THREE.Scene} scene - The THREE.js scene
 * @param {object} pieces - Object mapping squares to piece meshes
 * @param {Chess} chess - Instance of chess.js
 * @param {object} gameState - Object containing currentPlayer, selectedPiece, fromSquare
 */
export function movePiece(from, to, scene, pieces, chess, gameState) {
  const move = chess.move({ from, to });
  if (move === null) {
    console.log("Invalid move");
    gameState.selectedPiece = null;
    gameState.fromSquare = null;
    return;
  }

  console.log("Move made in chess.js:", move);

  const movingPiece = pieces[from];
  if (!movingPiece) {
    console.warn("No piece at", from);
    return;
  }

  // Handle capture
  if (move.captured && pieces[to]) {
    scene.remove(pieces[to]);
    delete pieces[to];
  }

  // Move the 3D object
  const { x, z } = chessToWorld(to);
  movingPiece.position.set(x, movingPiece.position.y, z);

  // Update mapping
  delete pieces[from];
  pieces[to] = movingPiece;

  // Update piece name
  const colorName = move.color === "w" ? "white" : "black";
  movingPiece.name = `piece_${colorName}_${move.piece}_${to}`;

  // Switch player
  gameState.currentPlayer = gameState.currentPlayer === "white" ? "black" : "white";
  gameState.selectedPiece = null;
  gameState.fromSquare = null;

  console.log("Current player:", gameState.currentPlayer);
  console.log("Pieces mapping:", pieces);
  console.log("Chess board state:", chess.ascii());
  console.log("FEN:", chess.fen());
  console.log("PGN:", chess.pgn());
}
