import { getModelForPiece, yOffsets } from "./pieces.js";
import { worldToChess, chessToWorld } from "./utils.js";
import * as THREE from "three";

/**
 * Get the chess square from a 3D piece object.
 */
export function getPieceSquareFromWorldCoordinates(piece) {
  const piecePosition = piece.position;
  return worldToChess(piecePosition.x, piecePosition.z);
}

/**
 * Move a piece on the board.
 */
export function movePiece(from, to, scene, pieces, chess, gameState, onMoveComplete) {
  const move = chess.move({ from, to , promotion: "q"});
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

  // Handle en passant capture
  if (move.flags.includes("e")) {
    const capturedSquare = move.to[0] + (move.color === "w"
      ? (parseInt(move.to[1]) - 1)
      : (parseInt(move.to[1]) + 1));
    const capturedPiece = pieces[capturedSquare];
    if (capturedPiece) {
      scene.remove(capturedPiece);
      delete pieces[capturedSquare];
    }
  }


  // Handle normal capture
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

  // Handle castling
  if (move.flags.includes("k")) {
    // Kingside castling
    const rookFrom = "h" + (move.color === "w" ? "1" : "8");
    const rookTo = "f" + (move.color === "w" ? "1" : "8");
    const rook = pieces[rookFrom];
    if (rook) {
      const { x, z } = chessToWorld(rookTo);
      rook.position.set(x, rook.position.y, z);
      pieces[rookTo] = rook;
      delete pieces[rookFrom];
    }
  } else if (move.flags.includes("q")) {
    // Queenside castling
    const rookFrom = "a" + (move.color === "w" ? "1" : "8");
    const rookTo = "d" + (move.color === "w" ? "1" : "8");
    const rook = pieces[rookFrom];
    if (rook) {
      const { x, z } = chessToWorld(rookTo);
      rook.position.set(x, rook.position.y, z);
      pieces[rookTo] = rook;
      delete pieces[rookFrom];
    }
  }

  // If promoted, change pawn to queen visually
  if (move.flags.includes("p")) {
    console.log("Promotion detected: ", move.promotion);
    scene.remove(movingPiece);
    delete pieces[to];
    const newQueen = getModelForPiece(move.color === "w" ? "white" : "black", "q");
    if (newQueen) {
      newQueen.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: move.color === "w" ? 0xffffff : 0x454545,
            side: THREE.DoubleSide,
          });

          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
          child.raycast = THREE.Mesh.prototype.raycast;
        }
      });
      const { x, z } = chessToWorld(to);
      const yOffset = yOffsets["q"];
      newQueen.position.set(x, yOffset, z);
      newQueen.name = `piece_${colorName}_q_${to}`;
      newQueen.scale.set(15, 15, 15);
      scene.add(newQueen);
      pieces[to] = newQueen;
    }

  }

  // Switch player
  gameState.currentPlayer = gameState.currentPlayer === "white" ? "black" : "white";

  //Reset selected piece and elevation
  if (gameState.previousSelectedObject) {
    const parts = gameState.previousSelectedObject.name.split("_");
    const type = parts[2]; // piece_{color}_{type}_{square}
    gameState.previousSelectedObject.position.y = yOffsets[type] ?? 0; // Reset to original height
    gameState.previousSelectedObject = null; // Clear the previous selected object
  }

  gameState.selectedPiece = null;
  gameState.fromSquare = null;

  console.log("Current player:", gameState.currentPlayer);
  console.log("Pieces mapping:", pieces);
  console.log("Chess board state:", chess.ascii());
  console.log("FEN:", chess.fen());
  console.log("PGN:", chess.pgn());
  console.log(gameState.AIGame)

  if (gameState.AIGame === true && typeof onMoveComplete === "function") {
    onMoveComplete();
  }
};
