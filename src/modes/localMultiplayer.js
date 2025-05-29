import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Chess } from "chess.js";

import { worldToChess, chessToWorld } from '../game/utils.js';

import { createInitialPieces } from "../game/pieces.js";

export function initLocalMultiplayer() {
  // Select the canvas element
  const canvas = document.querySelector(".webgl");

  // Create the scene
  const scene = new THREE.Scene();

  // NEW IMPORTED FUNCTIONS HERE
  const pieces = createInitialPieces(scene);

  // Create the camera (PerspectiveCamera: FOV, aspect ratio, near, far)
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 8); // Adjust to get a good view

  // Create the renderer and attach it to the canvas
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Add a point light above the table for better visibility
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 15, 0); // Position the light above the table
  scene.add(pointLight);

  // Optionally, add a helper to visualize the light's position
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(pointLightHelper);

  // Add OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable damping (inertia)
  controls.dampingFactor = 0.25; // Damping factor

  /*
   * HELPER OBJECTS
   */
  // Add AxesHelper to visualize the coordinate axes
  const axesHelper = new THREE.AxesHelper(5); // The parameter is the length of the axes
  scene.add(axesHelper);

  // Define the chessboard size
  const boardSize = 8;
  const cellSize = 1;

  // Create a grid helper (for debugging)
  const gridHelper = new THREE.GridHelper(
    boardSize,
    boardSize,
    "red",
    "orange"
  );
  gridHelper.rotation.x = Math.PI; // Rotate to lie flat
  gridHelper.position.y = 0.01; // Lift slightly to avoid z-fighting
  scene.add(gridHelper);

  

  /*
   * LOAD 3D MODELS
   */
  const gltfloader = new GLTFLoader();

  // Load board model
  gltfloader.load("/Shakkilauta.gltf", (gltf) => {
    const chessBoard = gltf.scene.children[0];
    scene.add(chessBoard);

    chessBoard.position.set(0, -0.35, 0);
    chessBoard.scale.set(4, 0.4, 4);

    const boundingBox = new THREE.Box3().setFromObject(chessBoard);
    const size = boundingBox.getSize(new THREE.Vector3());
    console.log("Chessboard size:", size);

    //chessboard material
    chessBoard.traverse((child) => {
      if (child.isMesh) {
        console.log(child.material);
      }
    });
  });

  
  // Create a new chess game + raycaster
  const chess = new Chess();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plane at y=0

  let currentPlayer = "white"; // Track the current player
  let selectedPiece = null;
  let fromSquare = null;

  //
  //    Handle mouse clicks
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
      if (fromSquare == null) {
        // If clicked object is piece
        if (pieceIntersect) {
          const object = pieceIntersect.object;
          const pieceSquare = getPieceSquareFromWorldCoordinates(object);
          const pieceColor = object.name.split("_")[1]; // White or Black

          //Check if the piece belongs to the current player
          if (
            (currentPlayer === "white" && pieceColor === "black") ||
            (currentPlayer === "black" && pieceColor === "white")
          ) {
            console.log("Invalid move: wrong player");
            return;
          }
          selectedPiece = object.name;
          fromSquare = pieceSquare;
          console.log(
            `Piece clicked: ${selectedPiece} at square ${fromSquare}`
          );

          //get valid moves
          const validMoves = chess.moves({ square: fromSquare, verbose: true });

          // If the piece has valid moves, highlight them
          if (validMoves.length > 0) {
            //highlightValidMoves(validMoves);
            console.log(`Valid moves for ${selectedPiece}:`, validMoves);
          } else {
            //If no valid moves, set selectedPiece and fromSquare back to null
            console.log(`No valid moves available for ${selectedPiece}`);
            selectedPiece = null;
            fromSquare = null;
            return;
          }
        }
        // If piece is selected before clicking
      } else if (fromSquare != null) {
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
            (currentPlayer === "white" && pieceColor === "black") ||
            (currentPlayer === "black" && pieceColor === "white")
          ) {
            // Get coordinates from the piece and use it as a square to move to if valid
            if (fromSquare) {
              const validMoves = chess.moves({
                square: fromSquare,
                verbose: true,
              });
              const toSquare = getPieceSquareFromWorldCoordinates(object);

              if (validMoves.some((move) => move.to === toSquare)) {
                movePiece(fromSquare, toSquare);
                checkGameStatus();
              } else {
                console.log("Invalid move");
                selectedPiece = null;
                fromSquare = null;
              }
            }
            // If selected piece is currentPlayer piece
          } else {
            selectedPiece = object.name;
            fromSquare = pieceSquare;
            console.log(
              `Piece clicked: ${selectedPiece} at square ${fromSquare}`
            );

            //get valid moves
            const validMoves = chess.moves({
              square: fromSquare,
              verbose: true,
            });

            // If the piece has valid moves, highlight them
            if (validMoves.length > 0) {
              //highlightValidMoves(validMoves);
              console.log(`Valid moves for ${selectedPiece}:`, validMoves);
            } else {
              //If no valid moves, set selectedPiece and fromSquare back to null
              console.log(`No valid moves available for ${selectedPiece}`);
              selectedPiece = null;
              fromSquare = null;
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

      if (fromSquare) {
        const validMoves = chess.moves({ square: fromSquare, verbose: true });

        if (validMoves.some((move) => move.to === toSquare)) {
          movePiece(fromSquare, toSquare);
          checkGameStatus();
        } else {
          console.log("Invalid move");
          selectedPiece = null;
          fromSquare = null;
        }
      }
    }
  }

  window.addEventListener("click", onMouseClick);

  function getPieceSquareFromWorldCoordinates(piece) {
    const piecePosition = piece.position;
    const chessSquare = worldToChess(piecePosition.x, piecePosition.z);
    return chessSquare;
  }

  function movePiece(from, to) {
    const move = chess.move({ from, to });
    if (move === null) {
      console.log("Invalid move");
      selectedPiece = null;
      return;
    }
    console.log("Move made in chess.js:", move);

    const movingPiece = pieces[from];
    if (!movingPiece) {
      console.warn("No piece at", from);
      return;
    }

    // handle capture
    if (move.captured && pieces[to]) {
      scene.remove(pieces[to]);
      delete pieces[to];
    }
    //move the 3D object
    const { x, z } = chessToWorld(to);
    movingPiece.position.set(x, movingPiece.position.y, z);

    //update mapping
    delete pieces[from]; // Remove the piece from the old square
    pieces[to] = movingPiece; // Add the piece to the new square

    //update piece name
    const colorName = move.color === "w" ? "white" : "black";
    movingPiece.name = `piece_${colorName}_${move.piece}_${to}`;

    // switch player
    currentPlayer = currentPlayer === "white" ? "black" : "white";
    console.log(`Current player: ${currentPlayer}`);

    selectedPiece = null;
    fromSquare = null;
    console.log("Pieces mapping:", pieces);
    console.log("Chess board state:", chess.ascii());
    console.log("Chess board fen:", chess.fen());
    console.log("Chess board pgn:", chess.pgn());
  }

  function checkGameStatus() {
    if (chess.isGameOver()) {
      console.log("Game over");
      // Implement game over logic here (e.g., show message, reset game, etc.)
    } else if (chess.inCheck()) {
      console.log("Check!");
    }
  }

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
