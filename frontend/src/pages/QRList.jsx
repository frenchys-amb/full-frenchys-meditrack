import React from "react";
import SidebarTop from "../components/Dashboard/SidebarTop";

// --- PALETA DE COLORES Y ESTILOS CENTRALIZADOS ---
const COLORS = {
  BG_MAIN: "#081F38",           // Fondo principal (Azul Oscuro Profundo)
  CARD_BG: "#122F4C",           // Fondo de tarjetas/QR
  PRIMARY: "#00B4D8",           // Cian/Azul Claro Principal (Ambulancias)
  SECONDARY: "#09B59F",         // Verde Menta (Transferencias)
  MEDICATION: "#6f42c1",        // Púrpura (Medicamentos)
  TEXT_LIGHT: "#E0F2F1",        // Texto principal
  TEXT_DARK: "#212529",         // Texto oscuro (para contrastar en el QR)
};

export default function QRList() {
  // 1. Ambulancias de F1 a F17
  const ambulances = Array.from({ length: 17 }, (_, i) => `F${i + 1}`);

  // 2. URLs base
  const CHECK_FORM_URL = "http://localhost:3000/ambulance-check";
  const MEDICATION_FORM_URL = "http://localhost:3000/medications-form";
  const TRANSFER_FORM_URL = "http://localhost:3000/transfer-form";

  // 3. Descargar QR
  const downloadQR = (url, filename) => {
    // La API de QR genera la imagen, necesitamos obtenerla como blob si queremos renombrarla al descargar.
    // Para simplificar en este ejemplo, se descargará directamente desde la URL de la API.
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Estilo de los contenedores de QR
  const qrContainerStyle = {
    backgroundColor: COLORS.CARD_BG,
    border: `2px solid ${COLORS.GRID_LINE}`,
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
    padding: "20px",
  };

  return (
    <div className="d-flex">
      <SidebarTop />

      {/* ✅ Contenido principal: Fondo Azul Oscuro */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: "220px",
          backgroundColor: COLORS.BG_MAIN,
          minHeight: "100vh",
          padding: "50px 30px",
          color: COLORS.TEXT_LIGHT, // Color de texto claro
        }}
      >
        
        {/* 🎨 Borde difuminado oscuro entre sidebar y contenido */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "220px", 
            width: "40px",
            height: "100%",
            // Gradiente oscuro de la izquierda (sidebar) a transparente
            background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", 
            zIndex: 2,
            pointerEvents: "none",
          }}
        />


        <div style={{ position: "relative", zIndex: 3 }}>
          
          {/* ✅ Sección QR Ambulancias */}
          <div className="text-center mb-5 pb-4 border-bottom" style={{ borderColor: COLORS.GRID_LINE }}>
            <h2 className="fw-bold mb-4" style={{ color: COLORS.PRIMARY }}>
              🚑 Códigos QR de Chequeo de Unidades
            </h2>
            <p className="text-muted small">Escanea el código de la unidad para iniciar el chequeo diario.</p>
          </div>

          <div className="row w-100 mb-5 justify-content-center g-4">
            {ambulances.map((amb) => {
              const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${CHECK_FORM_URL}?ambulancia=${amb}`;
              return (
                <div key={amb} className="col-lg-2 col-md-3 col-6 text-center">
                  <div className="p-3 shadow-lg h-100" style={qrContainerStyle}>
                    <h5 className="fw-bold mb-2" style={{ color: COLORS.PRIMARY }}>{amb}</h5>

                    <img
                      src={qrURL}
                      alt={`QR ${amb}`}
                      className="img-fluid p-2 border rounded"
                      style={{ backgroundColor: "white", borderColor: COLORS.PRIMARY }}
                    />

                    <button
                      className="btn btn-sm mt-3 rounded-pill px-4 fw-bold"
                      style={{ backgroundColor: COLORS.PRIMARY, color: COLORS.TEXT_DARK, border: 'none' }}
                      onClick={() => downloadQR(qrURL, `QR_Chequeo_${amb}.png`)}
                    >
                      ⬇️ Descargar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Línea divisoria */}
          <hr style={{ borderColor: COLORS.GRID_LINE, margin: "50px 0" }}/>


          <div className="row g-5">
            {/* ✅ Sección QR Medicamentos */}
            <div className="col-md-6 text-center">
              <div style={qrContainerStyle}>
                <h2 className="fw-bold mb-4" style={{ color: COLORS.MEDICATION }}>
                  💊 QR para Carga de Medicamentos
                </h2>
                {(() => {
                  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${MEDICATION_FORM_URL}`;
                  return (
                    <>
                      <img
                        src={qrURL}
                        alt="QR Medicamentos"
                        className="img-fluid p-3 border rounded shadow-lg"
                        style={{ backgroundColor: "white", borderColor: COLORS.MEDICATION }}
                      />

                      <button
                        className="btn btn-sm mt-4 rounded-pill px-5 fw-bold"
                        style={{ backgroundColor: COLORS.MEDICATION, color: COLORS.TEXT_LIGHT, border: 'none' }}
                        onClick={() => downloadQR(qrURL, "QR_Medicamentos.png")}
                      >
                        ⬇️ Descargar
                      </button>

                      <p className="mt-3 small text-muted">Escanea para abrir el Formulario de Carga</p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* ✅ Sección QR Transferencias */}
            <div className="col-md-6 text-center">
              <div style={qrContainerStyle}>
                <h2 className="fw-bold mb-4" style={{ color: COLORS.SECONDARY }}>
                  📦 QR para Transferencias
                </h2>
                {(() => {
                  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${TRANSFER_FORM_URL}`;
                  return (
                    <>
                      <img
                        src={qrURL}
                        alt="QR Transferencias"
                        className="img-fluid p-3 border rounded shadow-lg"
                        style={{ backgroundColor: "white", borderColor: COLORS.SECONDARY }}
                      />

                      <button
                        className="btn btn-sm mt-4 rounded-pill px-5 fw-bold"
                        style={{ backgroundColor: COLORS.SECONDARY, color: COLORS.TEXT_DARK, border: 'none' }}
                        onClick={() => downloadQR(qrURL, "QR_Transferencias.png")}
                      >
                        ⬇️ Descargar
                      </button>

                      <p className="mt-3 small text-muted">
                        Escanea para abrir el Formulario de Transferencias (Almacén)
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}