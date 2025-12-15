import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api"; // Ajustar ruta
import SidebarTop from "../../Dashboard/SidebarTop"; // Ajustar ruta

// ✅ Importación de los nuevos componentes
import InventoryTable from './InventoryTable';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteConfirmModal from './DeleteConfirmModal';

// --- PALETA DE COLORES Y ESTILOS CENTRALIZADOS ---
const COLORS = {
  BG_MAIN: "#081F38", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  TEXT_LIGHT: "#E0F2F1", DANGER: "#E76F51", GRID_LINE: "#1F4260",
};

const STYLES = {
  buttonGradient: {
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
  },
};

const normalize = (txt = "") =>
  txt.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim().toLowerCase();


export default function AmbulanceCurrentInventory() {
  const { unit } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Inmovilización");
  
  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [newItem, setNewItem] = useState({ category: "", id: null, name: "", quantity: 1, unit: "" });
  const [addModeData, setAddModeData] = useState({ existingId: null });
  const [editItem, setEditItem] = useState({ id: null, name: "", quantity: 1, unit: "" });

  const categories = [
    "Inmovilización", "Canalización", "Airway / Oxígeno", "Medicamentos",
    "Misceláneos", "Equipo", "Entubación",
  ];

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/ambulance-inventory/?ambulance=${unit}`);
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchInventory();
    // Opcional: Refresco en tiempo real (ej. cada 30 segundos)
    const interval = setInterval(fetchInventory, 30000); 
    return () => clearInterval(interval);
  }, [fetchInventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    if (!newItem.category) return alert("Seleccione categoría");
    if (!newItem.name.trim()) return alert("Ingrese nombre");

    try {
      if (addModeData.existingId) {
        // Añadir stock
        const existing = inventory.find(i => i.id === addModeData.existingId);
        const payload = { quantity: existing.quantity + Number(newItem.quantity) };
        await api.patch(`/ambulance-inventory/${existing.id}/`, payload);
      } else {
        // Crear nuevo item
        const payload = {
          ambulance: unit,
          name: newItem.name.trim(),
          unit: newItem.unit.trim(),
          quantity: Math.max(1, Number(newItem.quantity)),
          category: newItem.category
        };
        await api.post(`/ambulance-inventory/`, payload);
      }
      fetchInventory();
      setShowAddModal(false);
      setNewItem({ category: "", id: null, name: "", quantity: 1, unit: "" });
      setAddModeData({ existingId: null });
    } catch (err) {
      console.error("Error al guardar ítem:", err.response?.data || err);
      alert("Error al guardar");
    }
  };

  const openEditModal = (item) => {
    setEditItem({ id: item.id, name: item.name, quantity: item.quantity, unit: item.unit });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editItem.name.trim()) return alert("El nombre no puede estar vacío");
    const payload = { name: editItem.name.trim(), quantity: Number(editItem.quantity) };
    try {
      await api.patch(`/ambulance-inventory/${editItem.id}/`, payload);
      setShowEditModal(false);
      fetchInventory();
    } catch (err) {
      console.error("PATCH ERROR:", err.response?.data || err);
      alert("Error al guardar cambios");
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/ambulance-inventory/${itemToDelete.id}/`);
      fetchInventory();
      setShowDeleteModal(false); 
      setItemToDelete(null); 
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const filteredInventory = inventory.filter(
    (i) => normalize(i.category) === normalize(selectedCategory)
  );

  return (
    <div className="d-flex">
      <SidebarTop />
      <div 
        style={{ 
          flexGrow: 1, 
          marginLeft: "220px", 
          backgroundColor: COLORS.BG_MAIN, 
          minHeight: "100vh", 
          padding: "50px 30px", 
          color: COLORS.TEXT_LIGHT 
        }}
      >
        
        <div style={{ position: "fixed", top: 0, left: "220px", width: "40px", height: "100%", background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", zIndex: 2, pointerEvents: "none" }} />

        <Container style={{ position: "relative", zIndex: 3 }}>
          <Row className="mb-4 pb-3 border-bottom" style={{ borderColor: COLORS.GRID_LINE }}>
            <Col className="d-flex justify-content-between align-items-center">
              <h3 style={{ color: COLORS.PRIMARY, fontWeight: 800 }}>🧰 Inventario Actual — {unit}</h3>
              <Button style={STYLES.buttonGradient} className="rounded-pill" onClick={() => navigate("/ambulances")}>
                ← Volver a Unidades
              </Button>
            </Col>
          </Row>

          {/* Renderiza la tabla y los botones de categoría/agregar */}
          <InventoryTable 
            loading={loading}
            filteredInventory={filteredInventory}
            unit={unit}
            openEditModal={openEditModal}
            confirmDelete={confirmDelete}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setShowAddModal={setShowAddModal}
          />
        </Container>
        
        {/* MODALES */}
        
        <AddItemModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          unit={unit}
          newItem={newItem}
          handleChange={handleChange}
          setAddModeData={setAddModeData}
          inventory={inventory}
          categories={categories}
          handleAddItem={handleAddItem}
          addModeData={addModeData}
          normalize={normalize}
        />

        <EditItemModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editItem={editItem}
          setEditItem={setEditItem}
          handleSaveEdit={handleSaveEdit}
        />

        <DeleteConfirmModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          itemToDelete={itemToDelete}
          executeDelete={executeDelete}
          unit={unit}
        />
      </div>
    </div>
  );
}