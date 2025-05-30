import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function initScene(canvas) {
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // Point light above the board
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 15, 0);
  scene.add(pointLight);

  // Point light helper (optional, good for dev)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(pointLightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  // Axes helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Grid helper (debugging)
  const boardSize = 8;
  const gridHelper = new THREE.GridHelper(boardSize, boardSize, "red", "orange");
  gridHelper.rotation.x = Math.PI;
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // Handle resizing
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return { scene, camera, renderer, controls };
}
