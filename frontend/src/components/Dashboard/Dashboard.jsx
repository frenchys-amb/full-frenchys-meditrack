import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Sidebar from "./SidebarTop";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Bar as ChartBar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

// --- PALETA DE COLORES Y ESTILOS CENTRALIZADOS ---
const COLORS = {
  BG_MAIN: "#081F38",           
  PRIMARY: "#00B4D8",           
  SECONDARY: "#09B59F",         
  CARD_BG_OPACITY: "rgba(18, 47, 76, 0.7)", 
  TEXT_LIGHT: "#E0F2F1",        
  GRID_LINE: "#1F4260",         
  WARNING: "#FFC300",           
  DANGER: "#E76F51",            
  SUCCESS: "#198754",           
};

// Generamos las 17 etiquetas F1, F2, ..., F17
const generateLabels = () => {
  const labels = [];
  for (let i = 1; i <= 17; i++) {
    labels.push(`F${i}`);
  }
  return labels;
};
const BAR_LABELS = generateLabels();

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [stockLevels, setStockLevels] = useState([]); // ✅ Nuevo estado para los datos de stock
  const [loadingStock, setLoadingStock] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("Usuario");
  const navigate = useNavigate();

  // --- LÓGICA DE SALUDO Y USUARIO ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUsername(storedUser.fullName || storedUser.username || "Usuario");
  }, []);

  // --- LÓGICA DE GRÁFICA DE ÁREA (Chequeos) ---
  const fetchChecksHistory = useCallback(async () => {
    try {
      const res = await axios.get("/checks/");
      const data = res.data;
      const dateGrouped = data.reduce((acc, c) => {
        const date = new Date(c.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      setHistory(Object.entries(dateGrouped).map(([date, total]) => ({ date, total })));
    } catch (err) {
      console.error("Error fetching checks:", err);
    }
  }, []);

  // --- LÓGICA DE GRÁFICA DE BARRAS (Stock por Ubicación) - TIEMPO REAL ---
  const fetchStockLevels = useCallback(async () => {
    try {
      setLoadingStock(true);
      
      // ✅ SUSTITUYE ESTA LÍNEA con la llamada a tu API real de stock por ubicación:
      // const res = await axios.get("/inventory/stock-by-location/"); 
      // const apiData = res.data; 

      // 🛑 SIMULACIÓN DE DATOS (Necesario hasta que tengas el endpoint)
      const simulatedData = [
          85, 92, 70, 75, 60, 65, 
          45, 50, 40, 38, 25, 30, 
          20, 15, 98, 95, 100 
      ];
      const apiData = simulatedData;
      // 🛑 FIN SIMULACIÓN

      if (Array.isArray(apiData) && apiData.length === BAR_LABELS.length) {
        setStockLevels(apiData);
      } else {
        // En caso de error o datos incompletos, usa los datos simulados por defecto
        setStockLevels(simulatedData);
      }
    } catch (err) {
      console.error("Error fetching stock levels:", err);
      // Fallback a datos simulados si la API falla
      setStockLevels([85, 92, 70, 75, 60, 65, 45, 50, 40, 38, 25, 30, 20, 15, 98, 95, 100]);
    } finally {
      setLoadingStock(false);
    }
  }, []);


  useEffect(() => {
    fetchChecksHistory();
    fetchStockLevels();
    
    // Configurar la actualización en tiempo real (cada 30 segundos)
    const interval = setInterval(() => {
        fetchChecksHistory();
        fetchStockLevels();
    }, 30000); 

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [fetchChecksHistory, fetchStockLevels]);

  // --- DATOS DE STOCK PARA CHARTJS (USANDO EL ESTADO) ---
  const getBarColors = (data) => {
    // Colorea las barras según el nivel de stock (verde, amarillo, rojo)
    return data.map(value => {
        if (value >= 70) return COLORS.SECONDARY;
        if (value >= 40) return COLORS.WARNING;
        return COLORS.DANGER;
    });
  };

  const stockData = {
    labels: BAR_LABELS,
    datasets: [
      {
        label: "Nivel de Stock (%)",
        data: stockLevels, // ✅ Usamos el estado actualizado
        backgroundColor: getBarColors(stockLevels), // ✅ Colores dinámicos
        borderRadius: 8,
        barThickness: 20, 
      },
    ],
  };

  // --- ESTILOS MODERNOS (Refinados) ---
  const glassCardStyle = {
    backgroundColor: COLORS.CARD_BG_OPACITY, 
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "30px",
    border: `1px solid ${COLORS.PRIMARY}40`,
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
    color: COLORS.TEXT_LIGHT,
    height: "100%",
  };

  const gradientButtonStyle = {
    borderRadius: "15px",
    padding: "16px 24px",
    fontWeight: "700",
    fontSize: "1.1rem",
    border: "none",
    cursor: "pointer",
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    boxShadow: `0 8px 20px rgba(0, 180, 216, 0.4)`,
  };
  
  const handleButtonHover = (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 10px 25px rgba(0, 180, 216, 0.6)`;
  };
  const handleButtonLeave = (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 8px 20px rgba(0, 180, 216, 0.4)`;
  };


  return (
    <div className="d-flex">
      <Sidebar />
      
      <div
        style={{
          flexGrow: 1,
          marginLeft: "220px",
          backgroundColor: COLORS.BG_MAIN,
          minHeight: "100vh",
          padding: "40px 20px",
          color: COLORS.TEXT_LIGHT,
          position: "relative",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "fixed", top: 0, left: "220px", width: "40px", height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", zIndex: 2, pointerEvents: "none",
          }}
        />

        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 pb-3 border-bottom border-opacity-25" style={{ zIndex: 2, borderColor: COLORS.GRID_LINE }}>
          <div className="text-center text-md-start mb-3 mb-md-0">
            <h2 className="fw-bolder mb-1 fs-1" style={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {greeting}, {username}
            </h2>
            <p className="opacity-75 mb-0 fs-5">Resumen general del sistema de gestión de inventario.</p>
          </div>

           <div className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow" 
                style={{ backgroundColor: COLORS.CARD_BG_OPACITY, border: `1px solid ${COLORS.PRIMARY}40` }}>
            <span className="fw-bold fs-5" style={{ color: COLORS.PRIMARY }}>Frenchys Ambulance</span>
            <i className="bi bi-hospital fs-4" style={{ color: COLORS.SECONDARY }}></i>
          </div>
        </div>

        <div className="row g-5 position-relative" style={{ zIndex: 1 }}>
          
          {/* COLUMNA IZQUIERDA (GRÁFICAS) */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-5">
            
            {/* GRÁFICA DE ÁREA (Recharts) */}
            <div style={glassCardStyle}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 fs-4" style={{ color: COLORS.SECONDARY }}>📈 Tendencia de Chequeos Diarios</h5>
                <span className="badge bg-opacity-25 fs-6" style={{ backgroundColor: COLORS.PRIMARY, color: COLORS.TEXT_LIGHT }}>Últimos días</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.SECONDARY} stopOpacity={0.7}/>
                      <stop offset="95%" stopColor={COLORS.SECONDARY} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.GRID_LINE} vertical={false} />
                  <XAxis dataKey="date" stroke={COLORS.GRID_LINE} tick={{fill: COLORS.TEXT_LIGHT, fontSize: 12}} />
                  <YAxis stroke={COLORS.GRID_LINE} tick={{fill: COLORS.TEXT_LIGHT, fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: COLORS.BG_MAIN, border: `1px solid ${COLORS.PRIMARY}`, borderRadius: "8px", color: COLORS.TEXT_LIGHT }} 
                    itemStyle={{ color: COLORS.SECONDARY }}
                    labelStyle={{ color: COLORS.PRIMARY, fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="total" name="Chequeos" stroke={COLORS.SECONDARY} strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* GRÁFICA DE BARRAS (ChartJS) - TIEMPO REAL */}
            <div style={glassCardStyle}>
              <h5 className="fw-bold mb-4 fs-4" style={{ color: COLORS.PRIMARY }}>📊 Comparativa de Nivel de Stock por Ubicación</h5>
              {loadingStock ? (
                <div style={{ height: "550px" }} className="d-flex flex-column justify-content-center align-items-center">
                    <div className="spinner-border text-info mb-3" role="status"></div>
                    <p>Actualizando datos de stock...</p>
                </div>
              ) : (
                <div style={{ height: "550px" }}> 
                  <ChartBar 
                    data={stockData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      indexAxis: 'y', 
                      plugins: { 
                        legend: { display: false }, // Se eliminó la leyenda por ser obvia
                        tooltip: { 
                          backgroundColor: 'rgba(18, 47, 76, 0.95)', 
                          titleColor: COLORS.SECONDARY,
                          padding: 12,
                          cornerRadius: 10,
                          bodyColor: COLORS.TEXT_LIGHT,
                          borderWidth: 1,
                          borderColor: COLORS.PRIMARY
                        } 
                      }, 
                      scales: { 
                        x: { 
                          ticks: { color: COLORS.TEXT_LIGHT, callback: (value) => value + "%" }, 
                          grid: { color: COLORS.GRID_LINE },
                          title: { display: true, text: 'Porcentaje (%)', color: COLORS.TEXT_LIGHT }
                        }, 
                        y: { 
                          ticks: { color: COLORS.TEXT_LIGHT }, 
                          grid: { display: false }
                        } 
                      } 
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA (ACCESOS Y ESTADO) */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-5">
            
            {/* BOTONES DE ACCESO RÁPIDO */}
            <div style={glassCardStyle}>
              <h5 className="fw-bold mb-4 fs-4" style={{ color: COLORS.PRIMARY }}>🚀 Accesos Rápidos</h5>
              
              <button 
                style={gradientButtonStyle} 
                className="w-100" 
                onClick={() => navigate("/ambulances")}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <span className="d-flex align-items-center gap-3"><i className="bi bi-truck fs-4"></i> Ambulancias (Stock)</span>
                <span className="fs-4 opacity-75">→</span>
              </button>
              
              <button 
                style={gradientButtonStyle} 
                className="w-100" 
                onClick={() => navigate("/storage")}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <span className="d-flex align-items-center gap-3"><i className="bi bi-box-seam fs-4"></i> Almacén Central</span>
                <span className="fs-4 opacity-75">→</span>
              </button>
              
              <button 
                style={gradientButtonStyle} 
                className="w-100" 
                onClick={() => navigate("/medications")}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <span className="d-flex align-items-center gap-3"><i className="bi bi-capsule fs-4"></i> Gestión de Metas</span>
                <span className="fs-4 opacity-75">→</span>
              </button>
            </div>

            {/* ESTADO DEL INVENTARIO */}
            <div style={glassCardStyle}>
              <h5 className="fw-bold mb-4 fs-4" style={{ color: COLORS.SECONDARY }}>📦 Resumen de Stock</h5>
              
              {/* Progreso 1 (Éxito) */}
              <div className="mb-4">
                <div className="d-flex justify-content-between opacity-75 small mb-1">
                  <span className="fw-bold">Material Quirúrgico</span>
                  <span className="fw-bold" style={{ color: COLORS.SUCCESS }}>70%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 10, borderRadius: 10 }}>
                  <div className="progress-bar" style={{ width: "70%", borderRadius: 10, boxShadow: `0 0 12px ${COLORS.SUCCESS}70`, backgroundColor: COLORS.SUCCESS }}></div>
                </div>
              </div>

              {/* Progreso 2 (Advertencia) */}
              <div className="mb-4">
                <div className="d-flex justify-content-between opacity-75 small mb-1">
                  <span className="fw-bold">Medicamentos Esenciales</span>
                  <span className="fw-bold" style={{ color: COLORS.WARNING }}>45%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 10, borderRadius: 10 }}>
                  <div className="progress-bar" style={{ width: "45%", borderRadius: 10, boxShadow: `0 0 12px ${COLORS.WARNING}70`, backgroundColor: COLORS.WARNING }}></div>
                </div>
              </div>

              {/* Progreso 3 (Peligro) */}
              <div className="mb-0">
                <div className="d-flex justify-content-between opacity-75 small mb-1">
                  <span className="fw-bold">Equipos de Soporte Vital</span>
                  <span className="fw-bold" style={{ color: COLORS.DANGER }}>25%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 10, borderRadius: 10 }}>
                  <div className="progress-bar" style={{ width: "25%", borderRadius: 10, boxShadow: `0 0 12px ${COLORS.DANGER}70`, backgroundColor: COLORS.DANGER }}></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-top border-opacity-25 text-center" style={{ borderColor: COLORS.GRID_LINE }}>
                 <small className="opacity-50">Última auditoría: Hace 5 min</small>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}