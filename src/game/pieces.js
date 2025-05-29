import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { chessToWorld } from "./utils.js";

const gltfloader = new GLTFLoader();

const piecePaths = {
  p: "./chess_pieces/Soldier.gltf",
  r: "./chess_pieces/Rook.gltf",
  n: "./chess_pieces/Knight.gltf",
  b: "./chess_pieces/Bishop.gltf",
  q: "./chess_pieces/Queen.gltf",
  k: "./chess_pieces/King.gltf",
};

const yOffsets = {
  p: 0.4,
  r: 0.45,
  n: 0.35,
  b: 0.6,
  q: 0.82,
  k: 0.86,
};

export function createInitialPieces(scene) {
  const pieces = {};

  function createPiece(type, color, square) {
    const modelPath = piecePaths[type];
    if (!modelPath) return;

    gltfloader.load(
      modelPath,
      (gltf) => {
        const piece = gltf.scene.children[0];

        piece.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: color === "white" ? 0xffffff : 0x454545,
              side: THREE.DoubleSide,
            });

            child.geometry.computeBoundingBox();
            child.geometry.computeBoundingSphere();
            child.raycast = THREE.Mesh.prototype.raycast;
          }
        });

        piece.scale.set(15, 15, 15);
        const yOffset = yOffsets[type] || 0;
        const { x, z } = chessToWorld(square);
        piece.position.set(x, yOffset, z);
        piece.name = `piece_${color}_${type}_${square}`;

        scene.add(piece);
        pieces[square] = piece;
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  }

  // Add white pieces
  for (let i = 0; i < 8; i++) createPiece("p", "white", String.fromCharCode(97 + i) + "2");
  createPiece("r", "white", "a1");
  createPiece("r", "white", "h1");
  createPiece("n", "white", "b1");
  createPiece("n", "white", "g1");
  createPiece("b", "white", "c1");
  createPiece("b", "white", "f1");
  createPiece("q", "white", "d1");
  createPiece("k", "white", "e1");

  // Add black pieces
  for (let i = 0; i < 8; i++) createPiece("p", "black", String.fromCharCode(97 + i) + "7");
  createPiece("r", "black", "a8");
  createPiece("r", "black", "h8");
  createPiece("n", "black", "b8");
  createPiece("n", "black", "g8");
  createPiece("b", "black", "c8");
  createPiece("b", "black", "f8");
  createPiece("q", "black", "d8");
  createPiece("k", "black", "e8");

  return pieces;
}
