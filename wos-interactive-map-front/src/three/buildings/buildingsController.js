import { addBuilding, updateBuilding, deleteBuilding } from "./buildingsRenderer.js";
import { buildBuildingGrid } from "./buildingsGrid.js"
import { loadTextures } from "../textures.js";
import { clearTerritories, createTerritoryMesh} from "./buildingTerritories.js";

function didBuildingChange(oldB, newB) {
    if (!oldB || !newB) return true;
    return (
        oldB.location.x !== newB.location.x ||
        oldB.location.y !== newB.location.y ||
        oldB.size.w !== newB.size.w ||
        oldB.size.h !== newB.size.h ||
        oldB.type !== newB.type ||
        oldB.alliance?._id !== newB.alliance?._id ||
        JSON.stringify(oldB.extraData) !== JSON.stringify(newB.extraData)
    );
}

window.buildingMeshMap = new Map();
window.buildingTextSprites = new Map();
window.buildingTextures = null;

let buildingSyncVersion = 0;
export async function syncBuildings(buildings) {
    const version = ++buildingSyncVersion;

    const existing = window.buildingMeshMap;
    const newIds = new Set(buildings.map(b => b._id));
    const promises = [];

    const textures = await loadTextures();
    window.buildingTextures = textures;

    for (const id of existing.keys()) {
        if (!newIds.has(id)) {
            promises.push(deleteBuilding(id));
        }
    }

    for (const building of buildings) {
        if (existing.has(building._id)) {
            if (didBuildingChange(existing.get(building._id).userData.building, building)) {
                promises.push(updateBuilding(building, textures));
            }
        } else {
            promises.push(addBuilding(building, textures));
        }
    }

    await Promise.all(promises);
    if (version !== buildingSyncVersion) return;

    const grid = buildBuildingGrid(buildings,textures);

    window.world.grids.buildings = grid;
    

    rebuildTerritories(buildings, version);
}


function rebuildTerritories(buildings, version) {

  // defer to next frame to avoid blocking + ensure scene stability
  requestAnimationFrame(() => {
    if (version !== buildingSyncVersion) return;

    clearTerritories();
    createTerritoryMesh(buildings);
  });
}
