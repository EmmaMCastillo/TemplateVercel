
import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import HkDropZone from '@/components/@hk-drop-zone/HkDropZone';

const CreditRequestBody = () => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <div className="credit-body">
            <div className="credit-form-wrap">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="form-group">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese su nombre"
                            />
                        </Col>
                        <Col md={6} className="form-group">
                            <Form.Label>Monto solicitado</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Ingrese el monto"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={12}>
                            <Form.Label>Documentos requeridos</Form.Label>
                            <HkDropZone className="mb-3"/>
                        </Col>
                    </Row>
                    <div className="mt-4">
                        <Button type="submit" variant="primary">
                            Enviar solicitud
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CreditRequestBody;
