'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NuevoProspectoModal = ({ show, onHide, onProspectoCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        asesor: '',
        canal: '',
        observaciones: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Preparar datos para guardar en la base de datos
            const nuevoProspecto = {
                nombre: formData.nombre,
                cedula: formData.cedula,
                telefono: formData.telefono,
                email: formData.email,
                asesor: formData.asesor,
                canal: formData.canal,
                observaciones: formData.observaciones,
                estado: 'NUEVO' // Estado por defecto para nuevos prospectos
            };
            
            // Guardar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('prospectos')
                .insert([nuevoProspecto])
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al guardar el prospecto: ${supabaseError.message}`);
            }
            
            console.log('Prospecto guardado exitosamente:', data);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                cedula: '',
                telefono: '',
                email: '',
                asesor: '',
                canal: '',
                observaciones: ''
            });
            
            // Cerrar modal
            onHide();
            
            // Notificar al componente padre para actualizar la lista
            if (onProspectoCreated && typeof onProspectoCreated === 'function') {
                onProspectoCreated(data[0]);
            }
        } catch (err) {
            console.error('Error al guardar el prospecto:', err);
            setError(err.message || 'Error al guardar el prospecto. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Prospecto</Modal.Title>
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
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese nombre completo"
                                required
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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

export default NuevoProspectoModal;