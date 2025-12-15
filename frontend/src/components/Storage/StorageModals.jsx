import React from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { STYLES, COLORS } from './StorageStyles';

// Modales de Edición, Eliminación y Detalles (Añadir/Add se deja en el principal por su complejidad)

// --- Modal de Confirmación de Eliminación ---
export function DeleteConfirmModal({ showDeleteAlert, setShowDeleteAlert, confirmDelete }) {
    return (
        <Modal show={showDeleteAlert} onHide={() => setShowDeleteAlert(false)} centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`, border: "none" }}>
              <Modal.Title className="fw-bold text-white">⚠️ Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-5" style={{ backgroundColor: COLORS.CARD_BG, color: "#fff" }}>
              <div className="mb-3" style={{ fontSize: "4rem", filter: `drop-shadow(0 0 15px rgba(220, 53, 69, 0.4))` }}>🗑️</div>
              <h4 className="fw-bold mb-3">¿Eliminar este ítem?</h4>
              <p className="text-white-50 px-3">Estás a punto de borrar permanentemente este registro del inventario.</p>
              <p className="small fw-bold mt-2 mb-0" style={{ color: COLORS.DANGER }}>⚠️ Esta acción no se puede deshacer.</p>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: COLORS.CARD_BG, borderTop: `1px solid ${COLORS.DANGER}` }}>
              <Button variant="outline-light" className="rounded-pill px-4 border-0 opacity-75" onClick={() => setShowDeleteAlert(false)}>Cancelar</Button>
              <Button 
                variant="danger" 
                className="rounded-pill px-4 fw-bold" 
                onClick={confirmDelete}
                style={{ background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`, boxShadow: `0 4px 15px rgba(220, 53, 69, 0.5)`, border: "none" }}
              >
                Sí, Eliminar
              </Button>
            </Modal.Footer>
        </Modal>
    );
}

// --- Modal de Edición ---
export function EditItemModal({ editItem, setEditItem, handleSaveEdit }) {
    return (
        <Modal show={editItem !== null} onHide={() => setEditItem(null)} centered>
            <Modal.Header closeButton style={{ background: COLORS.PRIMARY_BLUE, color: "#fff" }}>
                <Modal.Title>✏️ Editar Existencia</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: COLORS.DARK_BLUE_BG, color: "#fff" }}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                    style={STYLES.INPUT_DARK} 
                    value={editItem?.name || ""} 
                    onChange={e => setEditItem({...editItem, name: e.target.value})} 
                    className="mb-3"
                />
                <Form.Label>Cantidad Actual</Form.Label>
                <Form.Control 
                    style={STYLES.INPUT_DARK} 
                    type="number" 
                    value={editItem?.quantity || ""} 
                    onChange={e => setEditItem({...editItem, quantity: e.target.value})} 
                />
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: COLORS.DARK_BLUE_BG }}>
                <Button onClick={handleSaveEdit} style={{ background: COLORS.SUCCESS, border: 'none' }}>Actualizar</Button>
            </Modal.Footer>
        </Modal>
    );
}

// --- Modal de Detalles por Categoría ---
export function CategoryDetailsModal({ showCategoryModal, setShowCategoryModal, selectedCategory, selectedCategoryItems, handleEdit, requestDelete }) {
    return (
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} size="lg" centered scrollable>
            <Modal.Header closeButton style={{ background: COLORS.PRIMARY_BLUE, color: "#fff" }}>
                <Modal.Title>{selectedCategory?.label}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: COLORS.CARD_BG, color: "#fff" }}>
              <Table striped bordered hover variant="dark">
                <thead><tr><th>Nombre</th><th>Cant.</th><th>Unidad</th><th>Acción</th></tr></thead>
                <tbody>
                  {selectedCategoryItems.map(i => (
                    <tr key={i.id}>
                        <td>{i.name}</td><td className="fw-bold" style={{ color: COLORS.HIGHLIGHT_CYAN }}>{i.quantity}</td><td>{i.unit}</td>
                        <td>
                            <button className="btn btn-sm btn-info me-2" onClick={()=>handleEdit(i)}>✏️</button>
                            <button className="btn btn-sm btn-danger" onClick={()=>requestDelete(i.id)}>🗑️</button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
        </Modal>
    );
}