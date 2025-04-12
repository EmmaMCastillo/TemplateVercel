'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NuevoBancoModal = ({ show, onHide, onBancoCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        condiciones: '',
        tipo_producto: '',
        contacto: '',
        documentos_requeridos: {
            cedula: 'Cédula de ciudadanía',
            extractos: 'Extractos bancarios últimos 3 meses'
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            // Manejar campos anidados (como documentos_requeridos.cedula)
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            // Manejar campos normales
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Preparar datos para guardar en la base de datos
            const nuevoBanco = {
                nombre: formData.nombre,
                condiciones: formData.condiciones,
                tipo_producto: formData.tipo_producto,
                contacto: formData.contacto,
                documentos_requeridos: formData.documentos_requeridos
            };
            
            // Guardar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('bancos')
                .insert([nuevoBanco])
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al guardar el banco: ${supabaseError.message}`);
            }
            
            console.log('Banco guardado exitosamente:', data);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                condiciones: '',
                tipo_producto: '',
                contacto: '',
                documentos_requeridos: {
                    cedula: 'Cédula de ciudadanía',
                    extractos: 'Extractos bancarios últimos 3 meses'
                }
            });
            
            // Cerrar modal
            onHide();
            
            // Notificar al componente padre para actualizar la lista
            if (onBancoCreated && typeof onBancoCreated === 'function') {
                onBancoCreated(data[0]);
            }
        } catch (err) {
            console.error('Error al guardar el banco:', err);
            setError(err.message || 'Error al guardar el banco. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Banco</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
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
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Tipo de Producto</Form.Label>
                            <Form.Control
                                type="text"
                                name="tipo_producto"
                                value={formData.tipo_producto}
                                onChange={handleChange}
                                placeholder="Ej: Crédito de libre inversión, Crédito hipotecario"
                                required
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Condiciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="condiciones"
                                value={formData.condiciones}
                                onChange={handleChange}
                                placeholder="Ej: Tasa desde 1.2% mensual, plazo hasta 60 meses"
                                required
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Contacto</Form.Label>
                            <Form.Control
                                type="email"
                                name="contacto"
                                value={formData.contacto}
                                onChange={handleChange}
                                placeholder="Ej: contacto@banco.com"
                                required
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="mb-3">
                            <h6>Documentos Requeridos</h6>
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control
                                type="text"
                                name="documentos_requeridos.cedula"
                                value={formData.documentos_requeridos.cedula}
                                onChange={handleChange}
                                placeholder="Descripción del documento"
                                disabled={loading}
                            />
                        </Col>
                        <Col sm={6} className="form-group mb-3">
                            <Form.Label>Extractos Bancarios</Form.Label>
                            <Form.Control
                                type="text"
                                name="documentos_requeridos.extractos"
                                value={formData.documentos_requeridos.extractos}
                                onChange={handleChange}
                                placeholder="Descripción del documento"
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NuevoBancoModal;