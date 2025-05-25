import React, { useState, useEffect  } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import InsideMenu from '../components/InsideMenu';
import CellPopup from '../components/CellPopup';
import MapContainer from '../components/MapContainer'; // your leaflet or three map
import ToggleButton from '../components/ToggleButton';
import BuildingForm from '../components/Forms/BuildingForm';
import { useBuildings } from "../hooks/useBuildings";
import { showBuildings } from '../three/building';
import '../styles/map.css';

export default function MapPage() {
  const [activePanel, setActivePanel] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState(null);
  const [formMode, setFormMode] = React.useState(null); // 'add' or 'edit'
  const { deleteBuilding } = useBuildings();
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
    
    showBuildings();
  };
  const handleFormClose = () => {
    setFormMode(null);
  };
  const handleBuildingSelect = (building) => {
    setSelectedBuildingType(building);
  };
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
      <MapContainer onCellSelect={setSelectedCell} />
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
      />
      {formMode && selectedBuildingType && (
        <BuildingForm
          mode={formMode}
          building={selectedBuildingType}
          cell={selectedCell}
          onClose={handleFormClose}
          
        />
      )}

      <ToggleButton onClick={() => {}} />
    </div>
  );
}