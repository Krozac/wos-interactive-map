import React from 'react';

export default function CellPopup({ cell, onAdd, onEdit, onDelete }) {
  console.log("CellPopup rendered with cell:", cell);
  return (
    <div id="Cell" className="cell-popup" style={{ display: cell ? 'block' : 'none' }}>
      <div id="addBuildingBtn" onClick={() => onAdd?.('add')} className="icon-button">
        <i className="fas fa-plus"></i>
      </div>
      <div id="editBuildingBtn" onClick={() => onEdit?.('edit')} className="icon-button">
        <i className="fas fa-pen"></i>
      </div>
      <div id="deleteBuildingBtn" onClick={onDelete} className="icon-button">
        <i className="fas fa-minus"></i>
      </div>

      <div id="banner">
        <img id="img-cell" src={cell?.img || "img/banner/icelands.png"} alt="Banner" />
        <div id="coordinates">
          <p id="x">x:{cell?.x ?? 0}</p>
          <p id="y">y:{cell?.y ?? 0}</p>
        </div>
      </div>

      <p id="status">{cell?.status || "Inconnu"}</p>
      <p id="add1">{cell?.add1?.building?.extraData?.name || ""}</p>
      <p id="add2">{cell?.add2 || ""}</p>
    </div>
  );
}
