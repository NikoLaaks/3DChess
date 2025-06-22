import * as THREE from "three";
import { worldToChess, highlightValidMoves, removeHighlights } from "./utils";
import { getPieceSquareFromWorldCoordinates } from "./movement";
import { movePiece } from "./movement";
import { checkGameStatus } from "./status";
import { remove } from "three/examples/jsm/libs/tween.module.js";

export function onMouseClick(event, camera, scene, gameState, chess, pieces, continueGameLoop) {
    console.clear();
    console.log('turn:', chess.turn());

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plane at y=0

    const canvas = document.querySelector('.webgl');
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //Use raycaster to get clicked object
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

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
          
          // Remove any existing highlights before showing new ones
          removeHighlights(scene);
          
          gameState.selectedPiece = object.name;
          gameState.fromSquare = pieceSquare;
          console.log(
            `Piece clicked: ${gameState.selectedPiece} at square ${gameState.fromSquare}`
          );

          //get valid moves
          const validMoves = chess.moves({ square: gameState.fromSquare, verbose: true });

          // If the piece has valid moves, highlight them
          if (validMoves.length > 0) {
            highlightValidMoves(validMoves, scene);
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
                // Remove highlights before moving
                removeHighlights(scene);
                
                movePiece(gameState.fromSquare, toSquare, scene, pieces, chess, gameState, continueGameLoop);
                checkGameStatus(chess);
              } else {
                console.log("Invalid move");
                gameState.selectedPiece = null;
                gameState.fromSquare = null;
                
                // Remove highlights for invalid move
                removeHighlights(scene);
              }
            }
            // If selected piece is gameState.currentPlayer piece
          } else {
            // Remove existing highlights before showing new ones
            removeHighlights(scene);
            
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
              highlightValidMoves(validMoves, scene);
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
          removeHighlights(scene);
          
          movePiece(gameState.fromSquare, toSquare, scene, pieces, chess, gameState, continueGameLoop);
          checkGameStatus(chess);
        } else {
          console.log("Invalid move");
          gameState.selectedPiece = null;
          gameState.fromSquare = null;
          
          // Remove highlights for invalid move
          removeHighlights(scene);
        }
      }
    }
  }

