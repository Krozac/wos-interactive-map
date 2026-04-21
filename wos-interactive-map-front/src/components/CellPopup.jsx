import React, { useState, useEffect  } from 'react';
import { useTranslation } from "react-i18next";

export default function CellPopup({ cell, onAdd, onEdit, onDelete, canPlaceHere }) {
  console.log("CellPopup rendered with cell:", cell);
  const { t } = useTranslation();

  const info = !canPlaceHere && window.buildingTypeSelected != null  ? t("buildings.cantplace") : "";

  const isEditable = (cell) => {
    return cell?.add1?.building != undefined && cell?.add1?.owner != "obstacle" && cell?.add1?.owner != "ressource" 
  } 

  const isDeletable = (cell) => {
    return cell?.add1?.building != undefined && cell?.add1?.owner != "obstacle"  && cell?.add1?.owner != "ressource" 
  }

  const isCreatable = (cell) =>{
    let r = cell?.add1?.building == undefined && window.buildingTypeSelected != null && canPlaceHere;
    return r
  }

  return (
    <>
    <div id="Cell" className="cell-popup" style={{ display: cell ? 'block' : 'none' }}>

      {(isCreatable(cell)) && <div id="addBuildingBtn" onClick={() => onAdd?.('add')} className="icon-button">
        <i className="fas fa-plus"></i>
      </div>}
      {(isEditable(cell))  && <div id="editBuildingBtn" onClick={() => onEdit?.('edit')} className="icon-button">
        <i className="fas fa-pen"></i>
      </div>}
      {(isDeletable(cell))  && <div id="deleteBuildingBtn" onClick={onDelete} className="icon-button">
        <i className="fas fa-minus"></i>
      </div>}

      <div id="banner">
        <img id="img-cell" src={cell?.img || "img/banner/icelands.png"} alt="Banner" />
        <div id="coordinates" translate="no">
          <p id="x" translate="no" >x:{cell?.x ?? 0}</p>
          <p id="y" translate="no" >y:{cell?.y ?? 0}</p>
        </div>
      </div>

      <p id="status">{cell?.displayName ? t(cell?.displayName) : ""}</p>
      <p id="add1">{cell?.add1?.building?.extraData?.name || ""}</p>
      <p id="add2">{cell?.add2 || ""}</p>

      <p id="info">{info}</p>
    </div>
    </>
  );
}
