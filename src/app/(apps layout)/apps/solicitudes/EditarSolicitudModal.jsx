'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditarSolicitudModal = ({ show, onHide, solicitud }) => {
    const [formData, setFormData] = useState({
        cliente: '',
        monto: '',
        vehiculo: '',
        asesor: '',
        banco: '',
        estado: ''
    });

    useEffect(() => {
        if (solicitud) {
            setFormData({
                cliente: solicitud.cliente || '',
                monto: solicitud.monto || '',
                vehiculo: solicitud.vehiculo || '',
                asesor: solicitud.asesor || '',
                banco: solicitud.banco || '',
                estado: solicitud.estado || ''
            });
        }
    }, [solicitud]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos actualizados de solicitud:', formData);
        // Aquí iría la lógica para actualizar la solicitud
        onHide();
    };

    if (!solicitud) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Solicitud {solicitud.id}</Modal.Title>
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
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar estado</option>
                                    <option value="CREADA">CREADA</option>
                                    <option value="ENVIADA A BANCO">ENVIADA A BANCO</option>
                                    <option value="APROBADA">APROBADA</option>
                                    <option value="RECHAZADA">RECHAZADA</option>
                                    <option value="DESEMBOLSADA">DESEMBOLSADA</option>
                                    <option value="MATRICULADA">MATRICULADA</option>
                                    <option value="COMPLETADA">COMPLETADA</option>
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
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditarSolicitudModal;