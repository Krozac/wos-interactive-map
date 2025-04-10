import { showBuildings, toggleBuildings, clearBuildings } from './building.js';
import { cameraControls, setupCamera } from './camera.js';
import { loadTextures } from './textures.js';
import { gridSize, fontName, EulerRotation} from './constants.js';
import { initPlane } from './plane.js';
import { initControls } from './controls.js'
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

let scene, camera, controls,renderer;

document.addEventListener("DOMContentLoaded", async () => {
    // Setup the scene, camera, and controls
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x335799);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10000000);

    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("mainContent").appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x404040); // lumière douce
    scene.add(light);
    
    controls = new OrbitControls(camera, renderer.domElement);
    initControls(controls);
    
    window.scene = scene;
    window.camera = camera;
    window.controls = controls;
    window.renderer = renderer;
    
    setupCamera(camera);
    initPlane();
    await showBuildings();
    cameraControls(camera, controls, scene);
    
    animate()
});


function animate() {
    requestAnimationFrame(animate);

    // Update controls (without rotating)
    controls.update(); // This handles zooming and panning
    
    // Manually maintain the camera tilt after controls update

    window.camera.position.z = 1000;
    window.camera.rotation.copy(EulerRotation);
    renderer.render(scene,  window.camera);
}