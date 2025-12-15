import { useState, useEffect, useCallback } from "react";
import { Button, Container, Spinner, Table, Card, Modal } from "react-bootstrap";
import SidebarTop from "../Dashboard/SidebarTop";
import api from "../../services/api";

// import AddRecommendedModal from "./AddRecommendedModal";
import EditRecommendedModal from "./EditRecommendedModal";

export default function RecommendedCheckList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Estados para el modal de eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Colores y Estilos Centralizados (Mejorados)
  const COLORS = {
    BG_MAIN: "#081F38", // Fondo principal más oscuro y profundo
    BG_CARD: "#122F4C", // Fondo de tarjetas/contenedores (ligeramente más claro)
    PRIMARY_ACCENT: "#00B4D8", // Cian vibrante para acentos y títulos
    PRIMARY_DARK: "#023E8A", // Azul oscuro principal para cabeceras
    TEXT_LIGHT: "#E0F2F1", // Texto blanco/claro
    WARNING: "#FFC300", // Amarillo para editar/advertencias
    DANGER: "#E76F51", // Naranja-Rojo para eliminar
    INFO_HIGHLIGHT: "#90E0EF", // Resalte de meta/cantidad
  };

  const STYLES = {
    mainContainer: {
      flexGrow: 1,
      marginLeft: "220px", // <-- Restaurado: Empuja el contenido fuera del sidebar fijo
      backgroundColor: COLORS.BG_MAIN,
      minHeight: "100vh",
      padding: "50px 30px",
      color: COLORS.TEXT_LIGHT,
      position: "relative",
      zIndex: 0,
    },
    heading: {
      color: COLORS.PRIMARY_ACCENT,
      fontWeight: "900",
      letterSpacing: "1px",
      textShadow: `0 0 10px rgba(0, 180, 216, 0.3)`,
    },
    tableCard: {
      backgroundColor: COLORS.BG_CARD,
      border: `2px solid ${COLORS.PRIMARY_DARK}`,
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: COLORS.PRIMARY_DARK,
      color: COLORS.TEXT_LIGHT,
      textTransform: "uppercase",
      fontSize: "0.85rem",
      fontWeight: "700",
      letterSpacing: "1.5px",
      borderBottom: `3px solid ${COLORS.PRIMARY_ACCENT}`,
    },
    tableCell: {
      verticalAlign: "middle",
      padding: "18px 15px",
      borderColor: COLORS.BG_CARD, // Usar color de fondo para la línea de celda
    },
    itemName: {
      color: COLORS.INFO_HIGHLIGHT,
      fontWeight: "700",
      fontSize: "1.1rem",
    },
    emptyState: {
      padding: "60px",
      textAlign: "center",
      color: COLORS.TEXT_LIGHT,
      opacity: 0.6,
      fontSize: "1.3rem",
      fontStyle: "italic",
    },
    // Estilos para los botones de acción en la tabla
    buttonEdit: {
      backgroundColor: COLORS.WARNING,
      borderColor: COLORS.WARNING,
      color: COLORS.BG_MAIN,
      fontWeight: 700,
      transition: 'all 0.2s',
      boxShadow: `0 4px 8px rgba(255, 195, 0, 0.3)`,
    },
    buttonDelete: {
      backgroundColor: COLORS.DANGER,
      borderColor: COLORS.DANGER,
      color: 'white',
      fontWeight: 700,
      transition: 'all 0.2s',
      boxShadow: `0 4px 8px rgba(231, 111, 81, 0.3)`,
    }
  };


  // ─────────────────────────────────────────────
  // Lógica (sin cambios)
  // ─────────────────────────────────────────────
  const fetchRecommended = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/recommended-inventory/");
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`/recommended-inventory/${id}/`, data);
      setEditItem(null);
      fetchRecommended();
    } catch {
      alert("Error actualizando");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/recommended-inventory/${deleteId}/`);
      fetchRecommended();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la recomendación");
    }
  };

  // ─────────────────────────────────────────────
  // Renderizado
  // ─────────────────────────────────────────────
  return (
    <div className="d-flex">
      {/* 1. Sidebar Fijo */}
      <SidebarTop />
      
      {/* 2. Contenedor Principal de Contenido (Ahora con margen) */}
      <div style={STYLES.mainContainer}> 
        
        {/* Contenedor de Sombra/Degradado (Fijo, justo al lado del sidebar) */}
        <div 
            style={{ 
                position: "fixed", 
                top: 0, 
                left: "220px", // Colocado a la derecha del sidebar
                width: "40px", 
                height: "100%", 
                background: "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))", 
                zIndex: 2, 
                pointerEvents: "none" 
            }} 
        />
        
        <Container fluid="md">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 style={STYLES.heading}>⭐ Recomendaciones de Inventario</h2>
          </div>

          {loading ? (
            <div className="text-center p-5">
                <Spinner animation="border" style={{width: '3rem', height: '3rem', color: COLORS.PRIMARY_ACCENT}} />
                <p className="mt-3" style={{color: COLORS.PRIMARY_ACCENT}}>Cargando recomendaciones...</p>
            </div>
          ) : (
            <Card style={STYLES.tableCard}>
              <style type="text/css">
                {`
                  .custom-dark-table-hover tbody tr {
                    background-color: ${COLORS.BG_CARD} !important;
                  }
                  .custom-dark-table-hover tbody tr:hover {
                    background-color: rgba(0, 180, 216, 0.05) !important;
                    box-shadow: inset 5px 0 0 ${COLORS.PRIMARY_ACCENT};
                    transition: background-color 0.2s ease-in-out, box-shadow 0.2s;
                  }
                `}
              </style>
              <div className="table-responsive">
                <Table bordered hover variant="dark" className="mb-0 custom-dark-table-hover" style={{ backgroundColor: "transparent" }}>
                  <thead>
                    <tr>
                      <th style={STYLES.tableHeader} className="text-center">#</th>
                      <th style={STYLES.tableHeader}>Nombre del Artículo</th>
                      <th style={STYLES.tableHeader}>Categoría</th>
                      <th style={STYLES.tableHeader} className="text-center">Meta</th>
                      <th style={STYLES.tableHeader} className="text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td style={STYLES.tableCell} className="text-center fw-bold" >
                          {index + 1}
                        </td>
                        <td style={STYLES.tableCell}>
                            <span style={STYLES.itemName}>{item.item_name}</span>
                        </td>
                        <td style={STYLES.tableCell}>
                            <span 
                              className="badge bg-secondary bg-opacity-75 text-wrap" 
                              style={{fontSize: '0.85em', fontWeight: 500, backgroundColor: COLORS.PRIMARY_DARK}}
                            >
                                {item.category}
                            </span>
                        </td>
                        <td style={STYLES.tableCell} className="text-center">
                            <span 
                              className="badge fs-6 fw-bold px-3 py-2"
                              style={{
                                backgroundColor: COLORS.PRIMARY_ACCENT, 
                                color: COLORS.BG_MAIN,
                                boxShadow: `0 0 10px rgba(0, 180, 216, 0.5)`
                              }}
                            >
                                {item.recommended_quantity}
                            </span>
                        </td>
                        <td style={STYLES.tableCell} className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              style={STYLES.buttonEdit}
                              size="sm"
                              className="px-3"
                              onClick={() => setEditItem(item)}
                            >
                              ✏ Editar
                            </Button>
                            <Button
                              style={STYLES.buttonDelete}
                              size="sm"
                              className="px-3"
                              onClick={() => confirmDelete(item.id)}
                            >
                              🗑 Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan="5" style={STYLES.emptyState}>
                          <i className="bi bi-inbox fs-1 d-block mb-3" style={{color: COLORS.PRIMARY_ACCENT}}></i>
                          Aún no hay metas de inventario definidas. ¡Comienza a añadir!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </Container>
      </div> {/* Cierre del div principal de contenido */}

      {/* MODAL EDITAR */}
      <EditRecommendedModal
        show={!!editItem}
        item={editItem}
        onHide={() => setEditItem(null)}
        onUpdate={handleUpdate}
      />

      {/* MODAL DE ELIMINAR */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered 
        backdrop="static"
        keyboard={false}
      >
        {/* Cabecera Roja de Alerta */}
        <Modal.Header closeButton style={{ background: `linear-gradient(90deg, ${COLORS.DANGER}, #b02a37)`, border: "none" }}>
          <Modal.Title className="fw-bold text-white">
            ⚠️ Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>

        {/* Cuerpo Oscuro */}
        <Modal.Body className="text-center py-5" style={{ backgroundColor: COLORS.BG_CARD, color: COLORS.TEXT_LIGHT }}>
          <div className="mb-3" style={{ fontSize: "4rem", filter: `drop-shadow(0 0 15px rgba(231, 111, 81, 0.4))` }}>
            🗑️
          </div>

          <h4 className="fw-bold mb-3">¿Eliminar esta recomendación?</h4>
          <p className="text-white-50 px-3">
            Esta acción eliminará la meta de inventario para este artículo permanentemente.
          </p>
          
          <p className="small fw-bold mt-2 mb-0" style={{color: COLORS.DANGER}}>
            ⚠️ Esta acción no se puede deshacer.
          </p>
        </Modal.Body>

        {/* Footer con botones estilizados */}
        <Modal.Footer style={{ backgroundColor: COLORS.BG_CARD, borderTop: `1px solid ${COLORS.DANGER}` }}>
          <Button 
            variant="outline-light" 
            className="rounded-pill px-4 border-0 opacity-75"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </Button>

          <Button 
            style={STYLES.buttonDelete}
            className="rounded-pill px-4"
            onClick={executeDelete}
          >
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}