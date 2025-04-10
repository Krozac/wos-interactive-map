import { addBuildingFurnace, updateBuildingFurnace, addBuildingHQ, addBuildingBanner } from './crud/buildings.js';

document.getElementById('FurnaceForm').onsubmit = function(event) {
    event.preventDefault();
    let action = document.getElementById("Form").getAttribute("action");
    if (action === 'add') {
        addBuildingFurnace();
    } else if (action === 'edit') {
        updateBuildingFurnace();
    }
    closeForm();
};

// Autres formulaires similaires...

export function closeForm(){
            document.getElementById("Form").style.display = "none";
            Array.from(document.getElementsByClassName("activeform")).forEach((form)=>{
                form.classList.remove("activeform");
            })
       }

export function showFormBuilding(action){
        closeForm();
        let buildingtype = document.getElementById("BuildingType").getAttribute("value");
        let form
        document.getElementById("Form").setAttribute("action",action)
        if (action == 'add'){
            if (buildingtype == "Furnace") {
                form = document.getElementById("FurnaceForm")
                document.getElementById("inputxfurnace").value = document.getElementById("x").getAttribute("value");
                document.getElementById("inputyfurnace").value = document.getElementById("y").getAttribute("value");
            }
            else if (buildingtype == "HQ") {
                form = document.getElementById("HQForm")
                document.getElementById("inputxhq").value = document.getElementById("x").getAttribute("value");
                document.getElementById("inputyhq").value = document.getElementById("y").getAttribute("value");
            }
            else if (buildingtype == "Trap") {
                form = document.getElementById("TrapForm")
                document.getElementById("inputxtrap").value = document.getElementById("x").getAttribute("value");
                console.log(document.getElementById("x").getAttribute("value"))
                document.getElementById("inputytrap").value = document.getElementById("y").getAttribute("value");
            }
            else if (buildingtype == "Banner") {
                form = document.getElementById("BannerForm")
                document.getElementById("inputxbanner").value = document.getElementById("x").getAttribute("value");
                document.getElementById("inputybanner").value = document.getElementById("y").getAttribute("value");
            }
            else {return;}

        }else if (action='edit'){
            if ( window.selectedbuilding && window.selectedbuilding.building.type == "Furnace") {
                form = document.getElementById("FurnaceForm")
                document.getElementById("inputnamefurnace").value = window.selectedbuilding.building.extraData.name;
                document.getElementById("inputxfurnace").value = window.selectedbuilding.positionx;
                document.getElementById("inputyfurnace").value = window.selectedbuilding.positiony;
            }
        }
        form.classList.add("activeform");
        document.getElementById("Form").style.display = "block";
   }

                
            