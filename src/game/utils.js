import * as THREE from "three";
import { gameSettings } from "./settings.js";
import { yOffsets } from "./pieces.js";

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

export function highlightValidMoves(validMoves, scene, gameState) {
  /*
  * If highlighting is enabled, highlight valid moves for the selected piece.
  */
  if (gameSettings.highlightSelectedPiece && gameState.selectedPiece) {
    // Find the selected piece in the scene
    const selectedObject = scene.getObjectByName(gameState.selectedPiece);

    if (selectedObject) {
      
        // Lower previously selected piece
      if (gameState.previousSelectedObject && gameState.previousSelectedObject !== gameState.selectedObject) {
        const prevNameParts = gameState.previousSelectedObject.name.split("_");
        const prevType = prevNameParts[2]; // piece_{color}_{type}_{square}
        gameState.previousSelectedObject.position.y = yOffsets[prevType] ?? 0; // Reset to original height
      }
      const nameParts = selectedObject.name.split("_");
      const type = nameParts[2]; // piece_{color}_{type}_{square}
      selectedObject.position.y = (yOffsets[type] ?? 0) + 0.2; // Elevate selected piece

      gameState.previousSelectedObject = selectedObject; // Store the currently selected piece

      }
    }

  if (!gameSettings.showValidMoves) {
    return; // Exit early if highlighting is disabled
  }

  // First remove any existing highlights
  removeHighlights(scene);
  
  validMoves.forEach((move) => {
    const square = move.to;
    const { x, z } = chessToWorld(square);
    
    // Create a highlight mesh (e.g., a transparent box)
    const highlightGeometry = new THREE.BoxGeometry(0.8, 0.01, 0.8);
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.25,
    });
    const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
    
    highlightMesh.position.set(x, 0, z);
    highlightMesh.name = `highlight-${square}`;
    
    scene.add(highlightMesh);
  });
}

export function removeHighlights(scene) {
  if (!gameSettings.showValidMoves) {
    return; // Exit early if highlighting is disabled
  }
  // Create a list of objects to remove
  const objectsToRemove = [];
  
  // Find all highlight objects
  scene.children.forEach(object => {
    if (object.name && object.name.includes("highlight-")) {
      objectsToRemove.push(object);
    }
  });
  
  // Remove them after the loop
  objectsToRemove.forEach(object => {
    scene.remove(object);
  });
  
  console.log(`Removed ${objectsToRemove.length} highlight objects`);
}

export function resetPieceElevation(gameState, pieces) {
  if (!gameState.selectedPiece) return;

  const prevPieceName = gameState.selectedPiece;
  const prevPiece = Object.values(pieces).find(p => p.name === prevPieceName);

  if (prevPiece) {
    const pieceType = prevPieceName.split("_")[2]; // "p", "k", etc.
    prevPiece.position.y = yOffsets[pieceType] || 0;
  }
}


