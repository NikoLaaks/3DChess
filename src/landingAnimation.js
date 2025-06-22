import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let animationId = null;
let scene, camera, renderer, knight = null;

// Animation function - defined outside so it can be accessed by both functions
function animate() {
  // Only continue animation if landing page is visible
  if (document.getElementById('landingPage').style.display !== 'none') {
    animationId = requestAnimationFrame(animate);
    
    // Rotate the knight if it's loaded
    if (knight) {
      knight.rotation.y += 0.002;
      
      
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  } else {
    // Cancel animation if page not visible
    cancelAnimationFrame(animationId);
  }
}

export function initLandingAnimation() {
  // Only initialize once to avoid duplicates
  if (scene) {
    // If already initialized, just restart animation
    if (knight) {
      knight.rotation.y = 0; // Reset rotation
    }
    animate();
    return { scene, camera, renderer };
  }
  
  // Select the canvas element
  const canvas = document.querySelector(".landing-canvas");
  
  // Create the scene
  scene = new THREE.Scene();
  
  // Create the camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, 0);
  
  // Create the renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);
  
  // Add a spotlight to highlight the knight
  const spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(0, 10, 0);
  spotlight.angle = Math.PI / 6;
  spotlight.penumbra = 0.2;
  spotlight.castShadow = true;
  scene.add(spotlight);
  
  // Load the knight model
  const loader = new GLTFLoader();
  loader.load(
    './chess_pieces/Knight.gltf',
    (gltf) => {
      knight = gltf.scene.children[0];
      knight.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.2
          });
        }
      });
      knight.scale.set(38, 38, 38);
      knight.position.set(0, 0, 0);
      scene.add(knight);
    }
  );
  
  // Handle window resize
  window.addEventListener("resize", () => {
    if (renderer && camera) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  });
  
  // Start the animation
  animate();
  
  return { scene, camera, renderer };
}

// Function to resume animation when returning to landing page
export function resumeLandingAnimation() {
  if (scene && knight) {
    console.log("Resuming landing animation...");
    // Cancel any existing animation frame first to avoid duplicates
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animate();
  } else {
    // If scene was somehow destroyed, reinitialize
    console.warn("Landing animation not initialized. Reinitializing...");
    initLandingAnimation();
  }
}