import React from 'react';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

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

export default function AddItemModal({ showAddModal, setShowAddModal, unit, newItem, handleChange, setAddModeData, inventory, categories, handleAddItem, addModeData, normalize }) {
  return (
    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
      <Modal.Header closeButton style={STYLES.modalHeader}>
        <Modal.Title>➕ Agregar Equipo a Unidad {unit}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={STYLES.modalBody}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select 
              name="category" 
              value={newItem.category} 
              onChange={(e) => { handleChange(e); setAddModeData({ existingId: null }); }}
              style={STYLES.inputDark}
            >
              <option value="">Seleccione categoría</option>
              {categories.map((c) => <option key={c} style={{ backgroundColor: COLORS.BG_MAIN }}>{c}</option>)}
            </Form.Select>
          </Form.Group>
          
          {newItem.category && (
            <Form.Group className="mb-3">
              <Form.Label>Equipo existente (Añadir Stock)</Form.Label>
              <Form.Select 
                value={addModeData.existingId || "new"} 
                onChange={(e) => {
                  const id = e.target.value;
                  if (id === "new") { setAddModeData({ existingId: null }); setNewItem((p) => ({ ...p, name: "", unit: "" })); return; }
                  const item = inventory.find(i => i.id === Number(id));
                  setAddModeData({ existingId: item.id });
                  setNewItem({ category: item.category, id: item.id, name: item.name, quantity: 1, unit: item.unit });
                }}
                style={STYLES.inputDark}
              >
                <option value="new" style={{ backgroundColor: COLORS.CARD_BG }}>➕ Nuevo equipo</option>
                {inventory.filter(i => normalize(i.category) === normalize(newItem.category)).map(i => (<option key={i.id} value={i.id} style={{ backgroundColor: COLORS.CARD_BG }}>{i.name} (Stock: {i.quantity})</option>))}
              </Form.Select>
            </Form.Group>
          )}

          {!addModeData.existingId && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" name="name" value={newItem.name} onChange={handleChange} style={STYLES.inputDark} /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label>Unidad</Form.Label><Form.Control type="text" name="unit" value={newItem.unit} onChange={handleChange} style={STYLES.inputDark} placeholder="Ej: unidades" /></Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-3"><Form.Label>Cantidad a {addModeData.existingId ? 'Añadir' : 'Crear'}</Form.Label><Form.Control type="number" min="1" name="quantity" value={newItem.quantity} onChange={handleChange} style={STYLES.inputDark} /></Form.Group>
          
        </Form>
      </Modal.Body>
      <Modal.Footer style={STYLES.modalFooter}>
        <Button variant="outline-light" onClick={() => setShowAddModal(false)}>Cancelar</Button>
        <Button style={STYLES.buttonGradient} onClick={handleAddItem}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}