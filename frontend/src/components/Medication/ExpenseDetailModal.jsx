import React from 'react';
import { Modal, Button, Table } from "react-bootstrap";

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
};

export default function ExpenseDetailModal({ showModal, setShowModal, selectedGroup, confirmDeletion }) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`, color: COLORS.TEXT_LIGHT, borderBottom: 'none' }}>
        <Modal.Title>📋 Detalle de Equipo Requisado</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT }}>
        {selectedGroup ? (
          <>
            <div style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.GRID_LINE}`, borderRadius: "12px", padding: "15px", marginBottom: "20px" }}>
              <p className="mb-1" style={{ color: COLORS.PRIMARY }}><strong>📅 Fecha:</strong> {new Date(selectedGroup[0].created_at).toLocaleDateString()}</p>
              <p className="mb-1" style={{ color: COLORS.SECONDARY }}><strong>🚑 Unidad:</strong> {selectedGroup[0].ambulance}</p>
              <p className="mb-1"><strong>🧑‍⚕️ Paramédico:</strong> {selectedGroup[0].paramedic}</p>
              <p className="mb-0"><strong>👤 Paciente:</strong> {selectedGroup[0].patient_name || "—"}</p>
            </div>

            <Table bordered hover responsive variant="dark" className="align-middle text-center mb-0" style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.GRID_LINE}` }}>
              <thead style={{ backgroundColor: COLORS.GRID_LINE }}>
                <tr>
                  <th style={{ color: COLORS.PRIMARY }}>Medicamento / Equipo</th>
                  <th style={{ color: COLORS.PRIMARY }}>Cantidad</th>
                  <th style={{ color: COLORS.PRIMARY }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {selectedGroup.map((item) => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
                    <td style={{ color: COLORS.SECONDARY }}>{item.medicine}</td>
                    <td className="fw-bold">{item.quantity}</td>
                    <td>
                      <Button 
                          size="sm" 
                          style={{ backgroundColor: COLORS.DANGER, border: 'none', boxShadow: `0 4px 10px ${COLORS.DANGER}40` }} 
                          className="rounded-pill px-3 fw-bold" 
                          onClick={() => confirmDeletion(item.id)}
                      >
                          🗑️ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : <p>No hay datos para mostrar.</p>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
        <Button style={STYLES.buttonGradient} className="rounded-pill px-4" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}