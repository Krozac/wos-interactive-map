import * as THREE from 'three';
import { checkIfCellsAreFree, occupyCells } from './helpers.js';

export function createEntityMesh({
    texture,
    width,
    height,
    renderOrder = 1,
    identifier,
    transparent = true,
    alphaTest = 0.5,
    blending = null,
}){
    const geometry = new THREE.PlaneGeometry(width, height);
    const material =  new THREE.MeshBasicMaterial({
        map : texture,
        side : THREE.DoubleSide,
        transparent,
        alphaTest,
        depthTest: false,
        blending: blending || THREE.NormalBlending
    })

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = renderOrder;
    mesh.identifiant = identifier;

    return mesh;
}

export function positionOnGrid(mesh, x, y, w, h) {
    mesh.position.set(x + w / 2, y + h / 2, 0);
    mesh.rotation.set(Math.PI / 16, -Math.PI / 16, 0);
}

export function placeEntityOnGrid({
    grid,
    x,
    y,
    w,
    h,
    type,
    data,
    texturePath,
    TerritoryW = w,
    TerritoryH = h,
    displayName
}) {
    occupyCells(x, y, w, h, type, data, texturePath, grid, TerritoryW, TerritoryH ,displayName);
    return true;
}