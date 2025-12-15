import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';

export default function StorageAlerts({ alerts, markAsViewed, loading }) {
    if (loading && alerts.length === 0) {
        return <div className="text-info mb-3"><Spinner animation="border" size="sm"/> Cargando alertas...</div>;
    }
    
    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            <h4 className="text-warning mb-3">🚨 Alertas de Stock Bajo ({alerts.length})</h4>
            {alerts.map((alert) => (
                <Alert key={alert.id} variant="danger" className="d-flex justify-content-between align-items-center shadow-lg border-0" style={{ backgroundColor: '#431919', color: '#fff' }}>
                    <div>
                        <strong>{alert.item_name || alert.item}</strong>
                        <span className='ms-2'>— {alert.message}</span>
                    </div>
                    <Button variant="outline-light" size="sm" onClick={() => markAsViewed(alert.id)}>Ocultar</Button>
                </Alert>
            ))}
        </div>
    );
}