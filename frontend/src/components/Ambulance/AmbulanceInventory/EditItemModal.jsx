import React from 'react';
import { Modal, Button, Form } from "react-bootstrap";

// Estilos locales/compartidos
const COLORS = {
  BG_MAIN: "#081F38", CARD_BG: "#122F4C", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  TEXT_LIGHT: "#E0F2F1", GRID_LINE: "#1F4260", 
};
const STYLES = {
  buttonGradient: {
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
  },
  inputDark: { backgroundColor: COLORS.CARD_BG, color: COLORS.TEXT_LIGHT, border: `1px solid ${COLORS.PRIMARY}50` },
  modalHeader: { background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`, color: COLORS.TEXT_LIGHT, borderBottom: "none" },
  modalBody: { backgroundColor: COLORS.BG_MAIN, color: COLORS.TEXT_LIGHT },
  modalFooter: { backgroundColor: COLORS.BG_MAIN, borderTop: `1px solid ${COLORS.GRID_LINE}` },
};


export default function EditItemModal({ showEditModal, setShowEditModal, editItem, setEditItem, handleSaveEdit }) {
  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton style={STYLES.modalHeader}>
        <Modal.Title>✏️ Editar {editItem.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={STYLES.modalBody}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              type="text" 
              value={editItem.name} 
              onChange={(e) => setEditItem((p) => ({ ...p, name: e.target.value }))} 
              style={STYLES.inputDark} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control 
              type="number" 
              min="0"
              value={editItem.quantity} 
              onChange={(e) => setEditItem((p) => ({ ...p, quantity: e.target.value }))} 
              style={STYLES.inputDark} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unidad</Form.Label>
            <Form.Control 
              type="text" 
              value={editItem.unit} 
              disabled 
              style={{ ...STYLES.inputDark, opacity: 0.6 }} 
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={STYLES.modalFooter}>
        <Button variant="outline-light" onClick={() => setShowEditModal(false)}>Cancelar</Button>
        <Button style={STYLES.buttonGradient} onClick={handleSaveEdit}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
}