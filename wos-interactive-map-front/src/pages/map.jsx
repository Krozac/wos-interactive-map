import React, { useState, useEffect  } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import InsideMenu from '../components/InsideMenu';
import CellPopup from '../components/CellPopup';
import MapContainer from '../components/MapContainer'; // your leaflet or three map
import ToggleButton from '../components/ToggleButton';
import BuildingForm from '../components/Forms/BuildingForm';
import { useBuildings } from "../hooks/useBuildings";
import { useGuilds } from '../hooks/useGuilds';

import { updateGhostBuilding } from '../three/controls';

import '../styles/map.css';

export default function MapPage() {
  const [activePanel, setActivePanel] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState(null);
  const [formMode, setFormMode] = React.useState(null); // 'add' or 'edit'
  const [canPlaceHere, setCanPlaceHere] = useState(window.CanPlaceHere);

  const { buildings, fetchBuildings, addBuilding, updateBuilding, deleteBuilding} = useBuildings();

  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    fetch('/api/users/me', {
      credentials: 'include'
    }).then(res => {
      if (res.status === 401) {
        window.location.href = '/login';
      }
    });
  }, []);

  //const { deleteBuilding } = useBuildings();
  const handleAdd = () => setFormMode('add');
  const handleEdit = () => {
    if (selectedCell && selectedCell.add1 && selectedCell.add1.building) {
      selectedCell.add1.building.value = selectedCell.add1.building.type; 
      setSelectedBuildingType(selectedCell.add1.building); 
      setFormMode('edit');            
    }
  };
  const handleDelete = async () => {
    if (selectedCell && selectedCell.add1) {
            await deleteBuilding(selectedCell.add1.building._id);
            console.log(`Deleting Building with ID: ${selectedCell.add1.building._id}`);
      }
    
    //showBuildings();
  };
  const handleFormClose = () => {
    setFormMode(null);
  };
  const handleBuildingSelect = (building) => {
    setSelectedBuildingType(building);
  };

  useEffect(() => {
    updateGhostBuilding();
  }, [selectedBuildingType]);

  useEffect(() => {
    const handler = (e) => {
      setCanPlaceHere(e.detail);
    };

    window.addEventListener("canPlaceHereChanged", handler);

    return () => {
      window.removeEventListener("canPlaceHereChanged", handler);
    };
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('PlayerData');
    if (storedData) {
      setPlayerData(JSON.parse(storedData));
    }
  }, []);
  return (
    <div id="mainContent">
      <Header user={playerData || {}} onEdit={() => {}} />
      <div id="triangle" style={{display: 'none'}}></div>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <MapContainer buildings={buildings} onCellSelect={setSelectedCell} setLoading={setLoading} />
      <div id="Menu">
        <SideMenu selectedKey={activePanel} onSelect={setActivePanel} />
          <InsideMenu
        active={activePanel}
        // instead of setSelectedBuilding, pass this:
        setSelectedBuildingType={(b) => {
          setSelectedBuilding(b);
          handleBuildingSelect(b);
        }}
        selectedBuildingType={selectedBuildingType}
      />
      </div>
      <CellPopup
        cell={selectedCell}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canPlaceHere={canPlaceHere}
      />
      {formMode && selectedBuildingType && (
          <BuildingForm
            mode={formMode}
            building={selectedBuildingType}
            cell={selectedCell}
            onClose={handleFormClose}
            addBuilding={addBuilding}       // ← pass from parent
            updateBuilding={updateBuilding} // ← pass from parent
          />
        )}


      <ToggleButton onClick={() => {}} />
    </div>
  );
}