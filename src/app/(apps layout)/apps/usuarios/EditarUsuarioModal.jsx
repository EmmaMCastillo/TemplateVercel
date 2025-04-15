'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Alert } from 'react-bootstrap';
import { supabase, supabaseAdmin } from '@/utils/supabase';

const EditarUsuarioModal = ({ show, onHide, usuario, onUsuarioUpdated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'usuario'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.user_metadata?.nombre || usuario.nombre || '',
                email: usuario.email || '',
                password: '',
                rol: usuario.user_metadata?.rol || usuario.rol || 'usuario'
            });
            setChangePassword(false);
        }
    }, [usuario]);

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
            if (!usuario) {
                throw new Error('No se ha seleccionado ningún usuario para editar');
            }
            
            // Validar datos
            if (!formData.nombre.trim()) {
                throw new Error('El nombre es obligatorio');
            }
            
            if (!formData.email.trim()) {
                throw new Error('El email es obligatorio');
            }
            
            if (changePassword && !formData.password.trim()) {
                throw new Error('La contraseña es obligatoria si desea cambiarla');
            }
            
            // Actualizar usuario en Supabase Auth
            const updateData = {
                email: formData.email,
                user_metadata: {
                    nombre: formData.nombre,
                    rol: formData.rol
                }
            };
            
            // Incluir contraseña solo si se va a cambiar
            if (changePassword && formData.password.trim()) {
                updateData.password = formData.password;
            }
            
            // Actualizar usuario usando la API de administrador
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
                usuario.id,
                updateData
            );
            
            if (authError) {
                throw new Error(`Error al actualizar el usuario: ${authError.message}`);
            }
            
            console.log('Usuario actualizado exitosamente:', authData);
            
            // Mostrar mensaje de éxito
            setSuccess(true);
            
            // Notificar al componente padre para actualizar la lista
            if (onUsuarioUpdated && typeof onUsuarioUpdated === 'function') {
                onUsuarioUpdated(authData.user);
            }
            
            // Cerrar modal después de un tiempo
            setTimeout(() => {
                if (success) onHide();
            }, 2000);
        } catch (err) {
            console.error('Error al actualizar el usuario:', err);
            setError(err.message || 'Error al actualizar el usuario. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún usuario para editar.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Editar Usuario</Modal.Title>
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
                            Usuario actualizado exitosamente.
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
                            <Form.Check
                                type="checkbox"
                                id="change-password"
                                label="Cambiar contraseña"
                                checked={changePassword}
                                onChange={(e) => setChangePassword(e.target.checked)}
                                disabled={loading}
                            />
                        </Col>
                        {changePassword && (
                            <Col sm={12} className="form-group mb-3">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingrese nueva contraseña"
                                    required={changePassword}
                                    disabled={loading}
                                />
                            </Col>
                        )}
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
                            'Guardar Cambios'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditarUsuarioModal;