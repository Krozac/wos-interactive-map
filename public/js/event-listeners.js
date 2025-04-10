import { deleteBuilding } from '/js/crud/buildings.js';

export function setupEventListeners() {
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        document.cookie = 'authToken=; path=/; max-age=0';
        window.location.href = '/login';
    });

    document.getElementById('deleteBuildingBtn').onclick = function() {
        if (window.selectedbuilding) {
            deleteBuilding(window.selectedbuilding.building._id);
        }
    };

    const buildings = document.querySelectorAll('.Building');
    buildings.forEach(building => {
        building.addEventListener('click', selectBuilding);
    });
}
    
 export function selectBuilding(event) {
        const selectedBuilding = event.currentTarget;
        const buildings = document.querySelectorAll('.Building');

        // If the clicked building is already selected, deselect it
        if (selectedBuilding.classList.contains('selected')) {
            selectedBuilding.classList.remove('selected');

            // Clear the attributes of the "BuildingType" element
            const buildingType = document.getElementById("BuildingType");
            buildingType.removeAttribute('value');
            buildingType.removeAttribute('width');
            buildingType.removeAttribute('height');
        } else {
            // Otherwise, select the clicked building
            buildings.forEach(building => {
                building.classList.remove('selected');
            });

            // Update the "BuildingType" element with the new selection
            document.getElementById("BuildingType").setAttribute('value', selectedBuilding.getAttribute('value'));
            document.getElementById("BuildingType").setAttribute('width', selectedBuilding.getAttribute('width'));
            document.getElementById("BuildingType").setAttribute('height', selectedBuilding.getAttribute('height'));

            selectedBuilding.classList.add('selected');
        }
    }