'use client';
import React from 'react';
import { Button, Col, Modal, Row, Spinner } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con valores directos
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE4NzEsImV4cCI6MjA1OTIyNzg3MX0.P25CoZR3XGsXv0I3E_QMbFsTO-GmJoLsZfxblADhTRs'
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
                    <p>No se ha seleccionado ningún prospecto para ver.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    // Función para crear una solicitud a partir del prospecto
    const crearSolicitud = async () => {
        try {
            // Redirigir a la página de solicitudes
            window.location.href = '/apps/solicitudes';
        } catch (error) {
            console.error('Error al redirigir:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Prospecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col sm={6}>
                        <h5 className="mb-1">Información Personal</h5>
                        <p className="mb-0"><strong>Nombre:</strong> {prospecto.nombre}</p>
                        <p className="mb-0"><strong>Cédula/RUC:</strong> {prospecto.cedula}</p>
                        <p className="mb-0"><strong>Teléfono:</strong> {prospecto.celular}</p>
                        <p className="mb-0"><strong>Email:</strong> {prospecto.email}</p>
                    </Col>
                    <Col sm={6}>
                        <h5 className="mb-1">Información Adicional</h5>
                        <p className="mb-0"><strong>Ubicación:</strong> {prospecto.ubicacion || 'No especificada'}</p>
                        <p className="mb-0"><strong>Origen:</strong> {prospecto.origen || 'No especificado'}</p>
                        <p className="mb-0">
                            <strong>Fecha de registro:</strong> {
                                prospecto.created_at 
                                ? new Date(prospecto.created_at).toLocaleDateString('es-ES') 
                                : 'No disponible'
                            }
                        </p>
                        <p className="mb-0">
                            <strong>Estado:</strong> {
                                <HkBadge bg="success" soft>
                                    {prospecto.estado || 'Activo'}
                                </HkBadge>
                            }
                        </p>
                    </Col>
                </Row>
                {prospecto.notas && (
                    <Row className="mt-3">
                        <Col sm={12}>
                            <h5 className="mb-1">Notas</h5>
                            <p>{prospecto.notas}</p>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={crearSolicitud}>
                    Crear Solicitud
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerProspectoModal;