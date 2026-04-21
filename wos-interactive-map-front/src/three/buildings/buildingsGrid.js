import { gridSize } from "../constants";
import { createEmptyGrid } from "../helpers";
import { placeEntityOnGrid } from "../entityRenderer";
import { convertWorldToLocal } from "../helpers";
import * as THREE from 'three';

export function buildBuildingGrid(buildings, textures) {
    const grid = createEmptyGrid(gridSize);
    for (const building of buildings) {
        const texture = textures[building.type];

        const gridX = Math.floor(building.location.x);
        const gridY = Math.floor(building.location.y);

        const localCoords = convertWorldToLocal(
        new THREE.Vector3(gridX, gridY, 0),
        window.plane
        );

        const cellX = localCoords.x;
        const cellY = localCoords.y;

        const widthCells = Math.ceil(building.size.w);
        const heightCells = Math.ceil(building.size.h);

        const territory = building.extraData?.territory;

        placeEntityOnGrid({
            grid,
            x: cellX,
            y: cellY,
            w: widthCells,
            h: heightCells,
            type: building.alliance?._id || 'neutral',
            data: building,
            texturePath: texture?.path,
            TerritoryW : territory?.w || 0,
            TerritoryH : territory?.h || 0, 
            displayName: texture?.displayname
        });
    }

    return grid;
}