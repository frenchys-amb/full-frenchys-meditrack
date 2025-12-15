import React from 'react';
import { Card, Button, Row, Col } from "react-bootstrap";

// Colores y Estilos
const COLORS = {
  BG_MAIN: "#081F38", PRIMARY: "#00B4D8", SECONDARY: "#09B59F", 
  CARD_BG: "#122F4C", DANGER: "#E76F51", 
};

const STYLES = {
    buttonGradient: {
        background: `linear-gradient(90deg, ${COLORS.PRIMARY}, ${COLORS.SECONDARY})`,
        color: COLORS.TEXT_LIGHT,
        border: "none",
        fontWeight: 700,
    },
    buttonDelete: {
        backgroundColor: COLORS.DANGER, 
        border: 'none', 
        boxShadow: `0 4px 10px ${COLORS.DANGER}40` 
    },
    cardStyle: {
        backgroundColor: COLORS.CARD_BG,
        border: `1px solid ${COLORS.GRID_LINE}`,
        transition: 'box-shadow 0.2s, transform 0.2s',
    }
};

export default function ChecksListTable({ checks, openCheck, confirmDelete }) {
  
  const handleCardHover = (e, isEnter) => {
    e.currentTarget.style.transform = isEnter ? 'translateX(5px)' : 'translateX(0)';
    e.currentTarget.style.boxShadow = isEnter ? '0 8px 15px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.3)';
  };

  if (checks.length === 0) {
    return (
      <Card className="p-4 text-center" style={STYLES.cardStyle}>
        <h5 className="text-warning fw-bold">No hay chequeos disponibles para esta unidad.</h5>
        <p className="text-muted small mb-0">El registro se actualiza en tiempo real.</p>
      </Card>
    );
  }

  return (
    <>
      {checks.map((c) => (
        <Card
          key={c.id}
          className="mb-3 p-3 text-white shadow-sm"
          style={STYLES.cardStyle}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <Row className="align-items-center">
              <Col md={8} className="text-start">
                  <p className="mb-0 fw-bold" style={{ color: COLORS.SECONDARY }}>
                      Registro #{c.id} — <span style={{ color: COLORS.PRIMARY }}>{c.date}</span>
                  </p>
                  <p className="mb-0 small" style={{ color: "white" }}>Staff: {c.staff}</p>
              </Col>
              <Col md={4} className="d-flex gap-2 justify-content-end mt-2 mt-md-0">
                  <Button
                      size="sm"
                      style={STYLES.buttonGradient}
                      className="rounded-pill px-3"
                      onClick={() => openCheck(c.id)}
                  >
                      👁️ Ver Detalles
                  </Button>
                  <Button
                      size="sm"
                      style={STYLES.buttonDelete}
                      className="rounded-pill px-3"
                      onClick={() => confirmDelete(c.id)}
                  >
                      🗑️
                  </Button>
              </Col>
          </Row>
        </Card>
      ))}
    </>
  );
}