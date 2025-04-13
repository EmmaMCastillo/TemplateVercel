'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Card, Col, Container, Form, InputGroup, Row, Alert, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import CommonFooter1 from '../../CommonFooter1';
import { useAuth } from '@/context/AuthContext';

//Image
import logo from '@/assets/img/logo-light.png';

const LoginClassic = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);

    const router = useRouter();
    const { user, signIn } = useAuth();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validar campos
            if (!email.trim()) {
                throw new Error('El correo electrónico es obligatorio');
            }
            
            if (!password.trim()) {
                throw new Error('La contraseña es obligatoria');
            }

            // Iniciar sesión usando el contexto de autenticación
            const { success, error: authError } = await signIn(email, password);

            if (!success) {
                throw new Error(authError || 'Error al iniciar sesión');
            }

            // La redirección se maneja automáticamente en el efecto useEffect
        } catch (err) {
            console.error('Error de inicio de sesión:', err);
            setError(err.message || 'Error al iniciar sesión. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
            <div className="hk-pg-body pt-0 pb-xl-0">
                <Container>
                    <Row>
                        <Col sm={10} className="position-relative mx-auto">
                            <div className="auth-content py-8">
                                <Form className="w-100" onSubmit={e => handleSubmit(e)}>
                                    <Row>
                                        <Col lg={5} md={7} sm={10} className="mx-auto">
                                            <div className="text-center mb-7">
                                                <Link href="/" className="navbar-brand me-0">
                                                    <Image className="brand-img d-inline-block" src={logo} alt="brand" />
                                                </Link>
                                            </div>
                                            <Card className="card-flush">
                                                <Card.Body className="text-center">
                                                    <h4 className="mb-4">Sign in to your account</h4>
                                                    
                                                    {error && (
                                                        <Alert variant="danger" className="mb-3">
                                                            {error}
                                                        </Alert>
                                                    )}
                                                    
                                                    <Row className="gx-3">
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group text-start">
                                                                <Form.Label>User Name</Form.Label>
                                                            </div>
                                                            <Form.Control 
                                                                placeholder="Enter username or email ID" 
                                                                type="email" 
                                                                value={email} 
                                                                onChange={e => setEmail(e.target.value)} 
                                                                disabled={loading}
                                                                required
                                                            />
                                                        </Col>
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group d-flex justify-content-between text-start">
                                                                <Form.Label>Password</Form.Label>
                                                                <Link href="/auth/reset-password" className="fs-7 fw-medium">
                                                                    Forgot Password ?
                                                                </Link>
                                                            </div>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper">
                                                                    <Form.Control 
                                                                        placeholder="Enter your password" 
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
                                                    </Row>
                                                    <div className="d-flex justify-content-center mb-4">
                                                        <Form.Check 
                                                            id="logged_in" 
                                                            className="form-check-sm" 
                                                            checked={keepLoggedIn}
                                                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                                        >
                                                            <Form.Check.Input type="checkbox" />
                                                            <Form.Check.Label className="text-muted fs-7">Keep me logged in</Form.Check.Label>
                                                        </Form.Check>
                                                    </div>
                                                    <Button 
                                                        variant="primary" 
                                                        type="submit" 
                                                        className="btn-uppercase btn-block"
                                                        disabled={loading}
                                                        style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                                LOGGING IN...
                                                            </>
                                                        ) : (
                                                            'LOGIN'
                                                        )}
                                                    </Button>
                                                    <p className="p-xs mt-2 text-center">
                                                        New to Jampack? <Link href="#"><u>Create new account</u></Link>
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

export default LoginClassic
