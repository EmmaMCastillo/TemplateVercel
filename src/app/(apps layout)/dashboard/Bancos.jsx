import React from 'react';
import { Row, Col, Card, Button, ButtonGroup, Form } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';

const Bancos = () => {
    return (
        <Row>
            <Col md={12} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Panel de Demostración - Explorar Modales</h6>
                        <div className="card-action-wrap">
                            <ButtonGroup size="sm">
                                <Button variant="outline-light">Nuevo Banco</Button>
                                <Button variant="outline-light">Editar Banco</Button>
                                <Button variant="outline-light">Ver Banco</Button>
                            </ButtonGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Form.Control type="text" placeholder="Buscar por nombre del banco, código..." />
                        <div className="separator-full mt-3" />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>LOGO</th>
                                    <th>NOMBRE</th>
                                    <th>CÓDIGO</th>
                                    <th>TASA DE INTERÉS</th>
                                    <th>PLAZO MÁXIMO</th>
                                    <th>ESTADO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><img src="logo.png" alt="Banco Pichincha" /></td>
                                    <td>Banco Pichincha</td>
                                    <td>PICH</td>
                                    <td>5%</td>
                                    <td>30 días</td>
                                    <td>Activo</td>
                                    <td>
                                        <Button variant="primary">Editar</Button>
                                        <Button variant="danger">Eliminar</Button>
                                    </td>
                                </tr>
                                {/* Agregar más filas según sea necesario */}
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Bancos;