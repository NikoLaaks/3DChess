import * as THREE from "three";
import { Chess } from "chess.js";
import { initScene } from "../game/scene.js";
import { worldToChess, chessToWorld } from '../game/utils.js';
import { movePiece, getPieceSquareFromWorldCoordinates } from "../game/movement.js";
import { createInitialPieces } from "../game/pieces.js";
import { createBoard } from '../game/board.js';
import { checkGameStatus } from "../game/status.js";
import { onMouseClick } from "../game/clickHandler.js";
import { createRoom } from "../game/room.js";

export function initLocalMultiplayer() {
  // Select the canvas element
  const canvas = document.querySelector(".webgl");

  // Init scene
  const { scene, camera, renderer, controls } = initScene(canvas);

  // Create room
  createRoom(scene);

  // Create board
  createBoard(scene);

  // Create pieces
  const pieces = createInitialPieces(scene);

  // Create a new chess game + raycaster
  const chess = new Chess();
  

  const gameState = {
    currentPlayer: "white",
    selectedPiece: null,
    fromSquare: null,
    AIGame: false
  };


  //    Handle mouseclicks
  window.addEventListener("click",(event) => onMouseClick(event, camera, scene, gameState, chess, pieces));


  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
