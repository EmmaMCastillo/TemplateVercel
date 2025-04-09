'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { CurrencyDollar, Calendar } from 'tabler-icons-react';

const DesembolsoModal = ({ show, onHide, solicitud }) => {
    const [formData, setFormData] = useState({
        fechaDesembolso: '',
        montoDesembolsado: '',
        numeroCuenta: '',
        banco: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de desembolso:', formData);
        // Aquí iría la lógica para registrar el desembolso
        onHide();
    };

    if (!solicitud) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Desembolso - Solicitud {solicitud.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-success mb-4">
                    <div className="d-flex align-items-center">
                        <CurrencyDollar size={24} className="me-2" />
                        <div>
                            <h6 className="mb-0">Solicitud Aprobada</h6>
                            <p className="mb-0">La solicitud ha sido aprobada por {solicitud.banco} por un monto de {solicitud.monto}</p>
                        </div>
                    </div>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Desembolso</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaDesembolso"
                                    value={formData.fechaDesembolso}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Monto Desembolsado</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="montoDesembolsado"
                                    value={formData.montoDesembolsado}
                                    onChange={handleChange}
                                    placeholder="Ej: $25,000.00"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de Cuenta</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numeroCuenta"
                                    value={formData.numeroCuenta}
                                    onChange={handleChange}
                                    placeholder="Número de cuenta para el desembolso"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Banco</Form.Label>
                                <Form.Select
                                    name="banco"
                                    value={formData.banco}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar banco</option>
                                    <option value="Banco Pichincha">Banco Pichincha</option>
                                    <option value="Banco Guayaquil">Banco Guayaquil</option>
                                    <option value="Banco Bolivariano">Banco Bolivariano</option>
                                    <option value="Banco Internacional">Banco Internacional</option>
                                    <option value="Produbanco">Produbanco</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Observaciones adicionales sobre el desembolso"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <div className="alert alert-info mt-3">
                    <div className="d-flex align-items-center">
                        <Calendar size={24} className="me-2" />
                        <div>
                            <h6 className="mb-0">Próximos Pasos</h6>
                            <p className="mb-0">Una vez registrado el desembolso, la solicitud pasará al estado "DESEMBOLSADA" y se podrá proceder con la matriculación del vehículo.</p>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    Registrar Desembolso
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DesembolsoModal;