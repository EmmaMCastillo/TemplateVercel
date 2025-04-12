'use client';
import React from 'react';
import { Button, Col, Modal, Row, Spinner } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const VerProspectoModal = ({ show, onHide, prospecto }) => {
    // Si no hay prospecto, mostrar un modal con un mensaje
    if (!prospecto) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Prospecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún prospecto.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return dateString;
        }
    };

    // Función para crear una solicitud a partir del prospecto
    const handleCrearSolicitud = async () => {
        try {
            // Aquí iría la lógica para crear una solicitud a partir del prospecto
            // Por ahora, solo mostramos un mensaje en la consola
            console.log('Crear solicitud para el prospecto:', prospecto);
            
            // Redirigir a la página de solicitudes
            window.location.href = '/apps/solicitudes';
        } catch (error) {
            console.error('Error al crear la solicitud:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Prospecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col xs={12} className="mb-3">
                        <h5 className="mb-0">{prospecto.nombre || 'Sin nombre'}</h5>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="text-muted mb-1">Cédula/RUC</div>
                        <div className="fw-medium">{prospecto.cedula || 'No disponible'}</div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="text-muted mb-1">Teléfono</div>
                        <div className="fw-medium">{prospecto.celular || 'No disponible'}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="text-muted mb-1">Email</div>
                        <div className="fw-medium">{prospecto.email || 'No disponible'}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="text-muted mb-1">Ubicación</div>
                        <div className="fw-medium">{prospecto.ubicacion || 'No disponible'}</div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="text-muted mb-1">Fecha de Creación</div>
                        <div className="fw-medium">{formatDate(prospecto.created_at)}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="text-muted mb-1">Origen</div>
                        <div className="fw-medium">{prospecto.origen || 'No especificado'}</div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="text-muted mb-1">Notas</div>
                        <div className="fw-medium">
                            {prospecto.notas || 'Sin notas'}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleCrearSolicitud}>
                    Crear Solicitud
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerProspectoModal;