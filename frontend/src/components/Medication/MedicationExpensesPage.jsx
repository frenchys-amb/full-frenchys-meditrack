import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { Button, Container, Row, Col } from "react-bootstrap";
import SidebarTop from "../Dashboard/SidebarTop";

// ✅ Importación de los nuevos componentes
import ExpensesTable from './ExpensesTable';
import ExpenseDetailModal from './ExpenseDetailModal';
import ConfirmationModal from './ConfirmationModal';


// --- PALETA DE COLORES Y ESTILOS CENTRALIZADOS ---
const COLORS = {
  BG_MAIN: "#081F38",           
  PRIMARY: "#00B4D8",           
  SECONDARY: "#09B59F",         
  TEXT_LIGHT: "#E0F2F1",        
  DANGER: "#E76F51",            
  GRID_LINE: "#1F4260",         
};

const STYLES = {
  buttonGradient: {
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
    boxShadow: `0 4px 10px rgba(0, 180, 216, 0.2)`,
  },
  mainContainer: {
    flexGrow: 1, 
    marginLeft: "220px", 
    backgroundColor: COLORS.BG_MAIN, 
    minHeight: "100vh", 
    padding: "50px 30px", 
    color: COLORS.TEXT_LIGHT 
  },
  inputDark: {
    backgroundColor: COLORS.CARD_BG,
    color: COLORS.TEXT_LIGHT,
    border: `1px solid ${COLORS.PRIMARY}50`,
    borderRadius: "15px",
  }
};
// --- FIN ESTILOS ---


export default function MedicationExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false); // Detalle Modal
  
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Confirmación Modal
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // 🔹 Función para cargar gastos
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/medexpenses/");
      setExpenses(res.data);
      // Solo aplicar el filtro si la búsqueda por fecha está activa
      if (searchDate) {
        setFilteredExpenses(res.data.filter(item => item.created_at.startsWith(searchDate)));
      } else {
        setFilteredExpenses(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchDate]);

  // 🔹 Cargar al montar + refresco automático cada 10s
  useEffect(() => {
    fetchExpenses();
    const interval = setInterval(fetchExpenses, 10000);
    return () => clearInterval(interval);
  }, [fetchExpenses]);

  // 🔹 Filtrar por fecha (Ahora solo actualiza la variable de búsqueda y llama a fetch)
  const handleSearch = (e) => {
    setSearchDate(e.target.value);
    // Nota: El fetchExpenses se disparará por el cambio de searchDate en su dependencia.
  };

  // 🔹 Agrupar por fecha + ambulancia + paramédico
  const groupedExpenses = filteredExpenses.reduce((acc, item) => {
    const key = `${item.created_at.split("T")[0]}-${item.ambulance}-${item.paramedic}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleViewGroup = (groupKey) => {
    setSelectedGroup(groupedExpenses[groupKey]);
    setShowModal(true);
  };

  // 🆕 Función que abre el modal de confirmación (Pasa la ID al estado)
  const confirmDeletion = (id) => {
    setItemToDeleteId(id);
    setShowConfirmModal(true);
  };

  // 🔹 Función para la eliminación efectiva (Ejecuta la API)
  const handleDeleteConfirmed = async () => {
    setShowConfirmModal(false); 
    const id = itemToDeleteId;

    try {
      await api.delete(`/medexpenses/${id}/`);
      alert("✅ Registro eliminado correctamente"); 
      
      // Refrescar los datos para toda la tabla
      fetchExpenses(); 
      
      // Cierra el modal de detalle si la eliminación fue desde allí
      if (selectedGroup && selectedGroup.some(item => item.id === id)) {
        // Solo si fue el último item del grupo, cerraría el modal de detalle
        setSelectedGroup(selectedGroup.filter((item) => item.id !== id));
        if (selectedGroup.length === 1) setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar el registro");
    } finally {
        setItemToDeleteId(null);
    }
  };


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <SidebarTop />

      {/* Contenido principal */}
      <div style={STYLES.mainContainer}>
        {/* Borde difuminado oscuro entre sidebar y contenido */}
        <div
          style={{
            position: "fixed", top: 0, left: "220px", width: "40px", height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", zIndex: 2, pointerEvents: "none",
          }}
        />


        <Container style={{ position: "relative", zIndex: 3 }}>
          {/* Encabezado y Filtro */}
          <Row className="mb-4 pb-3 border-bottom" style={{ borderColor: COLORS.GRID_LINE }}>
            <Col md={9}>
              <h3 style={{ color: COLORS.PRIMARY, fontWeight: 800 }}>💰 Gastos de Equipo y Medicamentos</h3>
              <p className="opacity-75">Consulta los registros de gastos detallados por turno y unidad.</p>
              <Button style={STYLES.buttonGradient} className="rounded-pill px-4" onClick={() => window.history.back()}>
                ← Volver
              </Button>
            </Col>
            <Col xs="12" md="3" className="mt-4 mt-md-0 d-flex flex-column justify-content-end">
              <label className="text-muted small mb-1">Filtrar por Fecha:</label>
              <input
                type="date"
                className="form-control text-black form-control-sm rounded-pill shadow-sm"
                value={searchDate}
                onChange={handleSearch}
                style={STYLES.inputDark}
              />
            </Col>
          </Row>

          {/* Tabla principal (Componente externo) */}
          <ExpensesTable 
            loading={loading}
            groupedExpenses={groupedExpenses}
            handleViewGroup={handleViewGroup}
            confirmDeletion={confirmDeletion}
          />
          
          {/* Modal detalle grupo (Componente externo) */}
          <ExpenseDetailModal 
            showModal={showModal}
            setShowModal={setShowModal}
            selectedGroup={selectedGroup}
            confirmDeletion={confirmDeletion} // Se pasa la función de confirmación
          />

          {/* Modal de Confirmación de Eliminación (Componente externo) */}
          <ConfirmationModal 
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            handleDeleteConfirmed={handleDeleteConfirmed} // Se pasa la función de ejecución
          />
        </Container>
      </div>
    </div>
  );
}