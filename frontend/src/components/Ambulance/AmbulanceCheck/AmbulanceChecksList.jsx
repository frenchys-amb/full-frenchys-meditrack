import { useEffect, useState, useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api"; // Ruta ajustada
import SidebarTop from "../../Dashboard/SidebarTop"; // Ruta ajustada

// ✅ Importación de los nuevos componentes
import ChecksListTable from './ChecksListTable';
import CheckDetailModal from './CheckDetailModal';
import CheckDeleteModal from './CheckDeleteModal';

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
        boxShadow: `0 4px 10px rgba(0, 180, 216, 0.2)`,
    },
    mainContainer: {
        flexGrow: 1,
        marginLeft: "220px",
        backgroundColor: COLORS.BG_MAIN,
        minHeight: "100vh",
        padding: "50px 30px",
        color: COLORS.TEXT_LIGHT,
        position: "relative",
        zIndex: 0,
    },
};
// --- FIN ESTILOS ---


export default function AmbulanceChecksList() {
  const { unit } = useParams();
  const navigate = useNavigate();
  const [checks, setChecks] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  
  // Modales
  const [showModal, setShowModal] = useState(false); // Modal de "Ver Detalles"
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal Eliminar
  const [checkToDelete, setCheckToDelete] = useState(null); // ID para borrar

  const fetchChecks = useCallback(async () => {
    try {
      const res = await api.get("/ambulance-checks/");
      setChecks(Array.isArray(res.data) ? res.data.filter((c) => c.ambulance === unit) : []);
    } catch (err) {
      console.error("Error cargando chequeos:", err);
    }
  }, [unit]);

  useEffect(() => {
    fetchChecks();
    const interval = setInterval(fetchChecks, 10000);
    return () => clearInterval(interval);
  }, [fetchChecks]);

  const openCheck = (id) => {
    const data = checks.find((c) => c.id === id);
    setSelectedCheck(data);
    setShowModal(true);
  };

  // 1️⃣ Función para abrir modal de confirmación
  const confirmDelete = (id) => {
    setCheckToDelete(id);
    setShowDeleteModal(true);
  };

  // 2️⃣ Función para ejecutar la eliminación
  const executeDelete = async () => {
    if (!checkToDelete) return;
    try {
      await api.delete(`/ambulance-checks/${checkToDelete}/`);
      setShowDeleteModal(false); 
      setShowModal(false); 
      setCheckToDelete(null);
      fetchChecks(); // Refresca la lista
    } catch (err) {
      console.error(err);
      alert("❌ Error eliminando el chequeo");
    }
  };


  return (
    <div className="d-flex">
      <SidebarTop />

      <div style={STYLES.mainContainer}>
        
        <div
          style={{
            position: "fixed", top: 0, left: "220px", width: "40px", height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", zIndex: 2, pointerEvents: "none",
          }}
        />

        <Container style={{ position: "relative", zIndex: 1 }}>
          <h3 className="fw-bold mb-4" style={{ color: COLORS.PRIMARY }}>🚑 Historial de Chequeos — Unidad {unit}</h3>

          <Button
            style={STYLES.buttonGradient}
            className="mb-4 rounded-pill px-4"
            onClick={() => navigate("/ambulances")}
          >
            ← Volver a Unidades
          </Button>

          {/* ✅ RENDERIZA LA LISTA DE CHEQUEOS */}
          <ChecksListTable 
            checks={checks}
            openCheck={openCheck}
            confirmDelete={confirmDelete}
          />

        </Container>

        {/* ✅ MODALES */}
        <CheckDetailModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedCheck={selectedCheck}
          unit={unit}
          confirmDelete={confirmDelete} // Pasa la función para eliminar desde el detalle
        />
        
        <CheckDeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          checkToDelete={checkToDelete}
          executeDelete={executeDelete}
        />
        
      </div>
    </div>
  );
}