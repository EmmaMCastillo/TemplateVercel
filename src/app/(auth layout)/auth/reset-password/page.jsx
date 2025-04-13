'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, Col, Container, Form, Row, Alert, Spinner } from 'react-bootstrap';
import CommonFooter1 from '../CommonFooter1';
import { useAuth } from '@/context/AuthContext';

//image
import logo from '@/assets/img/logo-light.png';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const { resetPassword } = useAuth();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar email
            if (!email.trim()) {
                throw new Error('El correo electrónico es obligatorio');
            }

            // Enviar solicitud de restablecimiento de contraseña usando el contexto de autenticación
            const { success, error: resetError } = await resetPassword(email);

            if (!success) {
                throw new Error(resetError || 'Error al enviar el correo de restablecimiento');
            }

            // Mostrar mensaje de éxito
            setSuccess(true);
            setEmail('');
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            setError(err.message || 'Error al enviar el correo de restablecimiento. Por favor, intente de nuevo.');
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
                                <Form className="w-100" onSubmit={handleResetPassword}>
                                    <Row>
                                        <Col lg={5} md={7} sm={10} className="mx-auto">
                                            <div className="text-center mb-7">
                                                <Link href="/" className="navbar-brand me-0">
                                                    <Image className="brand-img d-inline-block" src={logo} alt="brand" />
                                                </Link>
                                            </div>
                                            <Card className="card-flush">
                                                <Card.Body className="text-center">
                                                    <h4>Restablecer su contraseña</h4>
                                                    <p className="mb-4">Le enviaremos un correo electrónico con un enlace para restablecer su contraseña.</p>
                                                    
                                                    {error && (
                                                        <Alert variant="danger" className="mb-3">
                                                            {error}
                                                        </Alert>
                                                    )}
                                                    
                                                    {success && (
                                                        <Alert variant="success" className="mb-3">
                                                            Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.
                                                        </Alert>
                                                    )}
                                                    
                                                    <Row className="gx-3">
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label htmlFor="userEmail">Correo electrónico</Form.Label>
                                                                <Link href="/auth/login/classic" className="fs-7 fw-medium">
                                                                    Volver al inicio de sesión
                                                                </Link>
                                                            </div>
                                                            <Form.Control 
                                                                id="userEmail" 
                                                                placeholder="Ingrese su correo electrónico" 
                                                                type="email" 
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                disabled={loading}
                                                                required
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Button 
                                                        variant="primary" 
                                                        type="submit"
                                                        className="btn-uppercase btn-block"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                Enviando...
                                                            </>
                                                        ) : (
                                                            'Enviar enlace'
                                                        )}
                                                    </Button>
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

export default ResetPassword
