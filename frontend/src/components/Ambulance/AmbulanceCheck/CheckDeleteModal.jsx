import React from 'react';
import { Modal, Button } from "react-bootstrap";

const COLORS = {
  BG_MAIN: "#081F38", CARD_BG: "#122F4C", DANGER: "#E76F51", 
  TEXT_LIGHT: "#E0F2F1", GRID_LINE: "#1F4260", 
};

export default function CheckDeleteModal({ showDeleteModal, setShowDeleteModal, checkToDelete, executeDelete }) {
  const buttonDeleteStyle = {
    background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
    boxShadow: `0 4px 10px ${COLORS.DANGER}70`,
  };

  return (
    <Modal 
      show={showDeleteModal} 
      onHide={() => setShowDeleteModal(false)} 
      centered 
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`, border: "none" }}>
        <Modal.Title className="fw-bold text-white">
          ⚠️ Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-5" style={{ backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT }}>
        <div className="mb-3" style={{ fontSize: "4rem", color: COLORS.DANGER, filter: `drop-shadow(0 0 15px ${COLORS.DANGER}40)` }}>
          🗑️
        </div>

        <h4 className="fw-bold mb-3">¿Eliminar este chequeo?</h4>
        <p className="text-white-50 px-4">
          Estás a punto de borrar permanentemente el registro de inspección.
        </p>

        <div className="mt-3 px-4 py-2 rounded-pill d-inline-block" style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.DANGER}`, color: COLORS.TEXT_LIGHT }}>
            <strong>ID Registro:</strong> {checkToDelete}
        </div>
        
        <p className="small fw-bold mt-3 mb-0" style={{ color: COLORS.DANGER }}>
          ⚠️ Esta acción no se puede deshacer.
        </p>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
        <Button 
          variant="outline-light" 
          className="rounded-pill px-4 border-0 opacity-75"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancelar
        </Button>
        <Button 
          style={buttonDeleteStyle}
          className="rounded-pill px-4 fw-bold"
          onClick={executeDelete}
        >
          Sí, Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}