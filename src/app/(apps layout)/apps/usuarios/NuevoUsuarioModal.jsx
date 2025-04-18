'use client';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Alert } from 'react-bootstrap';
import { supabase, supabaseAdmin } from '@/utils/supabase';

const NuevoUsuarioModal = ({ show, onHide, onUsuarioCreated }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '', // Añadido campo de teléfono
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

    // Función para enviar correo de bienvenida (separada para no bloquear la creación de usuario)
    const sendWelcomeEmail = async (email, nombre, temporaryPassword) => {
        try {
            console.log('Enviando correo de bienvenida a:', email);
            const response = await fetch('/api/auth/send-welcome-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nombre,
                    temporaryPassword
                }),
            });
            
            const result = await response.json();
            console.log('Resultado del envío de correo:', result);
            return { success: true, result };
        } catch (error) {
            console.error('Error al enviar correo de bienvenida:', error);
            return { success: false, error };
        }
    };

    // Función para enviar notificación de WhatsApp (separada para no bloquear la creación de usuario)
    const sendWhatsappNotification = async (phoneNumber, nombre) => {
        try {
            console.log('Enviando notificación de WhatsApp a:', phoneNumber);
            const response = await fetch('/api/auth/send-whatsapp-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    nombre
                }),
            });
            
            const result = await response.json();
            console.log('Resultado del envío de WhatsApp:', result);
            return { success: true, result };
        } catch (error) {
            console.error('Error al enviar notificación de WhatsApp:', error);
            return { success: false, error };
        }
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
            
            // Crear usuario en Supabase Auth
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
            
            console.log('Usuario creado exitosamente en Auth');
            
            // Configurar roles y permisos (si es necesario)
            if (formData.rol) {
                try {
                    const { data: existingRole } = await supabase
                        .from('roles_permisos')
                        .select('id')
                        .eq('rol_id', formData.rol)
                        .single();
                    
                    if (!existingRole) {
                        await supabase
                            .from('roles_permisos')
                            .insert([
                                {
                                    rol_id: formData.rol,
                                    permisos: {}
                                }
                            ]);
                    }
                } catch (roleErr) {
                    console.warn('Error al configurar roles y permisos:', roleErr);
                    // Continuamos con el proceso aunque haya un error en esta parte
                }
            }
            
            // Mostrar mensaje de éxito inmediatamente
            setSuccess(true);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                email: '',
                password: '',
                telefono: '',
                rol: 'usuario'
            });
            
            // Notificar al componente padre para actualizar la lista
            if (onUsuarioCreated && typeof onUsuarioCreated === 'function') {
                onUsuarioCreated(authData.user);
            }
            
            // Cerrar modal después de un tiempo
            setTimeout(() => {
                onHide();
            }, 2000);
            
            // Enviar correo de bienvenida en segundo plano (no esperamos a que termine)
            if (!formData.password.trim()) {
                // Solo enviamos el correo si se generó una contraseña automáticamente
                sendWelcomeEmail(formData.email, formData.nombre, password)
                    .then(emailResult => {
                        if (!emailResult.success) {
                            console.warn('No se pudo enviar el correo de bienvenida, pero el usuario fue creado correctamente');
                        }
                    })
                    .catch(emailError => {
                        console.error('Error al enviar correo de bienvenida:', emailError);
                    });
            }
            
            // Enviar notificación de WhatsApp en segundo plano (si se proporcionó un número de teléfono)
            if (formData.telefono.trim()) {
                sendWhatsappNotification(formData.telefono, formData.nombre)
                    .then(whatsappResult => {
                        if (!whatsappResult.success) {
                            console.warn('No se pudo enviar la notificación de WhatsApp, pero el usuario fue creado correctamente');
                        }
                    })
                    .catch(whatsappError => {
                        console.error('Error al enviar notificación de WhatsApp:', whatsappError);
                    });
            }
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
                            Usuario creado exitosamente. Se ha enviado un correo de bienvenida y una notificación por WhatsApp (si se proporcionó un número).
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
                            <Form.Label>Teléfono (WhatsApp)</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ej: +573153041548"
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Incluya el código de país con el formato internacional (ej: +573153041548)
                            </Form.Text>
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