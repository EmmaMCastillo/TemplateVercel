'use client';
import React from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';
import { FileText } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';

const VerSolicitudModal = ({ show, onHide, solicitud }) => {
    if (!solicitud) return null;

    // Función para obtener la clase de badge según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'CREADA':
                return 'primary';
            case 'ENVIADA A BANCO':
                return 'info';
            case 'APROBADA':
                return 'success';
            case 'RECHAZADA':
                return 'danger';
            case 'DESEMBOLSADA':
                return 'warning';
            case 'MATRICULADA':
                return 'violet';
            case 'COMPLETADA':
                return 'dark';
            default:
                return 'secondary';
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de Solicitud {solicitud.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-4">
                    <Col md={6}>
                        <h5>Información del Cliente</h5>
                        <Table borderless size="sm">
                            <tbody>
                                <tr>
                                    <td className="fw-medium">Cliente:</td>
                                    <td>{solicitud.cliente}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Vehículo:</td>
                                    <td>{solicitud.vehiculo}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Monto:</td>
                                    <td>{solicitud.monto}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <h5>Información de la Solicitud</h5>
                        <Table borderless size="sm">
                            <tbody>
                                <tr>
                                    <td className="fw-medium">Asesor:</td>
                                    <td>{solicitud.asesor}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Banco:</td>
                                    <td>{solicitud.banco}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Fecha:</td>
                                    <td>{solicitud.fecha}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Estado:</td>
                                    <td>
                                        <HkBadge bg={getBadgeClass(solicitud.estado)} soft>
                                            {solicitud.estado}
                                        </HkBadge>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <h5>Documentos</h5>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            <Button variant="outline-secondary" size="sm">
                                <FileText size={16} className="me-1" />
                                Cédula.pdf
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <FileText size={16} className="me-1" />
                                Matrícula.pdf
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                                <FileText size={16} className="me-1" />
                                Solicitud_Firmada.pdf
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerSolicitudModal;