'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const EditarProspectoModal = ({ show, onHide, prospecto }) => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        asesor: '',
        canal: 'Orgánico',
        observaciones: 'Cliente interesado en un crédito para vehículo nuevo. Requiere financiamiento del 70% del valor.'
    });

    // Actualizar el formulario cuando cambia el prospecto
    useEffect(() => {
        if (prospecto) {
            setFormData({
                nombre: prospecto.nombre || '',
                cedula: prospecto.cedula || '',
                telefono: prospecto.telefono || '',
                email: prospecto.email || '',
                asesor: prospecto.asesor || '',
                canal: 'Orgánico', // Valor por defecto
                observaciones: 'Cliente interesado en un crédito para vehículo nuevo. Requiere financiamiento del 70% del valor.' // Valor por defecto
            });
        }
    }, [prospecto]);

    // Si no hay prospecto, mostrar un modal con un mensaje
    if (!prospecto) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Prospecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún prospecto para editar.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para actualizar el prospecto
        console.log('Datos actualizados del prospecto:', formData);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Prospecto</Modal.Title>
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
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="estado"
                                defaultValue={prospecto.estado}
                                required
                            >
                                <option value="CREADA">CREADA</option>
                                <option value="STAND BY">STAND BY</option>
                                <option value="SUJETO">SUJETO</option>
                                <option value="NO SUJETO">NO SUJETO</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditarProspectoModal;