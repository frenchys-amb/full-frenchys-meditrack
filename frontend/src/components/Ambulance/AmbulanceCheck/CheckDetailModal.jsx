import React from 'react';
import { Modal, Button, Card, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Colores y Estilos
const COLORS = {
  BG_MAIN: "#081F38", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  CARD_BG: "#122F4C", TEXT_LIGHT: "#E0F2F1", DANGER: "#E76F51", 
  GRID_LINE: "#1F4260", 
};

const STYLES = {
    buttonGradient: {
        background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
        color: COLORS.TEXT_LIGHT,
        border: "none",
        fontWeight: 700,
    },
    cardStyle: {
        backgroundColor: COLORS.CARD_BG,
        border: `1px solid ${COLORS.GRID_LINE}`,
    },
};

// Secciones del chequeo
const SECTIONS = [
    "seccion_vehiculo", "seccion_medical_equipment", "seccion_equipo", 
    "seccion_inmovilizacion", "seccion_canalizacion", "seccion_oxigeno_airway", 
    "seccion_medicamentos", "seccion_miscelaneos", "seccion_entubacion"
];

// -------------------------------
// ✅ GENERAR PDF (Función de utilidad)
// -------------------------------
const downloadPDF = (selectedCheck) => {
    if (!selectedCheck) return;

    const doc = new jsPDF("p", "mm", "letter");
    doc.setFont("helvetica", "normal");

    let y = 15;

    // Encabezado de texto
    doc.setFontSize(18);
    doc.text("Frenchys Ambulance — Hoja de Chequeo", 105, y, { align: "center" });
    y += 10;
    doc.line(10, y, 205, y); 
    y += 7;

    // Información General
    doc.setFontSize(14);
    doc.text("Información General", 14, y);
    y += 7;

    const generalData = [
        ["Fecha", selectedCheck.date],
        ["Ambulancia", selectedCheck.ambulance],
        ["Turno", selectedCheck.shift],
        ["Millaje", selectedCheck.millage],
        ["Combustible", selectedCheck.combustible],
        ["Oxígeno M", selectedCheck.oxigeno_m],
        ["Oxígeno D", selectedCheck.oxigeno_d],
        ["Observaciones", selectedCheck.observaciones || "-"],
    ];

    doc.setFontSize(11);
    generalData.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 14, y);
        y += 5;
    });

    y += 10;

    // Staff y Firmas (Representación en texto)
    doc.setFontSize(14);
    doc.text("Staff y Firmas", 14, y);
    y += 7;

    const staff1 = selectedCheck.staff?.split(",")[0] || "";
    const staff2 = selectedCheck.staff2 || selectedCheck.staff?.split(",")[1] || "";

    doc.setFontSize(11);
    doc.text(`Staff 1: ${staff1}`, 14, y);
    y += 5;

    if (selectedCheck.firma_staff1) {
        doc.text("Firma Staff 1: (Adjunta en el registro)", 14, y);
        y += 5;
    }

    if (staff2) {
        doc.text(`Staff 2: ${staff2}`, 14, y);
        y += 5;

        if (selectedCheck.firma_staff2) {
            doc.text("Firma Staff 2: (Adjunta en el registro)", 14, y);
            y += 5;
        }
    }

    y += 10;
    
    // Secciones de Chequeo (Tablas)
    SECTIONS.forEach((section) => {
        const sectionData = selectedCheck[section] || {};
        const rows = Object.entries(sectionData).map(([k, v]) => [
        k.replaceAll("_", " "),
        String(v),
        ]);

        if (rows.length > 0) {
            autoTable(doc, {
                startY: y,
                head: [[section.replace("seccion_", "").replace(/_/g, " ").toUpperCase(), "Valor"]],
                body: rows,
                theme: "striped",
                headStyles: { fillColor: [0, 180, 216], textColor: [255, 255, 255] },
                styles: { fontSize: 10 },
            });

            y = doc.lastAutoTable.finalY + 8;
        }
    });

    // Marca de agua
    doc.setTextColor(0, 0, 0, 0.08);
    doc.setFontSize(50);
    doc.text(
      "Frenchys Ambulance",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() / 2,
      { angle: 45, align: "center", baseline: "middle" }
    );

    doc.save(`Chequeo_${selectedCheck.ambulance}_${selectedCheck.date}.pdf`);
};

