import * as THREE from 'three';

import { createEntityMesh, positionOnGrid } from '../entityRenderer.js';
import { convertLocalToWorld } from '../helpers.js';

async function renderObstacles(data) {
    for (const key in data.obstacles) {
        const obstacle = data.obstacles[key];

        const textureData = data.textures[data.bindings[obstacle.type]];
        const texture = textureData.texture;

        texture.center.set(0.5, 0.5);
        texture.rotation = -Math.PI / 4;

        const mesh = createEntityMesh({
            texture: texture,
            width: Math.ceil(obstacle.w * (obstacle.scale || 1)),
            height: Math.ceil(obstacle.h * (obstacle.scale || 1)),
            renderOrder: 996,
            identifier: "obstacle",
            alphaTest: 1.0,
            blending: THREE.MultiplyBlending
        });

        const gridX = Math.floor(obstacle.x);
        const gridY = Math.floor(obstacle.y);

        const localCoords = convertLocalToWorld(
            new THREE.Vector3(gridX, gridY, 0),
            window.plane
        );

        const cellX = Math.floor(localCoords.x);
        const cellY = Math.floor(localCoords.y);

        positionOnGrid(
            mesh,
            cellX,
            cellY,
            Math.ceil(obstacle.w * (obstacle.scale || 1)),
            Math.ceil(obstacle.h * (obstacle.scale || 1))
        );

        window.scene.add(mesh);
    }

}

export { renderObstacles };