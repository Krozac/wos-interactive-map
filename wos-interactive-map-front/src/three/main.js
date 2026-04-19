import { clearBuildings , addBuilding, deleteBuilding, updateBuilding, createTerritoryMesh,clearTerritories,didBuildingChange, rebuildGrid } from './building.js';
import { cameraControls, setupCamera } from './camera.js';

import { EulerRotation} from './constants.js';
import { initPlane } from './plane.js';
import { initControls } from './controls.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { showObstacles } from './obstacles.js';

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

let obstaclesRenderVersion = 0;
export async function renderObstacles(setLoading) {
  if (!window.scene) return;

  const version = ++obstaclesRenderVersion;
  window.obstaclesRenderVersion = version;

  if (setLoading) setLoading(true);

  await showObstacles(version);

  if (setLoading) setLoading(false);
}



export async function syncBuildings(buildings) {
  const existing = window.buildingMeshMap;
  const newIds = new Set(buildings.map(b => b._id));
  const promises = [];

  for (const id of existing.keys()) {
    if (!newIds.has(id)) {
      promises.push(deleteBuilding(id));
    }
  }

  for (const building of buildings) {
    if (existing.has(building._id)) {
      if (didBuildingChange(existing.get(building._id).userData.building, building)) {
        promises.push(updateBuilding(building));
      }
    } else {
      promises.push(addBuilding(building));
    }
  }

  await Promise.all(promises);

  window.grid = rebuildGrid(buildings);

  rebuildTerritories(buildings);
}

let territoryVersion = 0;
function rebuildTerritories(buildings) {
  const version = ++territoryVersion;

  // defer to next frame to avoid blocking + ensure scene stability
  requestAnimationFrame(() => {
    if (version !== territoryVersion) return;

    clearTerritories();
    createTerritoryMesh(buildings);
  });
}