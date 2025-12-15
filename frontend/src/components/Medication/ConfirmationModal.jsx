import React from 'react';
import { Modal, Button } from "react-bootstrap";

// Colores y Estilos (Para referencia interna)
const COLORS = {
  BG_MAIN: "#081F38", PRIMARY: "#00B4D8", DANGER: "#E76F51", 
  TEXT_LIGHT: "#E0F2F1", GRID_LINE: "#1F4260", 
};

export default function ConfirmationModal({ showConfirmModal, setShowConfirmModal, handleDeleteConfirmed }) {
  
  return (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
      <Modal.Header closeButton style={{ backgroundColor: COLORS.CARD_BG, borderBottom: `1px solid ${COLORS.DANGER}` }}>
        <Modal.Title style={{ color: COLORS.DANGER, fontWeight: 700 }}>
            <span role="img" aria-label="Warning">⚠️</span> Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT }}>
        <p>Estás a punto de **eliminar permanentemente** este registro de gasto.</p>
        <p>Esta acción no se puede deshacer. ¿Deseas continuar?</p>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` }}>
        <Button 
            variant="outline-light" 
            className="rounded-pill px-4" 
            onClick={() => setShowConfirmModal(false)}
        >
            Cancelar
        </Button>
        <Button 
            variant="danger" 
            className="rounded-pill px-4 fw-bold" 
            onClick={handleDeleteConfirmed}
            style={{ backgroundColor: COLORS.DANGER, border: 'none', boxShadow: `0 4px 10px ${COLORS.DANGER}70` }}
        >
            <span role="img" aria-label="Trash">🗑️</span> Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}