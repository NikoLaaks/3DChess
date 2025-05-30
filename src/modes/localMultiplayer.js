import * as THREE from "three";
import { Chess } from "chess.js";
import { initScene } from "../game/scene.js";
import { worldToChess, chessToWorld } from '../game/utils.js';
import { movePiece, getPieceSquareFromWorldCoordinates } from "../game/movement.js";
import { createInitialPieces } from "../game/pieces.js";
import { createBoard } from '../game/board.js';
import { checkGameStatus } from "../game/status.js";

export function initLocalMultiplayer() {
  // Select the canvas element
  const canvas = document.querySelector(".webgl");

  // Init scene
  const { scene, camera, renderer, controls } = initScene(canvas);

  // Create board
  createBoard(scene);

  // Create pieces
  const pieces = createInitialPieces(scene);

  // Create a new chess game + raycaster
  const chess = new Chess();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plane at y=0

  const gameState = {
    currentPlayer: "white",
    selectedPiece: null,
    fromSquare: null,
  };


  //
  //    Handle mouseclicks
  //
  function onMouseClick(event) {
    const canvas = document.querySelector('.webgl');
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //Use raycaster to get clicked object
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log(
      "All intersects:",
      intersects.map((i) => i.object.name)
    ); // For debugging, remove this

    const pieceIntersect = intersects.find(
      (i) => i.object && i.object.name && i.object.name.includes("piece")
    );

    // If any piece is clicked
    if (intersects.length > 0 && pieceIntersect) {
      // If no piece has been selected before clicking
      if (gameState.fromSquare == null) {
        // If clicked object is piece
        if (pieceIntersect) {
          const object = pieceIntersect.object;
          const pieceSquare = getPieceSquareFromWorldCoordinates(object);
          const pieceColor = object.name.split("_")[1]; // White or Black

          //Check if the piece belongs to the current player
          if (
            (gameState.currentPlayer === "white" && pieceColor === "black") ||
            (gameState.currentPlayer === "black" && pieceColor === "white")
          ) {
            console.log("Invalid move: wrong player");
            return;
          }
          gameState.selectedPiece = object.name;
          gameState.fromSquare = pieceSquare;
          console.log(
            `Piece clicked: ${gameState.selectedPiece} at square ${gameState.fromSquare}`
          );

          //get valid moves
          const validMoves = chess.moves({ square: gameState.fromSquare, verbose: true });

          // If the piece has valid moves, highlight them
          if (validMoves.length > 0) {
            //highlightValidMoves(validMoves);
            console.log(`Valid moves for ${gameState.selectedPiece}:`, validMoves);
          } else {
            //If no valid moves, set gameState.selectedPiece and gameState.fromSquare back to null
            console.log(`No valid moves available for ${gameState.selectedPiece}`);
            gameState.selectedPiece = null;
            gameState.fromSquare = null;
            return;
          }
        }
        // If piece is selected before clicking
      } else if (gameState.fromSquare != null) {
        const pieceIntersect = intersects.find(
          (i) => i.object && i.object.name && i.object.name.includes("piece")
        );
        // If clicked object is piece
        if (pieceIntersect) {
          const object = pieceIntersect.object;
          const pieceSquare = getPieceSquareFromWorldCoordinates(object);
          const pieceColor = object.name.split("_")[1]; // White or Black

          //Check if clicked piece belongs to other player
          if (
            (gameState.currentPlayer === "white" && pieceColor === "black") ||
            (gameState.currentPlayer === "black" && pieceColor === "white")
          ) {
            // Get coordinates from the piece and use it as a square to move to if valid
            if (gameState.fromSquare) {
              const validMoves = chess.moves({
                square: gameState.fromSquare,
                verbose: true,
              });
              const toSquare = getPieceSquareFromWorldCoordinates(object);

              if (validMoves.some((move) => move.to === toSquare)) {
                movePiece(gameState.fromSquare, toSquare, scene, pieces, chess, gameState);
                checkGameStatus(chess);
              } else {
                console.log("Invalid move");
                gameState.selectedPiece = null;
                gameState.fromSquare = null;
              }
            }
            // If selected piece is gameState.currentPlayer piece
          } else {
            gameState.selectedPiece = object.name;
            gameState.fromSquare = pieceSquare;
            console.log(
              `Piece clicked: ${gameState.selectedPiece} at square ${gameState.fromSquare}`
            );

            //get valid moves
            const validMoves = chess.moves({
              square: gameState.fromSquare,
              verbose: true,
            });

            // If the piece has valid moves, highlight them
            if (validMoves.length > 0) {
              //highlightValidMoves(validMoves);
              console.log(`Valid moves for ${gameState.selectedPiece}:`, validMoves);
            } else {
              //If no valid moves, set gameState.selectedPiece and gameState.fromSquare back to null
              console.log(`No valid moves available for ${gameState.selectedPiece}`);
              gameState.selectedPiece = null;
              gameState.fromSquare = null;
              return;
            }
          }
        }
      }
    } else {
      // If a square is clicked
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      const { x, z } = intersectionPoint; // Get clicked position
      const toSquare = worldToChess(x, z); // Convert to chessboard coordinates
      console.log("Square clicked:", toSquare);

      if (gameState.fromSquare) {
        const validMoves = chess.moves({ square: gameState.fromSquare, verbose: true });

        if (validMoves.some((move) => move.to === toSquare)) {
          movePiece(gameState.fromSquare, toSquare, scene, pieces, chess, gameState);
          checkGameStatus(chess);
        } else {
          console.log("Invalid move");
          gameState.selectedPiece = null;
          gameState.fromSquare = null;
        }
      }
    }
  }

  window.addEventListener("click", onMouseClick);


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
