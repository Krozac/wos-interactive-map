import { loadFurnaces } from '/js/crud/buildings.js';
import { loadTextures } from './textures.js';
import { gridSize } from './constants.js';
import { fetchBuildings } from '../crud/buildings.js';
import * as THREE from 'three';

import { createTextTexture } from './textures.js'
import { convertLocalToWorld, convertWorldToLocal,checkIfCellsAreFree,occupyCells } from './helpers.js';
let grid = [];

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
    const name = building.extraData.name || '';
    const alliance = building.extraData.alliance || '';
    const displayName = texture.displayname || '';
    const fullText = alliance + name + displayName;

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

function createTerritoryMesh(building) {
    // Create the territory area mesh if the building has a territory defined
    if (!building.extraData.territory) return null;

    const geometryTerritory = new THREE.PlaneGeometry(building.extraData.territory.w, building.extraData.territory.h);
    const materialTerritory = new THREE.MeshBasicMaterial({
        color: new THREE.Color(building.extraData.territory.color),
        side: THREE.DoubleSide,
        opacity: 0.2,
        transparent: true
    });

    const planeTerritory = new THREE.Mesh(geometryTerritory, materialTerritory);
    planeTerritory.renderOrder = 997;
    planeTerritory.material.depthTest = false;
    return planeTerritory;
}

function positionBuildingMesh(mesh, gridX, gridY, widthCells, heightCells) {
    // Set the building mesh position based on its grid coordinates and size
    mesh.position.set(gridX + widthCells / 2, gridY + heightCells / 2, 0);
    mesh.rotation.set(Math.PI / 16, -Math.PI / 16, 0);
}

// Main Function
async function showBuildings() {
    // Fetch building data and textures
    const buildings = await fetchBuildings();
    const textures = await loadBuildingTextures();
    
    clearBuildings();
    loadFurnaces(buildings);
    initializeGrid();

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

        // Mark cells as occupied and store building data
        occupyCells(cellX, cellY, widthCells, heightCells, building, textures[buildingType]?.path, grid);

        // Position the building mesh and add it to the scene
        positionBuildingMesh(mesh, gridX, gridY, widthCells, heightCells);
        scene.add(mesh);

        // Create and add text sprite to building
        const sprite = await createTextSprite(building, textures[buildingType]);
        mesh.add(sprite);

        // Create and add territory mesh if applicable
        const territoryMesh = createTerritoryMesh(building);
        if (territoryMesh) {
            territoryMesh.position.set(gridX + Math.floor(building.size.w / 2) + 0.5, gridY + Math.floor(building.size.h / 2) + 0.5, 0);
            territoryMesh.identifiant = "building";
            scene.add(territoryMesh);
        }
    }
        window.grid = grid;
}


function clearBuildings() {
    window.scene.children.forEach(child => {
        if (child.identifiant && child.identifiant === 'building') {
        console.log("a")
            window.scene.remove(child);
        }
    });
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
