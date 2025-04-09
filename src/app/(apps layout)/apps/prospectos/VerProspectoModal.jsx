'use client';
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';

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

    // Función para obtener la clase de badge según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'CREADA':
                return 'success';
            case 'STAND BY':
                return 'warning';
            case 'SUJETO':
                return 'primary';
            case 'NO SUJETO':
                return 'danger';
            default:
                return 'secondary';
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
                        <h5 className="mb-0">{prospecto.nombre}</h5>
                        <div className="mt-1">
                            <HkBadge bg={getBadgeClass(prospecto.estado)} soft>
                                {prospecto.estado}
                            </HkBadge>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="text-muted mb-1">Cédula/RUC</div>
                        <div className="fw-medium">{prospecto.cedula}</div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="text-muted mb-1">Teléfono</div>
                        <div className="fw-medium">{prospecto.telefono}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="text-muted mb-1">Email</div>
                        <div className="fw-medium">{prospecto.email}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="text-muted mb-1">Asesor</div>
                        <div className="fw-medium">{prospecto.asesor}</div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div className="text-muted mb-1">Fecha de Creación</div>
                        <div className="fw-medium">{prospecto.fecha}</div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12}>
                        <div className="text-muted mb-1">Canal de Ingreso</div>
                        <div className="fw-medium">Orgánico</div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="text-muted mb-1">Observaciones</div>
                        <div className="fw-medium">
                            Cliente interesado en un crédito para vehículo nuevo. Requiere financiamiento del 70% del valor.
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary">
                    Crear Solicitud
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerProspectoModal;