import React from 'react';
import { Table, Button, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Colores y Estilos
const COLORS = {
  BG_MAIN: "#081F38", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  CARD_BG: "#122F4C", TEXT_LIGHT: "#E0F2F1", DANGER: "#E76F51", 
  GRID_LINE: "#1F4260", WARNING: "#FFC300"
};
const STYLES = {
    buttonGradient: {
        background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
        color: COLORS.TEXT_LIGHT,
        border: "none",
        fontWeight: 700,
    },
    buttonDanger: {
        backgroundColor: COLORS.DANGER, 
        border: 'none', 
        boxShadow: `0 4px 10px ${COLORS.DANGER}40` 
    }
};

// Función para descargar PDF (Reubicada aquí ya que usa los datos de la tabla)
const downloadPDF = (group) => {
    if (!group || group.length === 0) return;
    const doc = new jsPDF();
    const margin = 15;
    
    doc.setFontSize(16);
    doc.text("Gastos de Medicamentos y Equipos", margin, margin);
    
    const { created_at, paramedic, ambulance, shift } = group[0];
    doc.setFontSize(12);
    let yOffset = margin + 10;
    doc.text(`Fecha: ${new Date(created_at).toLocaleDateString()}`, margin, yOffset); yOffset += 7;
    doc.text(`Paramédico: ${paramedic}`, margin, yOffset); yOffset += 7;
    doc.text(`Ambulancia: ${ambulance}`, margin, yOffset); yOffset += 7;
    doc.text(`Turno: ${shift}`, margin, yOffset); yOffset += 10;

    const tableData = group.map((item) => [item.medicine, item.quantity]);
    autoTable(doc, {
      startY: yOffset,
      head: [["Medicamento / Equipo", "Cantidad"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [0, 180, 216], textColor: [255, 255, 255] },
      styles: { fontSize: 10, textColor: [33, 33, 33] },
    });

    doc.save(`gastos_${ambulance}_${new Date(created_at).toISOString().split("T")[0]}.pdf`);
  };


export default function ExpensesTable({ loading, groupedExpenses, handleViewGroup, confirmDeletion }) {
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" style={{ color: COLORS.PRIMARY }} />
        <p className="mt-2 text-muted">Cargando registros de gastos en tiempo real...</p>
      </div>
    );
  }

  if (Object.keys(groupedExpenses).length === 0) {
    return (
      <div
        className="text-center p-4 rounded-3 shadow-sm my-5"
        style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.GRID_LINE}`, color: COLORS.TEXT_LIGHT }}
      >
        <span className="fs-5 fw-bold" style={{ color: COLORS.WARNING }}>No se encontraron registros de gastos.</span>
        <p className="text-muted small mt-1">Ajuste la fecha de búsqueda o espere la próxima sincronización.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive shadow-lg rounded-3" style={{ backgroundColor: COLORS.CARD_BG, overflow: 'hidden' }}>
      <table className="table table-dark table-bordered table-hover align-middle mb-0">
        <thead className="text-center" style={{ backgroundColor: COLORS.PRIMARY }}>
          <tr style={{ color: COLORS.BG_MAIN, fontWeight: 800 }}>
            <th>Fecha</th>
            <th>Paramédico</th>
            <th>Ambulancia</th>
            <th>Turno</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {Object.entries(groupedExpenses).map(([key, group]) => {
            const { created_at, paramedic, ambulance, shift } = group[0];
            return (
              <tr key={key} style={{ transition: 'background-color 0.2s', borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
                <td className="fw-bold" style={{ color: COLORS.PRIMARY }}>{new Date(created_at).toLocaleDateString()}</td>
                <td className="fw-bold">{paramedic}</td>
                <td style={{ color: COLORS.SECONDARY }}>{ambulance}</td>
                <td>{shift}</td>
                <td className="d-flex justify-content-center gap-2 py-3">
                  <Button size="sm" style={STYLES.buttonGradient} className="rounded-pill px-3" onClick={() => handleViewGroup(key)}>👁️ Ver</Button>
                  <Button size="sm" style={{ ...STYLES.buttonGradient, background: COLORS.DANGER }} className="rounded-pill px-3" onClick={() => downloadPDF(group)}>📥 PDF</Button>
                  
                  <Button 
                    size="sm" 
                    style={STYLES.buttonDanger} 
                    className="rounded-pill px-3 fw-bold" 
                    onClick={() => confirmDeletion(group[0].id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}