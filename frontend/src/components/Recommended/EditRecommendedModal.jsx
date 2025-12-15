import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import CATEGORIES from "./categories";

// Colores definidos para consistencia
const COLORS = {
    BG_DARK: "#0A2A43",
    BG_CARD: "#122F4C", 
    PRIMARY_ACCENT: "#00B4D8",
    TEXT_LIGHT: "#E0F2F1",
    SUCCESS: "#28a745",
    SECONDARY: "#6c757d",
};

export default function EditRecommendedModal({ show, onHide, item, onUpdate }) {
  const [form, setForm] = useState({
    item_name: "",
    category: "",
    recommended_quantity: 0,
  });

  useEffect(() => {
    if (item) {
      setForm({
        item_name: item.item_name,
        category: item.category,
        recommended_quantity: item.recommended_quantity,
      });
    }
  }, [item]);

  const handle = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const save = () => {
    // Validar cantidad positiva antes de guardar
    if (form.recommended_quantity <= 0) {
        alert("La meta debe ser un número positivo.");
        return;
    }
    onUpdate(item.id, form);
  };

  if (!item) return null;

  // Estilo para los campos de formulario
  const inputStyle = {
    backgroundColor: COLORS.BG_CARD,
    borderColor: COLORS.PRIMARY_ACCENT,
    color: COLORS.TEXT_LIGHT,
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      
      {/* Cabecera con Degradado */}
      <Modal.Header 
        closeButton 
        style={{ 
          background: `linear-gradient(90deg, ${COLORS.BG_DARK}, #004085)`, 
          color: COLORS.PRIMARY_ACCENT,
          borderBottom: `2px solid ${COLORS.PRIMARY_ACCENT}`
        }}
      >
        <Modal.Title className="fw-bold">
            ✏️ Editar Meta de Inventario
        </Modal.Title>
      </Modal.Header>

      {/* Cuerpo del Modal */}
      <Modal.Body style={{ backgroundColor: COLORS.BG_DARK, color: COLORS.TEXT_LIGHT }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre del Artículo</Form.Label>
            <Form.Control
              style={inputStyle}
              value={form.item_name}
              onChange={(e) => handle("item_name", e.target.value)}
              disabled // Generalmente, el nombre del ítem no se edita en una recomendación
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Categoría</Form.Label>
            <Form.Select
              style={inputStyle}
              value={form.category}
              onChange={(e) => handle("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} style={{backgroundColor: COLORS.BG_CARD}}>
                  {c.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label className="fw-semibold">Meta de Cantidad (Mínimo)</Form.Label>
            <Form.Control
              style={inputStyle}
              type="number"
              min="1"
              value={form.recommended_quantity}
              onChange={(e) => handle("recommended_quantity", Number(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      {/* Pie de Página con Botones */}
      <Modal.Footer style={{ background: COLORS.BG_DARK, borderTop: `1px solid ${COLORS.BG_CARD}` }}>
        <Button 
            variant="outline-light" 
            onClick={onHide} 
            className="rounded-pill px-4"
            style={{borderColor: COLORS.SECONDARY, color: COLORS.SECONDARY}}
        >
          Cancelar
        </Button>
        <Button 
            onClick={save}
            className="rounded-pill px-4 fw-bold"
            style={{ 
                backgroundColor: COLORS.PRIMARY_ACCENT, 
                borderColor: COLORS.PRIMARY_ACCENT,
                color: COLORS.BG_DARK, // Texto oscuro sobre acento brillante
                boxShadow: `0 4px 10px rgba(0, 180, 216, 0.4)`
            }}
        >
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}