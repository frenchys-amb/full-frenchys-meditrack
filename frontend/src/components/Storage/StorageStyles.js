// Paleta de colores inspirada en una interfaz oscura moderna

export const COLORS = {
    PRIMARY_BLUE: "#0069D9",       // Azul principal para botones y bordes
    DARK_BLUE_BG: "#0A2A43",      // Fondo principal (casi negro azulado)
    CARD_BG: "#0F304A",           // Fondo de tarjetas y modales internos
    HIGHLIGHT_CYAN: "#4DBFFF",    // Azul claro/Cian para títulos y texto clave
    INPUT_BORDER: "#4DBFFF",      // Borde de input
    DANGER: "#dc3545",            // Rojo para acciones peligrosas
    SUCCESS: "#198754",           // Verde para acciones positivas
    WARNING: "#ffc107",           // Amarillo para stock bajo
};

export const STYLES = {
    // Estilo para botones principales (usando gradiente)
    BUTTON_PRIMARY: {
        background: `linear-gradient(90deg, ${COLORS.PRIMARY_BLUE}, ${COLORS.CARD_BG})`,
        color: "#F4F7FA",
        border: "none",
        fontWeight: 600,
        transition: "background 0.3s ease",
    },
    // Estilo para inputs y selects
    INPUT_DARK: {
        backgroundColor: COLORS.CARD_BG,
        color: "white",
        border: `1px solid ${COLORS.INPUT_BORDER}`,
    },
    // Estilo del contenedor principal
    MAIN_CONTAINER: {
        flexGrow: 1, 
        marginLeft: "220px", 
        backgroundColor: COLORS.DARK_BLUE_BG, 
        minHeight: "100vh", 
        padding: "40px 20px", 
        color: "#F4F7FA", 
        position: "relative", 
        zIndex: 0,
    },
};