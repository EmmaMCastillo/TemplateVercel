'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EditarProspectoModal = ({ show, onHide, prospecto, onProspectoUpdated }) => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        asesor: '',
        canal: '',
        observaciones: '',
        estado: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Actualizar el formulario cuando cambia el prospecto
    useEffect(() => {
        if (prospecto) {
            setFormData({
                nombre: prospecto.nombre || '',
                cedula: prospecto.cedula || '',
                telefono: prospecto.telefono || '',
                email: prospecto.email || '',
                asesor: prospecto.asesor || '',
                canal: prospecto.canal || 'Orgánico',
                observaciones: prospecto.observaciones || '',
                estado: prospecto.estado || 'NUEVO'
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Preparar datos para actualizar en la base de datos
            const prospectoActualizado = {
                nombre: formData.nombre,
                cedula: formData.cedula,
                telefono: formData.telefono,
                email: formData.email,
                asesor: formData.asesor,
                canal: formData.canal,
                observaciones: formData.observaciones,
                estado: formData.estado
            };
            
            // Actualizar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('prospectos')
                .update(prospectoActualizado)
                .eq('id', prospecto.id)
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al actualizar el prospecto: ${supabaseError.message}`);
            }
            
            console.log('Prospecto actualizado exitosamente:', data);
            
            // Cerrar modal
            onHide();
            
            // Notificar al componente padre para actualizar la lista
            if (onProspectoUpdated && typeof onProspectoUpdated === 'function') {
                onProspectoUpdated(data[0]);
            }
        } catch (err) {
            console.error('Error al actualizar el prospecto:', err);
            setError(err.message || 'Error al actualizar el prospecto. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Prospecto</Modal.Title>
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
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="NUEVO">NUEVO</option>
                                <option value="CONTACTADO">CONTACTADO</option>
                                <option value="INTERESADO">INTERESADO</option>
                                <option value="NO INTERESADO">NO INTERESADO</option>
                                <option value="STAND BY">STAND BY</option>
                                <option value="SUJETO">SUJETO</option>
                                <option value="NO SUJETO">NO SUJETO</option>
                            </Form.Select>
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

export default EditarProspectoModal;