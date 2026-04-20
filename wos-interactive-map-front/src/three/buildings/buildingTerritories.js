import { gridSize } from "../constants";
import * as THREE from 'three';
import { convertLocalToWorld, addCellQuad } from "../helpers";

function convertCellToWorld(x, y) {
    const local = new THREE.Vector3(x, y, 0);
    return convertLocalToWorld(local, window.plane);
}


export function createTerritoryMesh(buildings) {

    const allianceCells = new Map();

    // 1. Build alliance → cells map from grid
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

            const alliance = window.world.grids.buildings[x][y];
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
        mesh.identifiant = "territory";

        window.scene.add(mesh);
    }
}

export function clearTerritories() {
    for (let i = window.scene.children.length - 1; i >= 0; i--) {
    const child = window.scene.children[i];
    if (child.identifiant && child.identifiant === 'territory') {
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