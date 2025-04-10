import * as THREE from 'three';

function initPlane(){
    
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../img/map2.png')
    console.log(texture)
    
    const geometry = new THREE.PlaneGeometry(1200, 1200); // Plan de 120000x120000 unités
    const material = new THREE.MeshBasicMaterial({
        map: texture, // Apply texture here
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.renderOrder=0;
    window.scene.add(plane);
    
    let gridHelper = new THREE.GridHelper(1200, 1, 0x000000, 0x888888); // Size: 1200, divisions: 20
    gridHelper.rotation.x = Math.PI / 2; // Make grid align with the plane
    window.scene.add(gridHelper);
    
    const geometrySelected = new THREE.PlaneGeometry(1, 1); // case de 10x10 unités
    const materialSelected = new THREE.MeshBasicMaterial({ color: 0x89CFF0, side: THREE.DoubleSide ,opacity:0.8});
    materialSelected.depthTest=false;
    const planeSelected = new THREE.Mesh(geometrySelected, materialSelected);
    planeSelected.position.set(10000,10000,0)
    planeSelected.renderOrder=999;
    scene.add(planeSelected);
    
    let ghostbuildingmesh
    
    window.ghostbuildingmesh = ghostbuildingmesh;
    
    window.gridHelper = gridHelper;
    window.plane= plane;
    window.planeSelected= planeSelected;
}

export { initPlane };