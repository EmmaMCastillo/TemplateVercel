'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const NuevaSolicitudModal = ({ show, onHide }) => {
    const [formData, setFormData] = useState({
        cliente: '',
        monto: '',
        vehiculo: '',
        asesor: '',
        banco: ''
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
        console.log('Datos de nueva solicitud:', formData);
        // Aquí iría la lógica para guardar la nueva solicitud
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Solicitud de Crédito</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cliente"
                                    value={formData.cliente}
                                    onChange={handleChange}
                                    placeholder="Nombre completo del cliente"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Monto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="monto"
                                    value={formData.monto}
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
                                <Form.Label>Vehículo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="vehiculo"
                                    value={formData.vehiculo}
                                    onChange={handleChange}
                                    placeholder="Marca, modelo y año"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Asesor</Form.Label>
                                <Form.Select
                                    name="asesor"
                                    value={formData.asesor}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar asesor</option>
                                    <option value="Carlos Mendoza">Carlos Mendoza</option>
                                    <option value="Ana Salazar">Ana Salazar</option>
                                    <option value="Luis Torres">Luis Torres</option>
                                    <option value="María Sánchez">María Sánchez</option>
                                    <option value="Pedro Alvarado">Pedro Alvarado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar Solicitud
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NuevaSolicitudModal;