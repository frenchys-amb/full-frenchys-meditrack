// src/components/Storage/StorageCheckList.jsx

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "../../services/api";
import { Button, Modal, Form, Table, Container, Spinner, Row, Col, Card } from "react-bootstrap";
import SidebarTop from "../Dashboard/SidebarTop";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Importación de los nuevos archivos
import { COLORS, STYLES } from "./StorageStyles"; 
import StorageAlerts from "./StorageAlerts";
import StorageCategoryCards from "./StorageCategoryCards";
import { DeleteConfirmModal, EditItemModal, CategoryDetailsModal } from "./StorageModals";

// Normalizador (sin cambios, solo se hizo más robusto internamente)
const normalize = (txt = "") => 
    String(txt)
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

const CATEGORIES = [
  { value: "Inmovilización", label: "Inmovilización" },
  { value: "Canalización", label: "Canalización" },
  { value: "Airway / Oxígeno", label: "Airway / Oxígeno" },
  { value: "Medicamentos", label: "Medicamentos" },
  { value: "Misceláneos", label: "Misceláneos" },
  { value: "Entubación", label: "Entubación" },
  { value: "Equipo", label: "Equipo" },
];

export default function StorageCheckList() {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Modales
  const [showModal, setShowModal] = useState(false); // Modal de Añadir
  const [showCategoryModal, setShowCategoryModal] = useState(false); // Modal de Detalles
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // Modal de Confirmación
  
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estado Inicial para el formulario de adición
  const [formList, setFormList] = useState([
    { name: "", quantity: 1, meta: 1, unit: "unidades", location: "Almacén", category: "", isNew: false },
  ]);

  // --- Funciones de Fetch y Alertas ---

  const fetchInventory = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await axios.get("/inventory/");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); } finally { if (!silent) setLoading(false); }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await axios.get("/alerts/");
      setAlerts(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setAlerts([]); }
  }, []);

  useEffect(() => {
    fetchInventory(); fetchAlerts();
    const interval = setInterval(() => { fetchInventory(true); fetchAlerts(); }, 30000);
    return () => clearInterval(interval);
  }, [fetchInventory, fetchAlerts]);

  const markAsViewed = async (id) => {
    try { await axios.patch(`/alerts/${id}/`, { viewed: true }); setAlerts((prev) => prev.filter((a) => a.id !== id)); } catch {}
  };
  
  // --- Lógica del Formulario Añadir ---

  const handleChange = (index, key, value) => {
    setFormList((prev) => {
      const updated = [...prev];
      if (key === "category") { updated[index].category = value; updated[index].name = ""; updated[index].isNew = false; return updated; }
      if (key === "name") {
        if (value === "__nuevo__") { updated[index].isNew = true; updated[index].name = ""; } 
        else if (updated[index].isNew) { updated[index].name = value; } 
        else { updated[index].isNew = false; updated[index].name = value; }
        return updated;
      }
      if (key === "quantity" || key === "meta") { updated[index][key] = value === "" ? "" : Math.max(1, Number(value)); } 
      else { updated[index][key] = value; }
      return updated;
    });
  };

  const handleAddRow = () => {
    setFormList((prev) => [...prev, { name: "", quantity: 1, meta: 1, unit: "unidades", location: "Almacén", category: "", isNew: false }]);
  };

  const handleRemoveRow = (index) => setFormList((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    try {
      for (const form of formList) {
        const normalizedName = normalize(form.name);
        if (!form.name.trim()) continue;
        const existingItem = items.find((i) => normalize(i.name) === normalizedName);

        if (existingItem) {
          const newQuantity = (existingItem.quantity || 0) + (Number(form.quantity) || 0);
          await axios.patch(`/inventory/${existingItem.id}/`, { quantity: newQuantity });
        } else {
          if (!form.category || !form.name.trim()) { alert("Faltan datos"); continue; }
          await axios.post("/inventory/", {
            name: form.name.trim(),
            quantity: Math.max(1, Number(form.quantity) || 1),
            meta: Math.max(1, Number(form.meta) || 1),
            unit: form.unit || "unidades",
            location: "Almacén",
            category: form.category,
          });
        }
      }
      await fetchInventory(); await fetchAlerts(); setShowModal(false);
      setFormList([{ name: "", quantity: 1, meta: 1, unit: "unidades", location: "Almacén", category: "", isNew: false }]);
    } catch (err) { console.error(err); alert("Error al guardar."); }
  };

  // --- Lógica de Edición y Eliminación ---

  const handleEdit = (item) => { setEditItem(item); setShowCategoryModal(false); };
  
  const handleSaveEdit = async () => {
    try {
      await axios.patch(`/inventory/${editItem.id}/`, { name: editItem.name.trim(), quantity: Number(editItem.quantity) });
      await fetchInventory(); setEditItem(null);
    } catch { alert("Error editando"); }
  };

  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { 
        await axios.delete(`/inventory/${deleteId}/`); 
        await fetchInventory(); 
        setShowDeleteAlert(false);
        setDeleteId(null);
    } catch { 
        alert("Error eliminando"); 
    }
  };
  
  // --- Memorización de Datos ---

  const groupedItems = useMemo(() => CATEGORIES.map((cat) => ({ ...cat, items: items.filter((i) => normalize(i.category) === normalize(cat.value)) })), [items]);
  const selectedCategoryItems = useMemo(() => selectedCategory ? items.filter((i) => normalize(i.category) === normalize(selectedCategory.value)) : [], [items, selectedCategory]);

  // --- Exportar PDF ---
  
  const handleExportPDF = () => {
    const doc = new jsPDF(); doc.text("Inventario Almacén", 20, 20); const rows = [];
    CATEGORIES.forEach((cat) => {
      const catItems = items.filter((i) => normalize(i.category) === normalize(cat.value));
      if (!catItems.length) return;
      rows.push([{ content: cat.label, colSpan: 4, styles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] } }]); // Estilos mejorados para PDF Dark
      catItems.forEach((i) => rows.push([i.name, i.quantity, i.unit, cat.label]));
    });
    autoTable(doc, { 
        startY: 30, 
        head: [["Nombre", "Cantidad", "Unidad", "Categoría"]], 
        body: rows,
        styles: {
            fillColor: [240, 240, 240], // color de fondo de las filas
            textColor: [0, 0, 0],       // color del texto
            lineColor: [100, 100, 100], // color de las líneas
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [20, 40, 60], // Cabecera más oscura
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        }
    });
    doc.save("Inventario.pdf");
  };


  return (
    <div className="d-flex">
      <SidebarTop />
      <div style={STYLES.MAIN_CONTAINER}>
        {/* Contenedor de Sombra/Degradado */}
        <div style={{ position: "fixed", top: 0, left: "220px", width: "40px", height: "100%", background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", zIndex: 2, pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          {/* Mensaje de carga */}
          {loading && <div className="text-info mb-3"><Spinner animation="border" size="sm"/> Cargando inventario...</div>}
          
          {/* Componente de Alertas */}
          <StorageAlerts alerts={alerts} markAsViewed={markAsViewed} loading={loading} />

          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3" style={{ borderColor: COLORS.PRIMARY_BLUE }}>
            <h2 className="fw-bold" style={{ color: COLORS.HIGHLIGHT_CYAN }}>📦 Inventario Almacén</h2>
            <div className="d-flex gap-2">
              <button style={STYLES.BUTTON_PRIMARY} className="btn" onClick={handleExportPDF}>📄 Exportar PDF</button>
              <button 
                style={STYLES.BUTTON_PRIMARY} 
                className="btn" 
                onClick={() => { 
                  setEditItem(null); 
                  setFormList([{ name: "", quantity: 1, meta: 1, unit: "Unidades", location: "Almacén", category: "", isNew: false }]); 
                  setShowModal(true); 
                }}
              >
                ➕ Añadir Ítem
              </button>
            </div>
          </div>

          {/* Componente de Tarjetas de Categorías */}
          <StorageCategoryCards 
            groupedItems={groupedItems} 
            setSelectedCategory={setSelectedCategory} 
            setShowCategoryModal={setShowCategoryModal} 
          />
          
          {/* --- MODALES (Modal Añadir se queda aquí por su estado complejo) --- */}

          {/* Modal Añadir / Agregar Stock (Lógica compleja, se mantiene aquí) */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" backdrop="static" centered>
            <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY_BLUE}, ${COLORS.CARD_BG})`, color: "#fff" }}><Modal.Title>➕ Añadir al Inventario</Modal.Title></Modal.Header>
            <Modal.Body style={{ backgroundColor: COLORS.DARK_BLUE_BG, color: "#fff" }}>
              <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "5px" }}>
                {formList.map((form, idx) => (
                  <Card key={idx} className="mb-3 border-0 shadow-sm" style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.INPUT_BORDER}` }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold" style={{ color: COLORS.HIGHLIGHT_CYAN }}>Ítem #{idx + 1}</h6>
                        {formList.length > 1 && <Button variant="outline-danger" size="sm" onClick={() => handleRemoveRow(idx)}>✕</Button>}
                      </div>

                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Label className="small text-white-50">Categoría</Form.Label>
                          <Form.Select style={STYLES.INPUT_DARK} value={form.category || ""} onChange={(e) => handleChange(idx, "category", e.target.value)}>
                            <option value="">-- Seleccionar --</option>
                            {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                          </Form.Select>
                        </Col>

                        <Col md={8}>
                          <Form.Label className="small text-white-50">Nombre del Equipo</Form.Label>
                          {form.category ? (
                            !form.isNew ? (
                              <Form.Select style={STYLES.INPUT_DARK} value={form.name || ""} onChange={(e) => handleChange(idx, "name", e.target.value)}>
                                <option value="">Seleccione o cree nuevo...</option>
                                {items.filter(i => normalize(i.category) === normalize(form.category)).map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                                <option value="__nuevo__" className="fw-bold" style={{ backgroundColor: COLORS.CARD_BG, color: COLORS.HIGHLIGHT_CYAN }}>✨ CREAR NUEVO...</option>
                              </Form.Select>
                            ) : (
                              <Form.Control style={STYLES.INPUT_DARK} type="text" placeholder="Escriba el nombre..." value={form.name || ""} onChange={(e) => handleChange(idx, "name", e.target.value)} autoFocus />
                            )
                          ) : <Form.Control style={{...STYLES.INPUT_DARK, opacity: 0.5}} disabled placeholder="Primero elija categoría" />}
                        </Col>

                        <Col md={4}>
                          <Form.Label className="small" style={{ color: COLORS.WARNING }}>📦 Stock a Añadir</Form.Label>
                          <Form.Control style={STYLES.INPUT_DARK} type="number" min={1} value={form.quantity || ""} onChange={(e) => handleChange(idx, "quantity", e.target.value)} />
                        </Col>

                        <Col md={4}>
                          <Form.Label className="small" style={{ color: COLORS.SUCCESS }}>🎯 Meta (Recomendaciones)</Form.Label>
                          <Form.Control style={form.isNew ? STYLES.INPUT_DARK : {...STYLES.INPUT_DARK, opacity: 0.5}} type="number" min={1} value={form.meta || ""} onChange={(e) => handleChange(idx, "meta", e.target.value)} disabled={!form.isNew} placeholder="Ej: 5" />
                        </Col>

                        <Col md={4}>
                          <Form.Label className="small text-white-50">Unidad</Form.Label>
                          <Form.Select style={STYLES.INPUT_DARK} value={form.unit || ""} onChange={(e) => handleChange(idx, "unit", e.target.value)}>
                            <option>Unidades</option><option>Cajas</option><option>Paquetes</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
              <div className="d-grid mt-3"><Button variant="outline-light" size="sm" onClick={handleAddRow} style={{ borderStyle: "dashed", borderColor: COLORS.HIGHLIGHT_CYAN }}>+ Añadir otro ítem</Button></div>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: COLORS.DARK_BLUE_BG, borderTop: `1px solid ${COLORS.PRIMARY_BLUE}` }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button style={STYLES.BUTTON_PRIMARY} onClick={handleSave}>💾 Guardar Todo</Button>
            </Modal.Footer>
          </Modal>

          {/* Modales Importados */}
          <EditItemModal 
            editItem={editItem} 
            setEditItem={setEditItem} 
            handleSaveEdit={handleSaveEdit} 
          />
          
          <CategoryDetailsModal 
            showCategoryModal={showCategoryModal} 
            setShowCategoryModal={setShowCategoryModal} 
            selectedCategory={selectedCategory} 
            selectedCategoryItems={selectedCategoryItems} 
            handleEdit={handleEdit} 
            requestDelete={requestDelete} 
          />

          <DeleteConfirmModal 
            showDeleteAlert={showDeleteAlert} 
            setShowDeleteAlert={setShowDeleteAlert} 
            confirmDelete={confirmDelete} 
          />

        </Container>
      </div>
    </div>
  );
}