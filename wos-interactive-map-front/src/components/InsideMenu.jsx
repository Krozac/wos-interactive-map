import React from 'react';
import BuildingsPanel from './Menus/BuildingsPanel';
import UserPanel from './Menus/UserPanel';
import TerritoryPanel from './Menus/TerritoryPanel';
import AlliancePanel from './Menus/AlliancePanel';
import GiftPanel from './Menus/GiftPanel';

export default function InsideMenu({   active,
  setSelectedBuildingType,
  selectedBuildingType
}) {
  return (
    <div id="InsideMenu">
      <div className={active === 'Buildings' ? 'visible' : ''}>
        <BuildingsPanel onSelect={setSelectedBuildingType}
          selectedBuildingType={selectedBuildingType}/>
      </div>
      <div className={active === 'Users' ? 'visible' : ''}>
        <UserPanel />
      </div>
      <div className={active === 'Gift' ? 'visible' : ''}>
        <GiftPanel />
      </div>
      <div className={active === 'Furnace-Placed' ? 'visible' : ''}>
        <TerritoryPanel />
      </div>
        <div className={active === 'Alliance' ? 'visible' : ''}>
        <AlliancePanel />
      </div>
    </div>
  );
}
