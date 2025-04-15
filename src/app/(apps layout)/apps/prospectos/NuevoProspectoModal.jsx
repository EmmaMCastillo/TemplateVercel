'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, InputGroup } from 'react-bootstrap';
import { supabase } from '@/utils/supabase';

const NuevoProspectoModal = ({ show, onHide, onProspectoCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        codigoPais: '+593', // Ecuador por defecto
        celular: '',
        email: '',
        ubicacion: '',
        origen: '',
        notas: ''
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
            // Validar campos obligatorios
            if (!formData.nombre.trim()) {
                throw new Error('El nombre es obligatorio');
            }
            
            if (!formData.celular.trim()) {
                throw new Error('El número de teléfono es obligatorio');
            }
            
            // Formatear el número de teléfono con el código de país
            // Eliminar cualquier 0 inicial del número
            const numeroSinCero = formData.celular.replace(/^0+/, '');
            const numeroCompleto = `${formData.codigoPais}${numeroSinCero}`;
            
            console.log('Guardando número de teléfono:', numeroCompleto);
            
            // Preparar datos para guardar en la base de datos
            const nuevoProspecto = {
                nombre: formData.nombre,
                cedula: formData.cedula,
                celular: numeroCompleto, // Guardar con código de país
                email: formData.email,
                ubicacion: formData.ubicacion,
                origen: formData.origen || 'Orgánico', // Valor por defecto
                notas: formData.notas
            };
            
            // Guardar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('prospectos')
                .insert([nuevoProspecto])
                .select();
            
            if (supabaseError) {
                console.error('Error de Supabase:', supabaseError);
                throw new Error(`Error al guardar el prospecto: ${supabaseError.message}`);
            }
            
            console.log('Prospecto guardado exitosamente:', data);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                cedula: '',
                codigoPais: '+593',
                celular: '',
                email: '',
                ubicacion: '',
                origen: '',
                notas: ''
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
                            <InputGroup>
                                <Form.Select
                                    name="codigoPais"
                                    value={formData.codigoPais}
                                    onChange={handleChange}
                                    style={{ maxWidth: '120px' }}
                                    required
                                    disabled={loading}
                                >
                                    <option value="+593">🇪🇨 +593</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+57">🇨🇴 +57</option>
                                    <option value="+51">🇵🇪 +51</option>
                                    <option value="+56">🇨🇱 +56</option>
                                    <option value="+54">🇦🇷 +54</option>
                                    <option value="+52">🇲🇽 +52</option>
                                    <option value="+34">🇪🇸 +34</option>
                                </Form.Select>
                                <Form.Control
                                    type="tel"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    placeholder="Número sin 0 inicial"
                                    required
                                    disabled={loading}
                                />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Ingrese el número sin el 0 inicial. Ejemplo: 987654321
                            </Form.Text>
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
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                placeholder="Ingrese ubicación"
                                required
                                disabled={loading}
                            />
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Origen</Form.Label>
                            <Form.Select
                                name="origen"
                                value={formData.origen}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">Seleccione un origen</option>
                                <option value="Orgánico">Orgánico</option>
                                <option value="Referido">Referido</option>
                                <option value="Broker">Broker</option>
                                <option value="Vitrina">Vitrina</option>
                                <option value="Redes sociales">Redes sociales</option>
                                <option value="Campaña email">Campaña email</option>
                                <option value="Evento">Evento</option>
                                <option value="Sitio web">Sitio web</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="gx-3">
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Notas</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                placeholder="Ingrese notas"
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