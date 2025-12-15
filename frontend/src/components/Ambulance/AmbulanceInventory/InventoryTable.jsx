import React from 'react';
import { Table, Button, Spinner, Col, Row } from "react-bootstrap"; // <-- AÑADIR ROW Y COL

// ... resto del código sin cambios

// Estilos locales/compartidos
const COLORS = {
  BG_MAIN: "#081F38", CARD_BG: "#122F4C", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  TEXT_LIGHT: "#E0F2F1", DANGER: "#E76F51", GRID_LINE: "#1F4260", 
};
const STYLES = {
  buttonGradient: {
    background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
    color: COLORS.TEXT_LIGHT,
    border: "none",
    fontWeight: 700,
  },
  buttonDanger: { backgroundColor: COLORS.DANGER, borderColor: COLORS.DANGER },
  tableCard: { borderRadius: '15px', overflow: 'hidden', backgroundColor: COLORS.CARD_BG },
  tableHeader: { backgroundColor: COLORS.GRID_LINE, color: COLORS.PRIMARY }
};

export default function InventoryTable({ loading, filteredInventory, unit, openEditModal, confirmDelete, categories, selectedCategory, setSelectedCategory, setShowAddModal }) {
  
  return (
    <>
      {/* Botones de Categorías */}
      <Row className="mb-4">
        <Col className="d-flex flex-wrap gap-2 justify-content-start">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === selectedCategory ? "primary" : "outline-primary"}
              className="rounded-pill px-4 fw-bold"
              style={cat === selectedCategory ? { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY, color: COLORS.BG_MAIN } : { color: COLORS.PRIMARY, borderColor: COLORS.PRIMARY }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Button style={STYLES.buttonGradient} className="rounded-pill px-4" onClick={() => setShowAddModal(true)}>
            ➕ Agregar Equipo
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          {loading ? (
            <div className="text-center py-5">
                <Spinner animation="border" style={{ color: COLORS.PRIMARY }} />
                <p className="text-muted mt-2">Cargando inventario...</p>
            </div>
          ) : (
            <Table bordered hover variant="dark" className="text-center shadow-lg" style={STYLES.tableCard}>
              <thead>
                <tr style={STYLES.tableHeader}>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item.id} style={{ transition: 'background-color 0.2s' }}>
                      <td style={{ color: COLORS.SECONDARY, fontWeight: 600 }}>{item.name}</td>
                      <td className="fw-bold">{item.quantity}</td>
                      <td style={{ color: COLORS.TEXT_LIGHT }}>{item.unit}</td>
                      <td>
                        <Button size="sm" style={STYLES.buttonGradient} className="rounded-pill me-2 px-3" onClick={() => openEditModal(item)}>
                          ✏️ Editar
                        </Button>
                        
                        <Button
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => confirmDelete(item)}
                          style={STYLES.buttonDanger}
                        >
                          🗑️ Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-muted py-4">
                      No hay equipo registrado en esta categoría para la unidad {unit}.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}