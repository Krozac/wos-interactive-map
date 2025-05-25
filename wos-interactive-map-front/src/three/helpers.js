import * as THREE from 'three';

function checkIfCellsAreFree(x, y, width, height, grid) {
    // Loop over the cells that the building will occupy
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            // Ensure we are not going out of bounds of the grid
            if (grid[x + i] && grid[x + i][y + j] !== undefined && grid[x + i][y + j] !== null) {
                return false; // Return false if the cell is occupied
            }
        }
    }
    return true; // Return true if all the cells are free
}

function occupyCells(x, y, width, height, building, path, grid) {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            grid[x + i][y + j] = { building, path, positionx: x, positiony: y };
        }
    }
}


function getPlaneOrigin(plane) {
    const halfWidth = 1200 / 2;
    const halfHeight = 1200 / 2;

    // Définir l'origine du plan (coin inférieur gauche)
    const planeOrigin = new THREE.Vector3(-halfWidth, -halfHeight, 0); // Coin inférieur gauche

    // Convertir l'origine en coordonnées mondiales
    const planeOriginWorld = plane.localToWorld(planeOrigin);

    return planeOriginWorld;
}

function convertWorldToLocal(pointWorld,plane) {
    const planeOriginWorld = getPlaneOrigin(plane);

    // Calculer la différence entre le point et l'origine du plan (en coordonnées mondiales)
    const delta = pointWorld.clone().sub(planeOriginWorld);

    // Utiliser la matrice inverse du plan pour obtenir les coordonnées locales
    const pointLocal = plane.worldToLocal(delta);

    return pointLocal;
}

function convertLocalToWorld(pointLocal,plane) {
    const planeOriginWorld = getPlaneOrigin(plane);

    // Convert the local point to world space using the plane's local-to-world transformation
    const pointWorld = plane.localToWorld(pointLocal.clone());

    // Add the plane's origin in world coordinates to get the final position
    pointWorld.add(planeOriginWorld);

    return pointWorld;
}

function hideCell() {
  const arrow = document.getElementById("triangle");
  const celldiv = document.getElementById("Cell");
  const form = document.getElementById("Form");

  // Safely remove "activeform" class from all matching elements
  const activeForms = document.getElementsByClassName("activeform");
  if (activeForms && activeForms.length > 0) {
    Array.from(activeForms).forEach((form) => {
      form?.classList?.remove("activeform");
    });
  }

  // Safely hide each element if it exists
  if (arrow?.style) {
    arrow.style.display = "none";
  }

  if (celldiv?.style) {
    celldiv.style.display = "none";
  }

  if (form?.style) {
    form.style.display = "none";
  }
}


function showCell(){
    let arrow = document.getElementById("triangle");
    let celldiv = document.getElementById("Cell");
    arrow.style.display="block";
    celldiv.style.display="block"
}

export { checkIfCellsAreFree, occupyCells,getPlaneOrigin,convertWorldToLocal,convertLocalToWorld,hideCell,showCell };
