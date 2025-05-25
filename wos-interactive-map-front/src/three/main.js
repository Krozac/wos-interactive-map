import { showBuildings} from './building.js';
import { cameraControls, setupCamera } from './camera.js';

import { EulerRotation} from './constants.js';
import { initPlane } from './plane.js';
import { initControls } from './controls.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export async function initScene(container,setSelectedCell) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x335799);

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.001, 10000000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  initControls(controls,setSelectedCell);

  window.scene = scene;
  window.camera = camera;
  window.controls = controls;
  window.renderer = renderer;
  setupCamera(camera);
  initPlane();
  await showBuildings();
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

