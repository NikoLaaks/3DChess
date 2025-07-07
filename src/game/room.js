import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function createRoom(scene) {
    loader.load('/ChessRoom_V2.glb', (gltf) => {
        const room = gltf.scene; // 👈 use the whole scene as the group

        // Point light above the board
        const pointLight = new THREE.PointLight(0xffffff, 50, 0, 2);
        pointLight.position.set(0, 7, 0);
        scene.add(pointLight);

        // Point light helper (optional, good for dev)
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
        //scene.add(pointLightHelper);



        room.scale.set(12, 12, 12);
        room.position.set(2, -14.21, 0);
        room.rotation.set(0, Math.PI / 2, 0); // Rotate the room to face the chessboard

        // Set up materials and ensure everything renders properly
        room.traverse((child) => {
            if (child.isMesh) {

                child.geometry.computeBoundingBox();
                child.geometry.computeBoundingSphere();
                child.raycast = THREE.Mesh.prototype.raycast;
            }
            if (child.name.startsWith('Light_Point')) {
                const light = new THREE.PointLight(0xffffff, 50, 100, 2);
                light.position.copy(child.getWorldPosition(new THREE.Vector3()));
                scene.add(light);
                const lightHelper = new THREE.PointLightHelper(light, 1);
                //scene.add(lightHelper);
            }
        });

        scene.add(room);
    });
}
