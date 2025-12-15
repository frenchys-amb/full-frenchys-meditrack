import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { STYLES, COLORS } from './StorageStyles';

export default function StorageCategoryCards({ groupedItems, setSelectedCategory, setShowCategoryModal }) {
    
    const handleCardClick = (group) => {
        setSelectedCategory(group);
        setShowCategoryModal(true);
    };

    return (
        <Row>
            {groupedItems.map((group) => (
                <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={group.value}>
                    <div 
                        className="p-4 rounded-3 text-center h-100 shadow-lg" 
                        style={{ backgroundColor: COLORS.CARD_BG, border: `2px solid ${COLORS.PRIMARY_BLUE}`, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onClick={() => handleCardClick(group)}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; }}
                    >
                        <h5 className="fw-bold mb-2" style={{ color: COLORS.HIGHLIGHT_CYAN }}>{group.label}</h5>
                        <p className="text-info mb-3">{group.items.length} ítems en stock</p>
                        <button className="btn btn-sm w-100" style={STYLES.BUTTON_PRIMARY}>Ver Detalles</button>
                    </div>
                </Col>
            ))}
        </Row>
    );
}