export default function CheckDetailModal({ showModal, setShowModal, selectedCheck, unit, confirmDelete }) {
  
  if (!selectedCheck) return null;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" scrollable>
      <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`, color: COLORS.TEXT_LIGHT, borderBottom: 'none' }}>
        <Modal.Title>Hoja de Chequeo — {unit}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT }}>
        
        <div>
            <div className="text-center mb-4 pb-3 border-bottom" style={{ borderColor: COLORS.GRID_LINE }}>
                <h4 className="fw-bold mb-0" style={{ color: COLORS.TEXT_LIGHT }}>
                    Registro de Inspección
                </h4>
                <p className="text-muted small">ID: {selectedCheck.id} | Fecha: {selectedCheck.date}</p>
            </div>

            {/* Info General */}
            <Card className="mb-4 p-4 text-white" style={STYLES.cardStyle}>
                <h5 className="fw-bold mb-3" style={{ color: COLORS.PRIMARY }}>✅ Información General</h5>
                <Row>
                    {[
                        ['Ambulancia', selectedCheck.ambulance, COLORS.SECONDARY],
                        ['Turno', selectedCheck.shift, COLORS.SECONDARY],
                        ['Millaje', selectedCheck.millage, COLORS.PRIMARY],
                        ['Combustible', selectedCheck.combustible, COLORS.PRIMARY],
                        ['Oxígeno M', selectedCheck.oxigeno_m, COLORS.SECONDARY],
                        ['Oxígeno D', selectedCheck.oxigeno_d, COLORS.SECONDARY],
                        ['Staff 1', selectedCheck.staff?.split(",")[0] || "-", COLORS.PRIMARY],
                        ['Staff 2', selectedCheck.staff2 || selectedCheck.staff?.split(",")[1] || "-", COLORS.PRIMARY],
                    ].map(([label, value, color]) => (
                        <Col xs={12} sm={6} md={4} key={label} className="mb-2">
                            <span className="fw-bold" style={{ color: color }}>{label}:</span> {value}
                        </Col>
                    ))}
                    <Col xs={12} className="mt-3">
                        <span className="fw-bold" style={{ color: COLORS.SECONDARY }}>Observaciones:</span> {selectedCheck.observaciones ?? "-"}
                    </Col>
                </Row>
            </Card>

            {/* Secciones de Detalle */}
            <div className="row g-3">
                {SECTIONS.map((section) => (
                    <Col xs={12} md={6} key={section}>
                        <Card className="h-100 p-3" style={STYLES.cardStyle}>
                            <h6 className="fw-bold mb-3" style={{ color: COLORS.SECONDARY }}>
                                {section.replace("seccion_", "").replace(/_/g, " ").toUpperCase()}
                            </h6>

                            <Table bordered size="sm" responsive className="mb-0 table-sm" variant="white" style={{ color: COLORS.TEXT_LIGHT, borderColor: COLORS.GRID_LINE }}>
                                <tbody>
                                    {Object.entries(selectedCheck[section] || {}).map(([k, v]) => (
                                        <tr key={k}>
                                            <td className="text-muted" style={{ width: '50%' }}>{k.replaceAll("_", " ")}</td>
                                            <td className="fw-bold" style={{ color: COLORS.PRIMARY }}>{String(v)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                ))}
            </div>
            
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
        <Button style={STYLES.buttonGradient} className="rounded-pill px-4" onClick={() => downloadPDF(selectedCheck)}>📄 Descargar PDF</Button>
        <Button 
          style={{ background: COLORS.DANGER, border: 'none' }} 
          className="rounded-pill px-4" 
          onClick={() => confirmDelete(selectedCheck.id)}
        >
          🗑️ Eliminar Registro
        </Button>
      </Modal.Footer>
    </Modal>
  );
}