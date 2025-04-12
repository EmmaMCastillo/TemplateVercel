'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Alert } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NuevoUsuarioModal = ({ show, onHide, onUsuarioCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'usuario'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);
        
        try {
            // Validar datos
            if (!formData.nombre.trim()) {
                throw new Error('El nombre es obligatorio');
            }
            
            if (!formData.email.trim()) {
                throw new Error('El email es obligatorio');
            }
            
            if (!formData.password.trim()) {
                throw new Error('La contraseña es obligatoria');
            }
            
            // Preparar datos para guardar en la base de datos
            const nuevoUsuario = {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                rol: formData.rol
            };
            
            // Guardar en Supabase
            const { data, error: supabaseError } = await supabase
                .from('usuarios')
                .insert([nuevoUsuario])
                .select();
            
            if (supabaseError) {
                throw new Error(`Error al guardar el usuario: ${supabaseError.message}`);
            }
            
            console.log('Usuario guardado exitosamente:', data);
            
            // Mostrar mensaje de éxito
            setSuccess(true);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                email: '',
                password: '',
                rol: 'usuario'
            });
            
            // Notificar al componente padre para actualizar la lista
            if (onUsuarioCreated && typeof onUsuarioCreated === 'function') {
                onUsuarioCreated(data[0]);
            }
            
            // Cerrar modal después de un tiempo
            setTimeout(() => {
                if (success) onHide();
            }, 2000);
        } catch (err) {
            console.error('Error al guardar el usuario:', err);
            setError(err.message || 'Error al guardar el usuario. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Usuario</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert variant="success" className="mb-3">
                            Usuario creado exitosamente.
                        </Alert>
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
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingrese contraseña"
                                required
                                disabled={loading}
                            />
                        </Col>
                        <Col sm={12} className="form-group mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="admin">Administrador</option>
                                <option value="ejecutivo">Ejecutivo</option>
                                <option value="comisionista">Comisionista</option>
                                <option value="operaciones">Operaciones</option>
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
                            'Guardar'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NuevoUsuarioModal;