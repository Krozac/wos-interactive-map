
import { createEntityMesh, positionOnGrid } from "../entityRenderer";
import * as THREE from 'three';
import { attachBuildingText } from "./buildingsText.js";

export async function createBuildingMesh(building, texture) {
    const mesh = createEntityMesh({
        texture,
        width: building.size.w,
        height: building.size.h,
        renderOrder: 998,
        identifier: "building"
    });

    positionOnGrid(mesh, building.location.x, building.location.y, building.size.w, building.size.h);

    return mesh;
}

async function addBuilding(building, textures) {
    const texture = textures[building.type]?.texture;

    if (!texture) {
        return;
    }

    texture.center.set(0.5, 0.5);
    texture.rotation = -Math.PI / 4;

    const mesh = await createBuildingMesh(building, texture);

    window.scene.add(mesh);
        
    mesh.userData.building = building;
    mesh.userData.buildingId = building._id;

    window.buildingMeshMap.set(building._id, mesh)

    attachBuildingText(mesh,building,textures[building.type])

    /*
    const sprite = await createTextSprite(building, textures[building.type]);
    mesh.add(sprite);

    window.buildingTextSprites.set(building._id, {sprite, building});
*/
 
}

async function deleteBuilding(buildingId) {
    const mesh = window.buildingMeshMap.get(buildingId);
    if (!mesh) return;

    window.scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();

    window.buildingMeshMap.delete(buildingId);
}

async function updateBuilding(building, textures) {
    await deleteBuilding(building._id);
    await addBuilding(building, textures);
}

export {  addBuilding, deleteBuilding, updateBuilding};
