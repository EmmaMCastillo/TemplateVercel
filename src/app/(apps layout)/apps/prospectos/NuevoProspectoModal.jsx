'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const NuevoProspectoModal = ({ show, onHide }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        asesor: '',
        canal: '',
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
        // Aquí iría la lógica para guardar el nuevo prospecto
        console.log('Datos del nuevo prospecto:', formData);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Prospecto</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese nombre completo"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Cédula/RUC</Form.Label>
                            <Form.Control
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                placeholder="Ingrese cédula o RUC"
                                required
                            />
                        </Col>
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ingrese número de teléfono"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ingrese correo electrónico"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Asesor</Form.Label>
                            <Form.Select
                                name="asesor"
                                value={formData.asesor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un asesor</option>
                                <option value="Carlos Mendoza">Carlos Mendoza</option>
                                <option value="Luis Torres">Luis Torres</option>
                                <option value="Ana Salazar">Ana Salazar</option>
                                <option value="Pedro Alvarado">Pedro Alvarado</option>
                            </Form.Select>
                        </Col>
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Canal de Ingreso</Form.Label>
                            <Form.Select
                                name="canal"
                                value={formData.canal}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un canal</option>
                                <option value="Orgánico">Orgánico</option>
                                <option value="Referido">Referido</option>
                                <option value="Broker">Broker</option>
                                <option value="Vitrina">Vitrina</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                placeholder="Ingrese observaciones"
                                rows={3}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NuevoProspectoModal;