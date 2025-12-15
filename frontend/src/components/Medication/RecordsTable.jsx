// src/components/Medication/RecordsTable.jsx
import React from 'react';

export default function RecordsTable({ records, onDelete }) {
  if (records.length === 0) {
    return null;
  }

  return (
    <div className="table-responsive mb-4 shadow-sm rounded">
      <table className="table table-bordered table-striped align-middle text-white">
        <thead className="table-primary text-center">
          <tr>
            <th>Categoría</th>
            <th>Medicamento / Equipo</th>
            <th>Cantidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, i) => (
            <tr key={`${rec.item}-${i}`} className="text-center">
              <td>{rec.category}</td>
              <td>{rec.item}</td>
              <td>{rec.quantity}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-pill"
                  onClick={() => onDelete(i)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}