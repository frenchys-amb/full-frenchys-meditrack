// src/components/Medication/FormHeader.jsx
import React from 'react';

// ✅ Constantes (Deberías importarlas, pero las redefinimos aquí para la estructura)
export const AMBULANCE_UNITS = [
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", 
    "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17"
];
export const SHIFTS = [
    "5am - 5pm", 
    "5pm - 5am", 
    "7pm - 7am", 
    "7am - 7pm", 
    "9am - 9pm", 
    "10am - 6pm"
];

export default function FormHeader({
  patientName, setPatientName,
  paramedic, setParamedic,
  shift, setShift,
  unit, setUnit,
}) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <label className="form-label fw-semibold text-white">Nombre del Paciente</label>
        <input
          type="text"
          className="form-control shadow-sm"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>

      <div className="col-12 col-md-4">
        <label className="form-label fw-semibold text-white">Paramédico</label>
        <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Nombre del paramédico"
            value={paramedic}
            onChange={(e) => setParamedic(e.target.value)}
        />
      </div>

      <div className="col-6 col-md-2">
        <label className="form-label fw-semibold text-white">Turno</label>
        <select
          className="form-select shadow-sm"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        >
          {SHIFTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="col-6 col-md-2">
        <label className="form-label fw-semibold text-white">Unidad</label>
        <select
          className="form-select shadow-sm"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="">Selecciona</option>
          {AMBULANCE_UNITS.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}