import { showBuildings, clearBuildings } from './building.js';
import { cameraControls, setupCamera } from './camera.js';

import { EulerRotation} from './constants.js';
import { initPlane } from './plane.js';
import { initControls } from './controls.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export let scene, camera, renderer, controls;

export async function initScene(container, setSelectedCell) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x335799);

  window.scene = scene;

  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.001, 10000000);

  window.camera = camera;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);

  window.renderer = renderer;

  container.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  initControls(controls, setSelectedCell);

  window.controls = controls;

  setupCamera(camera);
  initPlane();
  cameraControls(camera, controls, scene);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    camera.position.z = 1000;
    camera.rotation.copy(EulerRotation);
    renderer.render(scene, camera);
  }

  animate();
}


export async function renderBuildings(buildings, setLoading) {
  if (!window.scene) return;
  
  if (setLoading) setLoading(true); // start loading indicator
  clearBuildings();
  
  await showBuildings(buildings); // if showBuildings is async
  if (setLoading) setLoading(false); // hide loading indicator
}
