import * as THREE from "three";
import { Chess } from "chess.js";
import { initScene } from "../game/scene.js";
import { worldToChess, chessToWorld } from "../game/utils.js";
import {
  movePiece,
  getPieceSquareFromWorldCoordinates,
} from "../game/movement.js";
import { createInitialPieces } from "../game/pieces.js";
import { createBoard } from "../game/board.js";
import { checkGameStatus } from "../game/status.js";
import { onMouseClick } from "../game/clickHandler.js";
import { createRoom } from "../game/room.js";

export function initAIGame(playerColor) {
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
    playerColor,
    selectedPiece: null,
    fromSquare: null,
    AIGame: true,
  };

  // Setup stockfish
  const stockfish = new Worker("/engines/stockfish.wasm.js");
  stockfish.postMessage("uci");
  stockfish.postMessage("isready");
  stockfish.postMessage("ucinewgame");

  let aiMoveResolver = null;

  // Stockfish message listener
  stockfish.onmessage = (event) => {
    const line = event.data;
    console.log("Stockfish message:", line);

    if (line.startsWith("bestmove") && aiMoveResolver) {
      aiMoveResolver(line);
      aiMoveResolver = null;
    }
  };

  gameLoop(chess, playerColor, gameState, scene, pieces, camera, stockfish);

  window.addEventListener("click", (event) => {
    const turn = chess.turn();
    const isPlayerTurn =
      (playerColor === "white" && turn === "w") ||
      (playerColor === "black" && turn === "b");
    if (isPlayerTurn) {
      console.log("PLAYER TURN", turn);
      onMouseClick(
        event,
        camera,
        scene,
        gameState,
        chess,
        pieces,
        continueGameLoop
      );
    } else {
      console.log("Not players turn, ignoring click");
    }
  });

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

  function continueGameLoop() {
    gameLoop(
      chess,
      playerColor,
      gameState,
      scene,
      pieces,
      camera,
      stockfish,
      continueGameLoop
    );
  }

  async function makeAiMove(
    chess,
    gameState,
    scene,
    pieces,
    stockfish,
    continueGameLoop
  ) {
    return new Promise((resolve) => {
      aiMoveResolver = (bestMoveMsg) => {
        const parts = bestMoveMsg.split(" ");
        const move = parts[1];
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);

        movePiece(from, to, scene, pieces, chess, gameState, continueGameLoop);
        checkGameStatus(chess);
        gameState.currentPlayer = chess.turn() === "w" ? "white" : "black";

        resolve();
      };

      // Send Stockfish commands
      stockfish.postMessage(`position fen ${chess.fen()}`);
      stockfish.postMessage("go depth 15");
    });
  }

  async function gameLoop(
    chess,
    playerColor,
    gameState,
    scene,
    pieces,
    camera,
    stockfish,
    continueGameLoop
  ) {
    if (chess.isGameOver()) {
      console.log("Game over");
      return;
    }
    const turn = chess.turn();
    const isPlayerTurn =
      (playerColor === "white" && turn === "w") ||
      (playerColor === "black" && turn === "b");
    console.log("isPlayerTurn: ", isPlayerTurn);

    // If not player turn, make AI move and loop again
    if (!isPlayerTurn) {
      console.log("AI TURN", turn);
      await makeAiMove(
        chess,
        gameState,
        scene,
        pieces,
        stockfish,
        continueGameLoop
      );
    }
  }
}
