import * as THREE from "three";
import { Chess } from "chess.js";
import { initScene } from "../game/scene.js";
import { worldToChess, chessToWorld } from '../game/utils.js';
import { movePiece, getPieceSquareFromWorldCoordinates } from "../game/movement.js";
import { createInitialPieces } from "../game/pieces.js";
import { createBoard } from '../game/board.js';
import { checkGameStatus } from "../game/status.js";


export function initAIGame(playerColor) {
    // Select the canvas element
  const canvas = document.querySelector(".webgl");

  // Init scene
  const { scene, camera, renderer, controls } = initScene(canvas);

  // Create board
  createBoard(scene);

  // Create pieces
  const pieces = createInitialPieces(scene);

  // Create AI worker
  const stockfish = new Worker('/engines/stockfish.wasm.js');

  // Create a new chess game + raycaster
  const chess = new Chess();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plane at y=0

  const gameState = {
    currentPlayer: "white",
    playerColor,
    selectedPiece: null,
    fromSquare: null,
  };

  /*
  * Handle mouseclicks
  */
  function onMouseClick(event) {
    // Only allow player to click if its players turn
    if(gameState.currentPlayer !== gameState.playerColor) {
        return;
    }

    const canvas = document.querySelector('.webgl');
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log(
      "All intersects:",
      intersects.map((i) => i.object.name)
    ); // For debugging, remove this

    const pieceIntersect = intersects.find(
      (i) => i.object && i.object.name && i.object.name.includes("piece")
    );
  }
}
