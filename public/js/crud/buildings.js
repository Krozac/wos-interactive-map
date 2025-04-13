import * as THREE from 'three';
import { convertLocalToWorld, convertWorldToLocal } from '../three/helpers.js'
import { showBuildings } from '../three/building.js'
import { centerCameraOn } from '../three/camera.js'

export async function addBuildingFurnace() {

    const form = document.getElementById("FurnaceForm");

    // Extract values from form inputs
    const name = document.getElementById("inputnamefurnace").value;
    const xLocal = parseFloat(document.getElementById("inputxfurnace").value);  // Local x-coordinate
    const yLocal = parseFloat(document.getElementById("inputyfurnace").value);  // Local y-coordinate
    const selectElement = document.getElementById("inputalliancefurnace");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const alliance = selectedOption.getAttribute("v-acro");
    
    // Validate inputs
    if (isNaN(xLocal) || isNaN(yLocal) || !name) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Convert local x, y to world coordinates
    const pointLocal = new THREE.Vector3(xLocal, yLocal, 0);  // Assuming a 2D plane, so z = 0
    const pointWorld = convertLocalToWorld(pointLocal,window.plane);  // Convert to world coordinates

    // Prepare extra data for furnace (e.g., name and alliance)
    const extraData = {
        name: name,
        alliance: alliance,  // Optional
    };

    // Now use the world coordinates for the furnace's location
    const xWorld = pointWorld.x;
    const yWorld = pointWorld.y;

    // Call addBuilding function with the world coordinates

    const result = await addBuilding(xWorld, yWorld, "Furnace", 2, 2, extraData);

}

export async function addBuildingHQ() {

    const form = document.getElementById("HQForm");

    // Extract values from form inputs
    const xLocal = parseFloat(document.getElementById("inputxhq").value);  // Local x-coordinate
    const yLocal = parseFloat(document.getElementById("inputyhq").value);  // Local y-coordinate
    const selectElement = document.getElementById("inputalliancehq");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const alliance = selectedOption.getAttribute("v-acro");
    const color = selectedOption.getAttribute("v-color");

    // Validate inputs
    if (isNaN(xLocal) || isNaN(yLocal)) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Convert local x, y to world coordinates
    const pointLocal = new THREE.Vector3(xLocal, yLocal, 0);  // Assuming a 2D plane, so z = 0
    const pointWorld = convertLocalToWorld(pointLocal,window.plane);  // Convert to world coordinates

    // Prepare extra data for furnace (e.g., name and alliance)
    const extraData = {
        alliance: alliance,
        territory: {w:15,h:15,color:color}
    };

    // Now use the world coordinates for the furnace's location
    const xWorld = pointWorld.x;
    const yWorld = pointWorld.y;

    // Call addBuilding function with the world coordinates
    await addBuilding(xWorld, yWorld, "HQ", 3, 3, extraData);
}

export async function addBuildingBanner() {

    const form = document.getElementById("BannerForm");

    // Extract values from form inputs
    const xLocal = parseFloat(document.getElementById("inputxbanner").value);  // Local x-coordinate
    const yLocal = parseFloat(document.getElementById("inputybanner").value);  // Local y-coordinate
    const selectElement = document.getElementById("inputalliancebanner");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const alliance = selectedOption.getAttribute("v-acro");
    const color = selectedOption.getAttribute("v-color");

    // Validate inputs
    if (isNaN(xLocal) || isNaN(yLocal)) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Convert local x, y to world coordinates
    const pointLocal = new THREE.Vector3(xLocal, yLocal, 0);  // Assuming a 2D plane, so z = 0
    const pointWorld = convertLocalToWorld(pointLocal,window.plane);  // Convert to world coordinates

    // Prepare extra data for furnace (e.g., name and alliance)
    const extraData = {
        alliance: alliance,
        territory: {w:7,h:7,color:color}
    };

    // Now use the world coordinates for the furnace's location
    const xWorld = pointWorld.x;
    const yWorld = pointWorld.y;

    // Call addBuilding function with the world coordinates
    await addBuilding(xWorld, yWorld, "Banner", 1, 1, extraData);
}

async function addBuilding(x, y, type, w, h, extraData = {}) {
    const token = getCookie("authToken");
    const toast = new Toast();
    const username = JSON.parse(getCookie("playerData")).nickname;
    
    if (isNaN(x) || isNaN(y)) {
        alert('Veuillez remplir tous les champs correctement.');
        return false;
    }

    const location = { x, y };
    const size = { w, h };
    
    try {
        const response = await fetch('/api/buildings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ location, size, type, addedBy: username, extraData: extraData }),
        });

        const result = await response.json();
        if (response.ok) {
            toast.show('Building added successfully', 'success', 5000);
            return true;
        } else {
            toast.show('Error adding building', 'error', 5000);
            return false;
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        alert('Erreur réseau lors de l\'ajout du bâtiment.');
        return false;
    } finally {
        await showBuildings();
    }
}


export async function fetchBuildings() {
    const token = getCookie("authToken")
    const response = await fetch('/api/buildings',{ 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${token}`}
    });
    const result = await response.json();
    if (response.ok) {
        //console.log('Buildings fetched:', result.buildings);
        return result.buildings;
    } else {
        console.error('Error fetching buildings:', result.message);
    }
}

export async function deleteBuilding(id) {
    const token = getCookie("authToken");
    const toast = new Toast();
    try {
        const response = await fetch(`/api/buildings/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            console.log('Building deleted');
            toast.show('Building deleted successfully', 'success', 5000);
        } else {
            const errorData = await response.json();
            console.error('Error deleting building:', errorData);
            toast.show('Error deleting building', 'error', 5000);
            return; // Arrêter l'exécution si la suppression a échoué
        }
    } catch (error) {
        console.error('Network error:', error);
        return; // Arrêter l'exécution en cas d'erreur réseau
    }
    await showBuildings(); // Attendre la réponse avant d'afficher les bâtiments
}

