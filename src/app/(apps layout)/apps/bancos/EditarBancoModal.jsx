'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EditarBancoModal = ({ show, onHide, banco, onBancoUpdated }) => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        condiciones: '',
        tipo_producto: '',
        contacto: '',
        documentos_requeridos: {
            cedula: '',
            extractos: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Actualizar el formulario cuando cambia el banco
    useEffect(() => {
        if (banco) {
            setFormData({
                nombre: banco.nombre || '',
                condiciones: banco.condiciones || '',
                tipo_producto: banco.tipo_producto || '',
                contacto: banco.contacto || '',
                documentos_requeridos: banco.documentos_requeridos || {
                    cedula: '',
                    extractos: ''
                }
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
            // Preparar datos para actualizar en la base de datos
            const bancoActualizado = {
                nombre: formData.nombre,
                condiciones: formData.condiciones,
                tipo_producto: formData.tipo_producto,
                contacto: formData.contacto,
                documentos_requeridos: formData.documentos_requeridos
            };
            
            // Actualizar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('bancos')
                .update(bancoActualizado)
                .eq('id', banco.id)
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al actualizar el banco: ${supabaseError.message}`);
            }
            
            console.log('Banco actualizado exitosamente:', data);
            
            // Cerrar modal
            onHide();
            
            // Notificar al componente padre para actualizar la lista
            if (onBancoUpdated && typeof onBancoUpdated === 'function') {
                onBancoUpdated(data[0]);
            }
        } catch (err) {
            console.error('Error al actualizar el banco:', err);
            setError(err.message || 'Error al actualizar el banco. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Banco</Modal.Title>
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
                                value={formData.documentos_requeridos?.cedula || ''}
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
                                value={formData.documentos_requeridos?.extractos || ''}
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
                            'Guardar Cambios'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditarBancoModal;