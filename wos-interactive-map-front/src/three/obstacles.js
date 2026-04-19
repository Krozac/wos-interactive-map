import * as THREE from 'three';
import { loadTextures } from './textures.js';
import { gridSize } from './constants.js';

import {
    convertWorldToLocal,
    checkIfCellsAreFree,
    occupyCells,
    convertLocalToWorld
} from './helpers.js';


async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return res.json();
}

let grid = [];

function initializeGrid() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
}

function createObstacleMaterial(texture) {
    return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 1.0,
        depthTest: false,
        blending: THREE.MultiplyBlending
    });
}

function createObstacleMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 996; // slightly below buildings
    mesh.identifiant = "obstacle";
    return mesh;
}

function positionObstacleMesh(mesh, gridX, gridY, widthCells, heightCells) {
    mesh.position.set(
        gridX + widthCells / 2,
        gridY + heightCells / 2,
        0
    );
    mesh.rotation.set(Math.PI / 16, -Math.PI / 16, 0);
}

function isRenderingObstacles(version) {
    console.log('Current obstaclesRenderVersion:', window.obstaclesRenderVersion, ' vs version:', version);
    return window.obstaclesRenderVersion !== version;
}

async function showObstacles(version) {
    console.log('version at start of showObstacles:', version);

    const [obstaclesData, bindings, textures] = await Promise.all([
        loadJSON('/data/obstacles.json'),
        loadJSON('/data/bindings.json'),
        loadTextures()
    ]);

    console.log('Obstacles data:', obstaclesData);

    if ( isRenderingObstacles(version) ) return;

    clearObstacles();
    initializeGrid();
    

    for (const key in obstaclesData) {
        const obstacle = obstaclesData[key];

        console.log(`Processing obstacle: ${key} at (${obstacle.x}, ${obstacle.y}) with size (${obstacle.w}x${obstacle.h}) and type ${obstacle.type}`);
        const bindingKey = bindings[obstacle.type];
        const textureData = textures[bindingKey];
        console.log('Texture data for obstacle type:', obstacle.type, textures);

        if (!textureData) {
            console.warn(`No texture for obstacle type: ${obstacle.type}`);
            continue;
        }

        const texture = textureData.texture;

        // rotate texture like buildings
        texture.center.set(0.5, 0.5);
        texture.rotation = -Math.PI / 4;


        const widthCells = Math.ceil(obstacle.w * (obstacle.scale || 1));
        const heightCells = Math.ceil(obstacle.h * (obstacle.scale || 1));


        const geometry = new THREE.PlaneGeometry(widthCells, heightCells);
        const material = createObstacleMaterial(texture);

        const mesh = createObstacleMesh(geometry, material);

        const gridX = Math.floor(obstacle.x);
        const gridY = Math.floor(obstacle.y);

        const localCoords = convertLocalToWorld(
            new THREE.Vector3(gridX, gridY, 0),
            window.plane
        );

        const cellX = Math.floor(localCoords.x);
        const cellY = Math.floor(localCoords.y);
                
        // Prevent overlap
        if (!checkIfCellsAreFree(cellX, cellY, obstacle.w, obstacle.h, grid)) {
            console.warn(`Obstacle overlap at (${gridX}, ${gridY})`);
            continue;
        }

        // Mark grid as occupied (no alliance → use "obstacle")
        console.log(`Occupying cells for obstacle at (${cellX}, ${cellY}) with size (${obstacle.w}x${obstacle.h})`);
        occupyCells(
            gridX,
            gridY,
            obstacle.w,
            obstacle.h,
            "obstacle",
            obstacle,
            textureData.path,
            grid,
            0,
            0
        );

        positionObstacleMesh(mesh, cellX, cellY, widthCells, heightCells);

        window.scene.add(mesh);
    }

    window.obstacleGrid = grid;
}

// CLEANUP
function clearObstacles() {
    for (let i = window.scene.children.length - 1; i >= 0; i--) {
        const child = window.scene.children[i];

        if (child.identifiant === 'obstacle') {
            window.scene.remove(child);

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

export { showObstacles, clearObstacles };