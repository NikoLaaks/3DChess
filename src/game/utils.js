import * as THREE from "three";
import { gameSettings } from "./settings.js";

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

export function highlightValidMoves(validMoves, scene) {
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


