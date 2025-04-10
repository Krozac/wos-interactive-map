let lastTouchDistance = 0;
import * as THREE from 'three';
import {showCell, hideCell } from './helpers.js';
function setupCamera(camera) {
    camera.position.set(-448, -414 , 1000); // Position de la caméra (fixe en hauteur)
    camera.rotation.x = 0; 
    camera.rotation.y = 0
    camera.rotation.z = 0
}

function cameraControls(camera, controls, scene) {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    window.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('resize', handleResize);
    
    function handleResize(event){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    
    function handleTouchStart(event) {
        if (event.touches.length === 2) {
            lastTouchDistance = getTouchDistance(event.touches);
        }
    }

    function handleTouchMove(event) {
        if (event.touches.length === 2) {
            const currentTouchDistance = getTouchDistance(event.touches);
            adjustZoom(currentTouchDistance, window.camera);
            lastTouchDistance = currentTouchDistance;
        }
    }

    function handleTouchEnd() {
        lastTouchDistance = 0;
    }

    function adjustZoom(currentTouchDistance, camera) {
        const zoomFactor = 0.5;
        const currentFOV = camera.fov;
        let newFOV = currentFOV - zoomFactor * (currentTouchDistance - lastTouchDistance);
        camera.fov = Math.min(Math.max(0.5, newFOV), 80);
        camera.updateProjectionMatrix();
    }
    
    function handleMouseDown(event){
        if (event.button === 2) { 
            window.camera.isDragging = true;
        }
    }
    function handleMouseMove(event){
        if (window.camera.isDragging) {
            hideCell();
        }
    }
    function handleMouseUp(event){
        if (event.button === 0) { // Left mouse button
             window.camera.isDragging = false;
        }
    }
    
    function handleMouseWheel(event){
        event.preventDefault();
            if (event.target !== window.renderer.domElement) {
            return; // Ignore the event if it's not the canvas
        }

        hideCell();
        // Get the current camera FOV
        const currentFOV = camera.fov;
        let newDivisions;
        // Adjust the zoom factor based on the direction of the wheel scroll
        let zoomFactor = event.deltaY * 0.05; // Adjust the zoom speed factor

        // When the camera is zoomed in close (small FOV), slow down the zooming further
        if (currentFOV < 2) {
            newDivisions = 1200;
            zoomFactor *= 0.01; // Further reduce zoom speed when close-up
        } 
        else if (currentFOV < 10) {
            newDivisions = 600;
            zoomFactor *= 0.1; // Further reduce zoom speed when close-up
        } else if (currentFOV < 30) {
            newDivisions = 40;
            zoomFactor *= 0.3; // Slightly slower zoom speed as FOV gets smaller
        } else{
             newDivisions = 20;
        }

        // Calculate the new FOV
        let newFOV = currentFOV + zoomFactor;

        // Constrain the FOV to be at least 0.01 (very close zoom)
        newFOV = Math.min(Math.max(0.5, newFOV),80);  // Allow extremely low FOVs, but no less than 0.01

        // Apply the new FOV
        camera.fov = newFOV;
        camera.updateProjectionMatrix(); // Apply the FOV change to the camera


        window.scene.remove(window.gridHelper);
        let gridHelper = new THREE.GridHelper(1200, Math.min(1200,newDivisions), 0x000000, 0x888888);
        gridHelper.rotation.x = Math.PI / 2; // Keep the grid aligned with the plane
        window.gridHelper = gridHelper;
        window.scene.add(window.gridHelper);
        

        window.controls.update(); // Ensure controls are updated after manual zooming
    }


}

function centerCameraOn(x,y){
    hideCell();
    camera.position.set(-448+x,-414+y);
}

function getTouchDistance(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

export { setupCamera, cameraControls ,centerCameraOn};
