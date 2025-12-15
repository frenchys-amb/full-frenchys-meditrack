// src/components/Medication/MedicationExpenseForm.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../services/api";

// Importar los nuevos subcomponentes
import FormHeader from "./FormHeader";
import ItemSelector from "./ItemSelector";
import RecordsTable from "./RecordsTable";

// 🚨 NOTA: Las constantes AMBULANCE_UNITS, SHIFTS, y EQUIPMENT_CATEGORIES
// se han movido a FormHeader.jsx y ItemSelector.jsx para que sean usadas ahí.

// ✅ Normalizador (UI ⇄ Backend): quita acentos y normaliza espacios
const normalize = (txt = "") =>
  String(txt)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// ⚙️ Catálogo de categorías de EQUIPO visibles en UI (coinciden con tu backend)
const EQUIPMENT_CATEGORIES = [
  "Inmovilización", "Canalización", "Airway / Oxígeno", "Equipo", 
  "Entubación", "Misceláneos", "Ventilacion & Monitor", "Equipo / Vitales",
];


export default function MedicationExpenseForm() {
  // --- ESTADOS ---
  const [patientName, setPatientName] = useState("");
  const [paramedic, setParamedic] = useState(""); 
  const [shift, setShift] = useState("5am - 5pm"); // Usamos un valor inicial fijo de los nuevos SHIFTS
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("Medicamento"); 
  const [equipmentCategory, setEquipmentCategory] = useState(EQUIPMENT_CATEGORIES[0]);

  const [inventory, setInventory] = useState([]); 
  const [item, setItem] = useState(""); 
  const [quantity, setQuantity] = useState(1);

  const [records, setRecords] = useState([]); 
  const [msg, setMsg] = useState(null);

  // 🔄 Cargar inventario de la ambulancia (auto refresh cada 10s)
  const fetchInventory = useCallback(async () => {
    if (!unit) {
      setInventory([]);
      return;
    }
    try {
      const res = await api.get(`/ambulance-inventory/?ambulance=${unit}`);
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setInventory([]);
    }
  }, [unit]);

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 10000);
    return () => clearInterval(interval);
  }, [fetchInventory]);

  // 🎯 Ítems disponibles según selección (Medicamento vs Equipo)
  const filteredItems = useMemo(() => {
    if (!inventory.length) return [];

    if (category === "Medicamento") {
      return inventory.filter(
        (i) => normalize(i.category) === normalize("Medicamentos")
      );
    }

    return inventory.filter(
      (i) => normalize(i.category) === normalize(equipmentCategory)
    );
  }, [inventory, category, equipmentCategory]);

  // 🧠 Mantener "item" consistente cuando cambian filtros/datos
  useEffect(() => {
    if (!filteredItems.length) {
      setItem("");
      return;
    }
    const stillExists = filteredItems.some((i) => i.name === item);
    if (!stillExists) setItem(filteredItems[0]?.name || "");
  }, [filteredItems, item]);

  // 👂 Cambios de categoría principal
  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    
    // Lógica para preseleccionar el primer ítem
    const targetCategory = newCat === "Medicamento" ? "Medicamentos" : EQUIPMENT_CATEGORIES[0];
    if (newCat !== "Medicamento") setEquipmentCategory(EQUIPMENT_CATEGORIES[0]);

    const items = inventory.filter(
        (i) => normalize(i.category) === normalize(targetCategory)
    );
    setItem(items[0]?.name || "");
  };

  // 👂 Cambios de subcategoría de equipo
  const handleEquipmentCategoryChange = (e) => {
    const cat = e.target.value;
    setEquipmentCategory(cat);

    const eq = inventory.filter(
      (i) => normalize(i.category) === normalize(cat)
    );
    setItem(eq[0]?.name || "");
  };

  // ➕ Agregar a la lista temporal
  const handleAdd = (e) => {
    e.preventDefault();
    if (!unit || !paramedic || !paramedic.trim()) {
        setMsg({ type: "warning", text: "⚠️ Selecciona una Unidad y/o escribe el nombre del Paramédico antes de agregar ítems." });
        return;
    }
    if (!item || Number(quantity) <= 0) return;

    setRecords((prev) => [
      ...prev,
      { category, item, quantity: parseInt(quantity, 10) || 1 },
    ]);
    setQuantity(1);
    setMsg(null);
  };

  // 🗑️ Eliminar línea
  const handleDelete = (index) =>
    setRecords((prev) => prev.filter((_, i) => i !== index));

  // 🚀 Enviar a backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!patientName || !unit || !paramedic || paramedic.trim() === "") {
      setMsg({ type: "danger", text: "⚠️ Completa nombre de paciente, paramédico y unidad." });
      return;
    }
    if (records.length === 0) {
      setMsg({ type: "danger", text: "⚠️ Agrega al menos un medicamento o equipo." });
      return;
    }

    const payload = {
      patient_name: patientName,
      paramedics: [paramedic.trim()], 
      shift,
      unit,
      items: records.map((r) => ({ medicine: r.item, quantity: r.quantity })),
    };

    try {
      await api.post("/medexpenses/", payload);
      setMsg({ type: "success", text: "✅ Registro guardado correctamente." });

      // Reset
      setRecords([]);
      setPatientName("");
      setParamedic("");
      setUnit("");
      setCategory("Medicamento");
      setEquipmentCategory(EQUIPMENT_CATEGORIES[0]);
      setItem("");
      setQuantity(1);
    } catch (err) {
      console.error(err.response?.data || err);
      setMsg({
        type: "danger",
        text: `❌ Error: ${err.response?.data?.detail || "No se pudo guardar"}`,
      });
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: "#000511", position: "relative", width: "100%" }}
    >
      {/* Card principal */}
      <div
        className="card shadow-lg border-0 rounded-4 w-100"
        style={{
          maxWidth: 900,
          backgroundColor: "rgba(15,48,74,0.95)",
          border: "1px solid #0d6efd",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="card-header text-white text-center rounded-top-4 py-3"
          style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
        >
          <h4 className="mb-0 fw-bold">💊 Registro de Medicamentos y Equipos</h4>
        </div>

        <div className="card-body p-4">
          {msg && (
            <div className={`alert alert-${msg.type} shadow-sm text-center`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* 1. ENCABEZADO */}
            <FormHeader
              patientName={patientName} setPatientName={setPatientName}
              paramedic={paramedic} setParamedic={setParamedic}
              shift={shift} setShift={setShift}
              unit={unit} setUnit={setUnit}
            />

            {/* 2. SELECTOR DE ÍTEMS Y CANTIDAD */}
            <ItemSelector
              category={category} handleCategoryChange={handleCategoryChange}
              equipmentCategory={equipmentCategory} handleEquipmentCategoryChange={handleEquipmentCategoryChange}
              filteredItems={filteredItems}
              item={item} setItem={setItem}
              quantity={quantity} setQuantity={setQuantity}
              handleAdd={handleAdd}
            />

            {/* 3. TABLA DE REGISTROS TEMPORALES */}
            <RecordsTable records={records} onDelete={handleDelete} />

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-success btn-lg fw-semibold shadow-sm">
                💾 Guardar Registro
              </button>
            </div>
          </form>
        </div>

        {/* Pie de página (ELIMINADO el logo) */}
        <div className="text-center py-3">
            {/* Pie de página limpio */}
        </div>
      </div>
    </div>
  );
}