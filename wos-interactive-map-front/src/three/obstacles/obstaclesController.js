import { buildObstacleGrid } from './obstaclesGrid.js'
import { renderObstacles } from './obstaclesRenderer.js'

import { loadTextures } from '../textures.js';
import { loadJSON } from '../helpers';

async function getObstaclesData(){
    const [obstacles, bindings, textures] = await Promise.all([
        loadJSON('/data/obstacles.json'),
        loadJSON('/data/bindings.json'),
        loadTextures()
    ]);

    return {obstacles, bindings, textures}
}

function isPlotingObstacles(version){
    return window.obstaclesPlotVersion !== version;
}

let obstaclesPlotVersion = 0;
export async function plotObstacles(){
    if (!window.scene) return;

    const version = ++obstaclesPlotVersion;
    window.obstaclesPlotVersion = version;

    const obstaclesData = await getObstaclesData()
    if (isPlotingObstacles(version)) return; 
    
    await renderObstacles(obstaclesData)
    if (isPlotingObstacles(version)) return; 

    window.world.grids.obstacles = buildObstacleGrid(obstaclesData)
}