export async function updateBuilding(id, x, y, type, w, h, extraData = {}) {
    const token = getCookie("authToken");
    const username = JSON.parse(getCookie("playerData")).nickname;

    if (isNaN(x) || isNaN(y)) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    const location = { x, y };
    const size = { w, h };
    try {
        const response = await fetch(`/api/buildings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ location, size, type, addedBy: username, extraData }),
        });

        const result = await response.json();
        if (response.ok) {
            //console.log('Building updated:', result.building);
            //alert('Bâtiment mis à jour avec succès.');
        } else {
            console.error('Error updating building:', result.message);
            alert('Erreur lors de la mise à jour du bâtiment : ' + result.message);
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        alert('Erreur réseau lors de la mise à jour du bâtiment.');
    }

    // Refresh the building list
    await showBuildings();
}

export async function updateBuildingFurnace() {

    const form = document.getElementById("FurnaceForm");

    // Extract values from form inputs
    const id = window.selectedbuilding.building._id;  // ID of the furnace to update

    const name = document.getElementById("inputnamefurnace").value;
    const xLocal = parseFloat(document.getElementById("inputxfurnace").value);  // Local x-coordinate
    const yLocal = parseFloat(document.getElementById("inputyfurnace").value);  // Local y-coordinate
    const selectElement = document.getElementById("inputalliancefurnace");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const alliance = selectedOption.getAttribute("v-acro");
    
    // Validate inputs
    if (!id || isNaN(xLocal) || isNaN(yLocal) || !name) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Convert local x, y to world coordinates
    const pointLocal = new THREE.Vector3(xLocal, yLocal, 0);  // Assuming a 2D plane, so z = 0
    const pointWorld = convertLocalToWorld(pointLocal,window.plane);  // Convert to world coordinates

    // Prepare extra data for furnace (e.g., name and alliance)
    const extraData = {
        name: name,
        alliance: alliance,  // Optional
    };

    // Now use the world coordinates for the furnace's location
    const xWorld = pointWorld.x;
    const yWorld = pointWorld.y;

    // Call updateBuilding function with the world coordinates and updated data
    await updateBuilding(id, xWorld, yWorld, "Furnace", 2, 2, extraData);
}



function addFurnaceToDiv(building) {
    const buildingsContainer = document.getElementById('furnace-list');
    
    if (!buildingsContainer || building.type !="Furnace") {
        return;
    }
    
    // Create a new building card
    const buildingCard = document.createElement('div');
    buildingCard.classList.add('building-card'); // Add a CSS class for styling

    // Add building details
    const buildingContent = `
        <img src="/img/furnace.png" style="width: 50px; height: 50px; filter: brightness(0) invert(1); float:left;" >
        <h3 style="margin: 0 0 2px;">${building.extraData.name +"  "+building.extraData.alliance}</h3>
        <p id="building-location-${building.location.x}-${building.location.y}" style="cursor: pointer; color: blue;">
            (${building.location.x}, ${building.location.y})
        </p>
    `;
    
       buildingCard.innerHTML = buildingContent;
    // Add the building card to the container
    buildingsContainer.appendChild(buildingCard);
    
        const locationElement = document.getElementById(`building-location-${building.location.x}-${building.location.y}`);
    locationElement.addEventListener('click', () => {
       centerCameraOn(building.location.x, building.location.y);
    });
}

export function loadFurnaces(buildings){
    console.log(buildings);
    const furnaces = buildings
        .filter(building => building.type === "Furnace")
        .sort((a, b) => a.extraData.name.localeCompare(b.extraData.name));;
    furnaces.forEach(furnace=>{
        addFurnaceToDiv(furnace);
    })

    document.getElementById('search-bar').addEventListener('input', () => {
        const buildingsContainer = document.getElementById('furnace-list');
        const searchBar = document.getElementById('search-bar');
        const searchValue = searchBar.value.toLowerCase();
    
        // Clear the current list
        buildingsContainer.innerHTML = '';
    
        // Re-add furnaces that match the search criteria
        const furnaces = buildings.filter(building => building.type === "Furnace");
        furnaces.forEach(furnace => {
            if (
                !searchValue ||
                furnace.extraData.name.toLowerCase().startsWith(searchValue) ||
                furnace.extraData.alliance.toLowerCase().startsWith(searchValue)
            ) {
                addFurnaceToDiv(furnace);
            }
        });
    });
}



export async function addBuildingTrap() {

    const form = document.getElementById("TrapForm");

    // Extract values from form inputs
    const xLocal = parseFloat(document.getElementById("inputxtrap").value);  // Local x-coordinate
    const yLocal = parseFloat(document.getElementById("inputytrap").value);  // Local y-coordinate
    const selectElement = document.getElementById("inputalliancetrap");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const alliance = selectedOption.getAttribute("v-acro");
    
    // Validate inputs
    if (isNaN(xLocal) || isNaN(yLocal)) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Convert local x, y to world coordinates
    const pointLocal = new THREE.Vector3(xLocal, yLocal, 0);  // Assuming a 2D plane, so z = 0
    const pointWorld = convertLocalToWorld(pointLocal,window.plane);  // Convert to world coordinates

    // Prepare extra data for furnace (e.g., name and alliance)
    const extraData = {
        alliance: alliance,
    };

    // Now use the world coordinates for the furnace's location
    const xWorld = pointWorld.x;
    const yWorld = pointWorld.y;

    // Call addBuilding function with the world coordinates
    await addBuilding(xWorld, yWorld, "Trap", 3, 3, extraData);
}