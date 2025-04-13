'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Col, Container, Form, InputGroup, Row, Alert, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import CommonFooter1 from '../CommonFooter1';
import { useAuth } from '@/context/AuthContext';

//image
import logo from '@/assets/img/logo-light.png';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, updatePassword } = useAuth();

    useEffect(() => {
        // Verificar si el usuario está autenticado para el restablecimiento de contraseña
        const checkSession = async () => {
            // Si no hay usuario y no hay token en la URL, redirigir a la página de inicio de sesión
            if (!user && !searchParams.get('token')) {
                router.push('/auth/login/classic');
            }
        };
        
        checkSession();
    }, [router, searchParams, user]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar contraseñas
            if (!password.trim()) {
                throw new Error('La contraseña es obligatoria');
            }

            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            // Actualizar contraseña usando el contexto de autenticación
            const { success, error: updateError } = await updatePassword(password);

            if (!success) {
                throw new Error(updateError || 'Error al actualizar la contraseña');
            }

            // Mostrar mensaje de éxito
            setSuccess(true);
            
            // Limpiar formulario
            setPassword('');
            setConfirmPassword('');
            
            // Redirigir después de un tiempo
            setTimeout(() => {
                router.push('/auth/login/classic');
            }, 3000);
        } catch (err) {
            console.error('Error al actualizar contraseña:', err);
            setError(err.message || 'Error al actualizar la contraseña. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
            <div className="hk-pg-body pt-0 pb-xl-0">
                <Container>
                    <Row>
                        <Col sm={10} className="position-relative mx-auto">
                            <div className="auth-content py-8">
                                <Form className="w-100" onSubmit={handleUpdatePassword}>
                                    <Row>
                                        <Col lg={5} md={7} sm={10} className="mx-auto">
                                            <div className="text-center mb-7">
                                                <Link href="/" className="navbar-brand me-0">
                                                    <Image className="brand-img d-inline-block" src={logo} alt="brand" />
                                                </Link>
                                            </div>
                                            <Card className="card-flush">
                                                <Card.Body className="text-center">
                                                    <h4>Actualizar contraseña</h4>
                                                    <p className="mb-4">Ingrese su nueva contraseña</p>
                                                    
                                                    {error && (
                                                        <Alert variant="danger" className="mb-3">
                                                            {error}
                                                        </Alert>
                                                    )}
                                                    
                                                    {success && (
                                                        <Alert variant="success" className="mb-3">
                                                            Contraseña actualizada exitosamente. Redirigiendo al inicio de sesión...
                                                        </Alert>
                                                    )}
                                                    
                                                    <Row className="gx-3">
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>Nueva contraseña</Form.Label>
                                                            </div>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper">
                                                                    <Form.Control 
                                                                        placeholder="Ingrese su nueva contraseña" 
                                                                        value={password} 
                                                                        onChange={e => setPassword(e.target.value)} 
                                                                        type={showPassword ? "text" : "password"} 
                                                                        disabled={loading}
                                                                        required
                                                                    />
                                                                    <a href="#" className="input-suffix text-muted" onClick={() => setShowPassword(!showPassword)} >
                                                                        <span className="feather-icon">
                                                                            {
                                                                                showPassword
                                                                                    ?
                                                                                    <EyeOff className="form-icon" />
                                                                                    :
                                                                                    <Eye className="form-icon" />
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                </span>
                                                            </InputGroup>
                                                        </Col>
                                                        
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>Confirmar contraseña</Form.Label>
                                                            </div>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper">
                                                                    <Form.Control 
                                                                        placeholder="Confirme su nueva contraseña" 
                                                                        value={confirmPassword} 
                                                                        onChange={e => setConfirmPassword(e.target.value)} 
                                                                        type={showConfirmPassword ? "text" : "password"} 
                                                                        disabled={loading}
                                                                        required
                                                                    />
                                                                    <a href="#" className="input-suffix text-muted" onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                                                                        <span className="feather-icon">
                                                                            {
                                                                                showConfirmPassword
                                                                                    ?
                                                                                    <EyeOff className="form-icon" />
                                                                                    :
                                                                                    <Eye className="form-icon" />
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                </span>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <Button 
                                                        variant="primary" 
                                                        type="submit"
                                                        className="btn-uppercase btn-block"
                                                        disabled={loading || success}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                Actualizando...
                                                            </>
                                                        ) : (
                                                            'Actualizar contraseña'
                                                        )}
                                                    </Button>
                                                    <p className="p-xs mt-2 text-center">
                                                        <Link href="/auth/login/classic">
                                                            <u>Volver al inicio de sesión</u>
                                                        </Link>
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* Page Footer */}
            <CommonFooter1 />
        </div>
    )
}

export default UpdatePassword