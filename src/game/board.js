import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gltfloader = new GLTFLoader();

export function createBoard(scene) {
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
    
};
