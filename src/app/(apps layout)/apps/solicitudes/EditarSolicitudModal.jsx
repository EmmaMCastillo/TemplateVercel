'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EditarSolicitudModal = ({ show, onHide, solicitud, onSolicitudUpdated }) => {
    const [formData, setFormData] = useState({
        prospecto_id: '',
        valor_credito: '',
        cuotas: 36,
        banco_id: '',
        ejecutivo: '',
        estado: '',
        documentos: {
            cedula: '',
            extractos: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prospectos, setProspectos] = useState([]);
    const [bancos, setBancos] = useState([]);

    // Cargar prospectos y bancos al abrir el modal
    useEffect(() => {
        if (show) {
            fetchProspectos();
            fetchBancos();
        }
    }, [show]);

    // Actualizar el formulario cuando cambia la solicitud
    useEffect(() => {
        if (solicitud) {
            setFormData({
                prospecto_id: solicitud.prospecto_id || '',
                valor_credito: solicitud.valor_credito || '',
                cuotas: solicitud.cuotas || 36,
                banco_id: solicitud.banco_id || '',
                ejecutivo: solicitud.ejecutivo || '',
                estado: solicitud.estado || '',
                documentos: solicitud.documentos || {
                    cedula: '',
                    extractos: ''
                }
            });
        }
    }, [solicitud]);

    // Función para cargar prospectos
    const fetchProspectos = async () => {
        try {
            const { data, error } = await supabase
                .from('prospectos')
                .select('id, nombre, cedula');
            
            if (error) {
                console.error('Error al cargar prospectos:', error);
                setError(`Error al cargar prospectos: ${error.message}`);
            } else {
                setProspectos(data || []);
            }
        } catch (err) {
            console.error('Error general al cargar prospectos:', err);
            setError(`Error al cargar prospectos: ${err.message}`);
        }
    };

    // Función para cargar bancos
    const fetchBancos = async () => {
        try {
            const { data, error } = await supabase
                .from('bancos')
                .select('id, nombre');
            
            if (error) {
                console.error('Error al cargar bancos:', error);
                setError(`Error al cargar bancos: ${error.message}`);
            } else {
                setBancos(data || []);
            }
        } catch (err) {
            console.error('Error general al cargar bancos:', err);
            setError(`Error al cargar bancos: ${err.message}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            // Manejar campos anidados (como documentos.cedula)
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
            const solicitudActualizada = {
                prospecto_id: formData.prospecto_id,
                estado: formData.estado,
                valor_credito: parseFloat(formData.valor_credito),
                cuotas: parseInt(formData.cuotas, 10),
                banco_id: formData.banco_id,
                ejecutivo: formData.ejecutivo,
                documentos: formData.documentos
            };
            
            // Si el estado cambió a "Aprobada", agregar fecha de aprobación
            if (formData.estado === 'Aprobada' && solicitud.estado !== 'Aprobada') {
                solicitudActualizada.fechas_clave = {
                    ...(solicitud.fechas_clave || {}),
                    fecha_aprobacion: new Date().toISOString()
                };
            }
            
            // Actualizar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('solicitudes')
                .update(solicitudActualizada)
                .eq('id', solicitud.id)
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al actualizar la solicitud: ${supabaseError.message}`);
            }
            
            console.log('Solicitud actualizada exitosamente:', data);
            
            // Cerrar modal
            onHide();
            
            // Notificar al componente padre para actualizar la lista
            if (onSolicitudUpdated && typeof onSolicitudUpdated === 'function') {
                onSolicitudUpdated(data[0]);
            }
        } catch (err) {
            console.error('Error al actualizar la solicitud:', err);
            setError(err.message || 'Error al actualizar la solicitud. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!solicitud) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Solicitud</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Prospecto</Form.Label>
                                <Form.Select
                                    name="prospecto_id"
                                    value={formData.prospecto_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar prospecto</option>
                                    {prospectos.map(prospecto => (
                                        <option key={prospecto.id} value={prospecto.id}>
                                            {prospecto.nombre} - {prospecto.cedula}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Valor del Crédito</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="valor_credito"
                                    value={formData.valor_credito}
                                    onChange={handleChange}
                                    placeholder="Ej: 25000000"
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cuotas</Form.Label>
                                <Form.Select
                                    name="cuotas"
                                    value={formData.cuotas}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="12">12 meses</option>
                                    <option value="24">24 meses</option>
                                    <option value="36">36 meses</option>
                                    <option value="48">48 meses</option>
                                    <option value="60">60 meses</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Banco</Form.Label>
                                <Form.Select
                                    name="banco_id"
                                    value={formData.banco_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar banco</option>
                                    {bancos.map(banco => (
                                        <option key={banco.id} value={banco.id}>
                                            {banco.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ejecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ejecutivo"
                                    value={formData.ejecutivo}
                                    onChange={handleChange}
                                    placeholder="Nombre del ejecutivo"
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar estado</option>
                                    <option value="Enviada">Enviada</option>
                                    <option value="En revisión">En revisión</option>
                                    <option value="Aprobada">Aprobada</option>
                                    <option value="Rechazada">Rechazada</option>
                                    <option value="Desembolsada">Desembolsada</option>
                                    <option value="Completada">Completada</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>URL Documento Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="documentos.cedula"
                                    value={formData.documentos?.cedula || ''}
                                    onChange={handleChange}
                                    placeholder="URL del documento de cédula"
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>URL Extractos Bancarios</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="documentos.extractos"
                                    value={formData.documentos?.extractos || ''}
                                    onChange={handleChange}
                                    placeholder="URL de los extractos bancarios"
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
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

export default EditarSolicitudModal;