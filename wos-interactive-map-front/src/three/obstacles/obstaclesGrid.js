import { placeEntityOnGrid } from "../entityRenderer";
import { gridSize } from "../constants";
import { createEmptyGrid } from "../helpers";

export function buildObstacleGrid(data) {
    const grid = createEmptyGrid(gridSize)

    for (const key in data.obstacles){
        const obstacle = data.obstacles[key];

        const textureData = data.textures[data.bindings[obstacle.type]];

        const width = Math.ceil(obstacle.w * (obstacle.scale || 1));
        const height = Math.ceil(obstacle.h * (obstacle.scale || 1));

        const x = Math.floor(obstacle.x);
        const y = Math.floor(obstacle.y);

        placeEntityOnGrid({
            grid,
            x,
            y,
            w: width,
            h: height,
            type: 'obstacle',
            data: obstacle,
            texturePath: textureData.path,
            displayName: textureData.displayname
        });
    }

    return grid
}