import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import SidebarTop from '../../Dashboard/SidebarTop';

// --- PALETA DE COLORES Y ESTILOS CENTRALIZADOS ---
const COLORS = {
  BG_MAIN: "#081F38",           // Fondo principal (Azul Oscuro Profundo)
  CARD_BG: "#122F4C",           // Fondo de tarjetas
  PRIMARY: "#00B4D8",           // Cian/Azul Claro Principal
  SECONDARY: "#09B59F",         // Verde Menta
  TEXT_LIGHT: "#E0F2F1",        // Texto principal
  BORDER: "#0069D9",            // Borde sutil
};

const STYLES = {
  mainContainer: {
    flexGrow: 1,
    marginLeft: "220px",
    backgroundColor: COLORS.BG_MAIN,
    minHeight: "100vh",
    padding: "50px 30px", // Aumento de padding
    color: COLORS.TEXT_LIGHT,
    position: "relative",
    zIndex: 0,
  },
  heading: {
    color: COLORS.PRIMARY,
    fontWeight: "800",
    letterSpacing: "1px",
    textShadow: `0 0 10px rgba(0, 180, 216, 0.3)`,
  },
  cardStyle: {
    backgroundColor: COLORS.CARD_BG,
    border: `2px solid ${COLORS.BORDER}`,
    borderRadius: "20px",
    color: COLORS.TEXT_LIGHT,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  buttonGradient: {
    // Usamos el gradiente que ya usamos en el dashboard
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
    borderRadius: "10px",
    padding: "10px 15px",
    transition: "transform 0.2s, opacity 0.2s",
  },
};

export default function AmbulanceList() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);

  // 🔹 Inicializar unidades y refrescar automáticamente
  useEffect(() => {
    const loadUnits = () => {
      // Simulación de unidades
      const unitLabels = [];
      for(let i = 1; i <= 17; i++) {
        unitLabels.push(`F${i}`);
      }
      setUnits(unitLabels); 
      // Si viene de API: setUnits(fetchData().data);
    };
    loadUnits();

    const interval = setInterval(loadUnits, 30000); 
    return () => clearInterval(interval);
  }, []);


  // --- Función de Estilo Hover para las Tarjetas ---
  const handleCardHover = (e, isEnter) => {
    e.currentTarget.style.transform = isEnter ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = isEnter ? '0 15px 30px rgba(0, 0, 0, 0.6)' : '0 8px 20px rgba(0, 0, 0, 0.4)';
  };
  
  // --- Función de Estilo Hover para los Botones ---
  const handleButtonHover = (e, isEnter) => {
    e.currentTarget.style.transform = isEnter ? 'scale(1.05)' : 'scale(1)';
    e.currentTarget.style.opacity = isEnter ? 0.9 : 1;
  };


  return (
    <div className="d-flex">
      <SidebarTop />

      <div style={STYLES.mainContainer}>
        {/* LÍNEA ELIMINADA: Logo translúcido de fondo (CAUSANTE DEL ERROR) */}
        {/* Borde difuminado oscuro entre sidebar y contenido */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "220px", 
            width: "40px",
            height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <Container style={{ position: "relative", zIndex: 1 }} fluid>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-5 pb-3 border-bottom" style={{ borderColor: COLORS.BORDER }}>
            <h2 className="fw-bold mb-3 mb-md-0" style={STYLES.heading}>
                <i className="bi bi-truck-flatbed me-3"></i> Gestión de Unidades Móviles ({units.length})
            </h2>
          </div>

          <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start">
            {units.map(u => (
              <div
                key={u}
                className="card p-4 text-center"
                style={STYLES.cardStyle}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <h3 style={{ fontWeight: "800", color: COLORS.PRIMARY, borderBottom: `2px solid ${COLORS.SECONDARY}`, paddingBottom: '10px' }}>
                    {u}
                </h3>
                <p className='text-white-50 small mb-4'>Estado: <span style={{ color: COLORS.SECONDARY }}>Operativa</span></p>

                <div className="d-grid gap-3">
                  <button
                    className="btn"
                    style={STYLES.buttonGradient}
                    onClick={() => navigate(`/ambulances/${u}/checks`)}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    1. Lista de Chequeo
                  </button>
                  <button
                    className="btn"
                    style={STYLES.buttonGradient}
                    onClick={() => navigate(`/ambulances/${u}/equipment`)}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    2. Inventario Requisado
                  </button>
                  <button
                    className="btn"
                    style={STYLES.buttonGradient}
                    onClick={() => navigate(`/ambulances/${u}/current`)}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    3. Stock Actual
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}