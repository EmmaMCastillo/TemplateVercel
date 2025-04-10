'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const EditarBancoModal = ({ show, onHide, banco }) => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        tasaInteres: '',
        plazoMaximo: '',
        estado: 'Activo'
    });

    // Actualizar el formulario cuando cambia el banco
    useEffect(() => {
        if (banco) {
            setFormData({
                nombre: banco.nombre || '',
                codigo: banco.codigo || '',
                tasaInteres: banco.tasaInteres || '',
                plazoMaximo: banco.plazoMaximo || '',
                estado: banco.estado || 'Activo'
            });
        }
    }, [banco]);

    // Si no hay banco, mostrar un modal con un mensaje
    if (!banco) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Banco</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún banco para editar.</p>
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
        // Aquí iría la lógica para actualizar el banco
        console.log('Datos actualizados del banco:', formData);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Banco</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Nombre del Banco</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre del banco"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                placeholder="Ej: PICH"
                                required
                            />
                        </Col>
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Tasa de Interés</Form.Label>
                            <Form.Control
                                type="text"
                                name="tasaInteres"
                                value={formData.tasaInteres}
                                onChange={handleChange}
                                placeholder="Ej: 5%"
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Plazo Máximo</Form.Label>
                            <Form.Control
                                type="text"
                                name="plazoMaximo"
                                value={formData.plazoMaximo}
                                onChange={handleChange}
                                placeholder="Ej: 30 días"
                                required
                            />
                        </Col>
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Logo del Banco</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                            />
                            <Form.Text className="text-muted">
                                Sube una imagen con el logo del banco (opcional)
                            </Form.Text>
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

export default EditarBancoModal;