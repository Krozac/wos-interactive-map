import * as THREE from 'three';
import { loadTextures } from './textures.js';
import { convertWorldToLocal, showCell, hideCell } from './helpers.js';

function initControls(controls,setSelectedCell){
    controls.enableDamping = true; // Active les mouvements fluides
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25; // Réduit la vitesse du mouvement
    controls.panSpeed = 1; // Réduit la vitesse du panoramique
    controls.rotateSpeed = 0; // Désactive la vitesse de rotation
    controls.screenSpacePanning = true; // Permet le panoramique dans l'espace de l'écran
    controls.enableRotate = false; // Désactive la rotation de la scène
    controls.touches.ONE = THREE.TOUCH.PAN; 
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', onMouseClick);

    async function onMouseClick(event){
         if (event.target !== window.renderer.domElement) {
        return; // Ignore the event if it's not the canvas
    }

    // Calcul des coordonnées normalisées de la souris (de -1 à 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Créer un rayon partant de la caméra et passant par la souris
    raycaster.setFromCamera(mouse, window.camera);

    // Vérifier les intersections avec le plan
    const intersects = raycaster.intersectObject(window.plane);

    if (intersects.length > 0) {
        
        
        hideCell()
        // Récupérer les coordonnées du point d'intersection
        const intersectPoint = intersects[0].point;

        // Convertir ce point en coordonnées locales par rapport au plan
        const localPoint = convertWorldToLocal(intersectPoint,window.plane);

        // Round to the nearest cell center in local coordinates
        const cellX = Math.floor(intersectPoint.x) +0.5;
        const cellY = Math.floor(intersectPoint.y) +0.5;
        const LocalX = Math.floor(localPoint.x) ;
        const LocalY = Math.floor(localPoint.y) ;

        console.log(setSelectedCell);
        setSelectedCell({
            x: LocalX,
            y: LocalY,
            status: "Toundra", // or whatever status you detect
            img: "/img/banner/tundra.png", // or default fallback
            add1: window.grid[LocalX][LocalY] ? window.grid[LocalX][LocalY]: "",
            add2: "", // fill in if needed
        });


        window.selectedbuilding = undefined;
        window.planeSelected.scale.x = 1;
        window.planeSelected.scale.y = 1;
        window.planeSelected.position.set(cellX, cellY, 0);

        if (window.grid[LocalX][LocalY]){
            let cell = window.grid[LocalX][LocalY]

        setSelectedCell({
            x: cell.positionx,
            y: cell.positiony,
            status: cell.building.type, // or whatever status you detect
            img: cell.path, // or default fallback
            add1: cell,
            add2: "", // fill in if needed
        });

            /*
            document.getElementById("status").innerHTML = cell.building.type;
            document.getElementById("x").innerHTML = "x: " + cell.positionx;
            document.getElementById("y").innerHTML = "y: " + cell.positiony;
            document.getElementById("img-cell").src = cell.path;
            */
            window.selectedbuilding = window.grid[LocalX][LocalY];
            
            window.planeSelected.scale.x = cell.building.size.w;
            window.planeSelected.scale.y = cell.building.size.h;
            
            const scaleOffsetX = cell.building.size.w / 2; // Half the width
            const scaleOffsetY = cell.building.size.h / 2; 
            
            const anchorCornerX = scaleOffsetX; // Anchor on bottom-left
            const anchorCornerY = scaleOffsetY;

            window.planeSelected.position.set(
                cell.building.location.x  + anchorCornerX,
                cell.building.location.y + anchorCornerY,
                0
            );
            
            

        }
        else if (LocalX > 552 && LocalX < 648 && LocalY > 552 && LocalY < 648) {
            document.getElementById("status").innerHTML = "Ruins";
        }
        else if (LocalX > 450 && LocalX < 750 && LocalY > 450 && LocalY < 750) {
            document.getElementById("status").innerHTML = "Terre Fertile";
        } else if (LocalX > 300 && LocalX < 900 && LocalY > 300 && LocalY < 900) {
            document.getElementById("status").innerHTML = "Toundra";
            document.getElementById("img-cell").src = "/img/banner/tundra.png";
        } else {
            document.getElementById("status").innerHTML = "Banquise";
            document.getElementById("img-cell").src = "/img/banner/icelands.png";
        }
        
        window.selectedcellcontent = window.grid[LocalX][LocalY];
        let building = window.buildingTypeSelected;
        let arrow = document.getElementById("triangle");
        
        
        
        showCell();
        // Get the screen coordinates of the cell center
        const cellPosition = new THREE.Vector3(cellX, cellY, 0);
        const projectedPosition = cellPosition.project(window.camera);

        const screenX = (projectedPosition.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (1 - (projectedPosition.y * 0.5 + 0.5)) * window.innerHeight;
        
        const windowWidth = window.innerWidth;
        //const windowHeight = window.innerHeight;

        let celldiv = document.getElementById("Cell");
        const cellWidth = celldiv.offsetWidth / 2;
        const cellHeight = celldiv.offsetHeight;

        // Position the div based on the cell's center in screen space
        let left = screenX - cellWidth;
        let top = screenY - cellHeight -10 ; // Center vertically relative to the cell
        arrow.style.transform = 'rotate(180deg)';

        if (screenX - cellWidth < 0) {
            left = screenX + cellWidth/2 -60; 
        }
        if (screenX + cellWidth > windowWidth) {
            left = screenX - cellWidth*2 +30 ; 
        }
        if (screenY - cellHeight - 10 < 0) {
            top = screenY + 20; 
            arrow.style.transform = 'rotate(0deg)';
        }
    
        celldiv.style.left = left+'px';
        celldiv.style.top = top+'px';


        arrow.style.left = (screenX-5)+'px';
        arrow.style.top = screenY+'px';

        console.log(building);
        if (!window.grid[LocalX][LocalY] && building?.value != undefined){
            
            window.scene.remove(window.ghostbuildingmesh)
            const textures = await loadTextures();
            const texture = textures[building.value].texture;
            texture.center.set(0.5, 0.5); // Center the rotation point
            texture.rotation = -Math.PI / 4;
            const geometry = new THREE.PlaneGeometry(building.width, building.height); 
            
            const material = new THREE.MeshBasicMaterial({
                map: texture, // Apply the loaded texture
                side: THREE.DoubleSide,
                transparent: true, // Enable transparency 
                opacity:0.5,
                depthTest: false, // Optional: prevents depth testing for transparent objects
            });
            let newghostbuildingmesh = new THREE.Mesh(geometry, material);
            newghostbuildingmesh.position.set(cellX + (building.width/2) -0.5, cellY + (building.height/2) -0.5, 0); // Adjust the position based on the size
            newghostbuildingmesh.rotation.set(Math.PI/16,-Math.PI/16,0)  
            window.ghostbuildingmesh =  newghostbuildingmesh;
            // Add the building mesh to the scene
            window.scene.add(window.ghostbuildingmesh);

        }
        else{
            window.scene.remove( window.ghostbuildingmesh)
        }
    }
   
}
}

export { initControls }