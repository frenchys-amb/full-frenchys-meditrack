import React from 'react';
import { Modal, Button } from "react-bootstrap";

// Estilos locales/compartidos
const COLORS = {
  BG_MAIN: "#081F38", CARD_BG: "#122F4C", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  TEXT_LIGHT: "#E0F2F1", DANGER: "#E76F51", WARNING: "#FFC300", GRID_LINE: "#1F4260",
};
const STYLES = {
  modalBody: { backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT },
  modalFooter: { backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` },
};

export default function DeleteConfirmModal({ showDeleteModal, setShowDeleteModal, itemToDelete, executeDelete, unit }) {
  
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
      <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`, color: COLORS.TEXT_LIGHT, borderBottom: "none" }}>
        <Modal.Title className="fw-bold">⚠️ Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center py-4" style={STYLES.modalBody}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem", color: COLORS.DANGER }}>🗑️</div>
          <p className="fs-5 fw-bold">¿Estás seguro de que deseas eliminar permanentemente este equipo?</p>
          
          {itemToDelete && (
            <div className="mt-3 px-4 py-2 rounded-pill d-inline-block" style={{ backgroundColor: COLORS.CARD_BG, border: `1px solid ${COLORS.DANGER}`, color: COLORS.TEXT_LIGHT }}>
              <strong style={{ color: COLORS.WARNING }}>{itemToDelete.name}</strong>
            </div>
          )}
          
          <p className="text-muted small mt-3 mb-0">Esta acción no se puede deshacer y borrará el registro de la unidad {unit}.</p>
      </Modal.Body>
      
      <Modal.Footer style={STYLES.modalFooter}>
        <Button variant="outline-light" onClick={() => setShowDeleteModal(false)} className="rounded-pill px-4">
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={executeDelete} 
          className="rounded-pill px-4 fw-bold" 
          style={{ backgroundColor: COLORS.DANGER, boxShadow: `0 4px 10px ${COLORS.DANGER}70`, border: 'none' }}
        >
          Sí, Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}