// src/components/Medication/ItemSelector.jsx
import React from 'react';

// ⚙️ Catálogo de categorías de EQUIPO visibles en UI (coinciden con tu backend)
const EQUIPMENT_CATEGORIES = [
  "Inmovilización", "Canalización", "Airway / Oxígeno", "Equipo", 
  "Entubación", "Misceláneos", "Ventilacion & Monitor", "Equipo / Vitales",
];

export default function ItemSelector({
  category, handleCategoryChange,
  equipmentCategory, handleEquipmentCategoryChange,
  filteredItems,
  item, setItem,
  quantity, setQuantity,
  handleAdd,
}) {
  const isEquipment = category === "Equipo";

  return (
    <div className="row g-3 align-items-end mb-4">
      <div className="col-12 col-md-3">
        <label className="form-label fw-semibold text-white">Categoría</label>
        <select
          className="form-select shadow-sm"
          value={category}
          onChange={handleCategoryChange}
        >
          <option>Medicamento</option>
          <option>Equipo</option>
        </select>
      </div>

      {isEquipment && (
        <div className="col-12 col-md-3">
          <label className="form-label fw-semibold text-white">Categoría de Equipo</label>
          <select
            className="form-select shadow-sm"
            value={equipmentCategory}
            onChange={handleEquipmentCategoryChange}
          >
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      <div className={`col-12 col-md-${isEquipment ? "4" : "6"}`}>
        <label className="form-label fw-semibold text-white">
          {category}
        </label>
        <select
          className="form-select shadow-sm"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        >
          {filteredItems.map((i) => (
            <option key={i.id || i.name}>{i.name}</option>
          ))}
        </select>
      </div>

      <div className="col-6 col-md-2">
        <label className="form-label fw-semibold text-white">Cantidad</label>
        <input
          type="number"
          className="form-control shadow-sm"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="col-6 col-md-2 d-grid">
        <button type="button" className="btn btn-primary fw-semibold shadow-sm" onClick={handleAdd}>
          ➕ Agregar
        </button>
      </div>
    </div>
  );
}