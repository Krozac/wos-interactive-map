import { loadFurnaces } from '../crud/buildings.js';
import { loadTextures } from './textures.js';
import { gridSize } from './constants.js';
import { fetchBuildings } from '../crud/buildings.js';
import * as THREE from 'three';
import i18n from '../i18n/index.js';
import { createTextTexture } from './textures.js'
import { convertWorldToLocal, checkIfCellsAreFree, occupyCells,addCellQuad, convertLocalToWorld} from './helpers.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const allianceGeometries = new Map();
let grid = [];
let isRendering = false;
function initializeGrid() {
    // Create a 2D array of gridSize x gridSize and fill it with null
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
}
// Helper Functions
async function loadBuildingTextures() {
    // Load all textures in parallel and handle texture mapping for building types
    const textures = await loadTextures();
    return textures;
}

function createBuildingMaterial(texture) {
    // Create a material for the building mesh with transparency and alpha testing
    return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5,
        depthTest: false,
    });
}

function createBuildingMesh(geometry, material) {
    // Create and return a building mesh with given geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 998;
    return mesh;
}

async function createTextSprite(building, texture) {
    const name = building?.extraData?.name || '';
    const alliance = building?.alliance?.acronym || '';
    const displayName = texture?.displayname || '';
    const fullText = `[${alliance}] ${name}${displayName != "buildings.furnace" ? i18n.t(displayName) : ""}`;


    const textTexture = await createTextTexture(fullText); // Wait for font + texture

    const spriteMaterial = new THREE.SpriteMaterial({
        map: textTexture,
        transparent: true,
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.renderOrder = 999;
    sprite.material.depthTest = false;
    sprite.scale.set(3, 1.7, 1);
    sprite.position.set(
        -building.size.h / 2 + 0.5,
        -building.size.h / 2 + 0.5,
        0
    );
    return sprite;
}

function convertCellToWorld(x, y) {
    const local = new THREE.Vector3(x, y, 0);
    return convertLocalToWorld(local, window.plane);
}
function isBorder(x, y, alliance) {
    return (
        grid[x + 1]?.[y] !== alliance ||
        grid[x - 1]?.[y] !== alliance ||
        grid[x][y + 1] !== alliance ||
        grid[x][y - 1] !== alliance
    );
}

function createTerritoryMesh(buildings) {

    const allianceCells = new Map();

    // 1. Build alliance → cells map from grid
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

            const alliance = grid[x][y];
            if (!alliance) continue;

            if (!allianceCells.has(alliance)) {
                allianceCells.set(alliance, []);
            }

            allianceCells.get(alliance).push([x, y]);
        }
    }

    // 2. Render one mesh per alliance
    for (const [allianceKey, cells] of allianceCells.entries()) {

        const positions = [];
        const borderPositions = [];

        const alliance = buildings.find(b =>
            (b.alliance?._id || 'neutral') === allianceKey.owner
        )?.alliance;

        for (const [x, y] of cells) {
            const world = convertCellToWorld(x, y);

            addCellQuad(positions, world.x, world.y);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(alliance?.color || "#ffffff"),
            transparent: true,
            opacity: 0.3,
            depthTest: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = 997;
        mesh.identifiant = "building";

        window.scene.add(mesh);
    }
}

function positionBuildingMesh(mesh, gridX, gridY, widthCells, heightCells) {
    // Set the building mesh position based on its grid coordinates and size
    mesh.position.set(gridX + widthCells / 2, gridY + heightCells / 2, 0);
    mesh.rotation.set(Math.PI / 16, -Math.PI / 16, 0);
}

function validateVersion(version) {
    if (version !== window.renderVersion) {
        console.log("Aborting operation due to version mismatch:", version, window.renderVersion);
        return false;
    }
    return true;
}

// Main Function
async function showBuildings(buildings,version) {

    console.log("version at start of showBuildings:", version);
    if (!validateVersion(version)) return; // run after each await to ensure we are still on the correct version

    // Fetch building data and textures
    //const buildings = await fetchBuildings();
    console.log("Buildings fetched:", buildings);
    const textures = await loadBuildingTextures();
    if (!validateVersion(version)) return;

    if (!buildings) { return; }
    clearBuildings();
    //loadFurnaces(buildings);
    initializeGrid();
    allianceGeometries.clear();



    // Process each building
    for (const building of buildings) {

        const buildingType = building.type;
        const texture = textures[buildingType]?.texture;

        if (!texture) {
            //console.error(`No texture found for building type: ${buildingType}`);
            continue; // Skip if no texture is found
        }

        // Prepare the texture for rotation
        texture.center.set(0.5, 0.5);
        texture.rotation = -Math.PI / 4;

        // Create building geometry and material
        const geometry = new THREE.PlaneGeometry(building.size.w, building.size.h);
        const material = createBuildingMaterial(texture);

        // Create building mesh
        const mesh = createBuildingMesh(geometry, material);
        mesh.identifiant = "building";

        // Get grid position and local coordinates
        const gridX = Math.floor(building.location.x);
        const gridY = Math.floor(building.location.y);
        const localCoords = convertWorldToLocal(new THREE.Vector3(gridX, gridY, 0), window.plane);
        
        const cellX = localCoords.x;
        const cellY = localCoords.y;

        // Check if building fits in grid and if cells are free
        const widthCells = Math.ceil(building.size.w);
        const heightCells = Math.ceil(building.size.h);

        if (!checkIfCellsAreFree(gridX, gridY, widthCells, heightCells, grid)) {
            //console.warn(`Building at (${gridX}, ${gridY}) with size (${widthCells}, ${heightCells}) overlaps with another building.`);
            continue; // Skip if building doesn't fit
        }

        const territory = building.extraData?.territory;
        const hasTerritory = !!territory;

        const territoryW = hasTerritory ? territory.w : 0;
        const territoryH = hasTerritory ? territory.h : 0;

        // Mark cells as occupied and store building data
        building.displayName =  textures[buildingType].displayname;
        occupyCells(cellX, cellY, widthCells, heightCells, building.alliance?._id || 'neutral',building, textures[buildingType]?.path, grid,territoryW,territoryH);

        // Position the building mesh and add it to the scene
        positionBuildingMesh(mesh, gridX, gridY, widthCells, heightCells);
        window.scene.add(mesh);

        // Create and add text sprite to building
        const sprite = await createTextSprite(building, textures[buildingType]);
        if (!validateVersion(version)) return; // Check version again before adding sprite

        mesh.add(sprite);

    }
        createTerritoryMesh(buildings);
        window.grid = grid;

}


function clearBuildings() {
  // Iterate backwards to safely remove elements
  for (let i = window.scene.children.length - 1; i >= 0; i--) {
    const child = window.scene.children[i];
    if (child.identifiant && child.identifiant === 'building') {
      window.scene.remove(child);
      // Also dispose geometries/materials if needed to free memory:
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }
}


        let buildingsVisible = true; 

function toggleBuildings() {
    const eyeIcon = document.getElementById('eyeIcon');

    if (buildingsVisible) {
        // Masquer les bâtiments
        window.scene.traverse(child => {
            if (child.identifiant && child.identifiant === 'building') {
                child.visible = false; // Masquer l'objet
            }
        });
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash'); // Icône œil barré
    } else {
        // Montrer les bâtiments
        window.scene.traverse(child => {
            if (child.identifiant && child.identifiant === 'building') {
                child.visible = true; // Afficher l'objet
            }
        });
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye'); // Icône œil normal
    }

    buildingsVisible = !buildingsVisible; // Inverser l'état
}
        
window.toggleBuildings=toggleBuildings;
export { showBuildings, clearBuildings, toggleBuildings };
