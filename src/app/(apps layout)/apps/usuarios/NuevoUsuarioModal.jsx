'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Alert } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';

// URL y claves de Supabase
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE4NzEsImV4cCI6MjA1OTIyNzg3MX0.P25CoZR3XGsXv0I3E_QMbFsTO-GmJoLsZfxblADhTRs';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Crear cliente de Supabase
const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Cliente de Supabase con clave de servicio para operaciones administrativas
// Nota: En producción, esto debería manejarse solo en el servidor
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
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

    // Función para generar una contraseña aleatoria
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
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
            
            // Generar contraseña aleatoria si no se proporciona una
            const password = formData.password.trim() || generateRandomPassword();
            
            // Crear usuario en Supabase Auth usando la clave de servicio
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: formData.email,
                password: password,
                email_confirm: true, // Confirmar email automáticamente
                user_metadata: {
                    nombre: formData.nombre,
                    rol: formData.rol
                }
            });
            
            if (authError) {
                throw new Error(`Error al crear el usuario: ${authError.message}`);
            }
            
            console.log('Usuario creado exitosamente en Auth:', authData);
            
            // Guardar información adicional en la tabla roles_permisos si es necesario
            if (formData.rol) {
                // Verificar si ya existe un registro para este rol
                const { data: existingRole } = await supabase
                    .from('roles_permisos')
                    .select('id')
                    .eq('rol_id', formData.rol)
                    .single();
                
                if (!existingRole) {
                    // Crear permisos por defecto para el rol si no existen
                    await supabase
                        .from('roles_permisos')
                        .insert([
                            {
                                rol_id: formData.rol,
                                permisos: {}
                            }
                        ]);
                }
            }
            
            // Enviar correo de bienvenida
            await fetch('/api/auth/send-welcome-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    nombre: formData.nombre,
                    temporaryPassword: !formData.password.trim() ? password : null
                }),
            });
            
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
                onUsuarioCreated(authData.user);
            }
            
            // Cerrar modal después de un tiempo
            setTimeout(() => {
                if (success) onHide();
            }, 2000);
        } catch (err) {
            console.error('Error al crear el usuario:', err);
            setError(err.message || 'Error al crear el usuario. Por favor, intente de nuevo.');
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
                            Usuario creado exitosamente. Se ha enviado un correo de bienvenida.
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
                            <Form.Label>Contraseña (opcional)</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Dejar en blanco para generar automáticamente"
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Si deja este campo en blanco, se generará una contraseña aleatoria y se enviará al usuario por correo electrónico.
                            </Form.Text>
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