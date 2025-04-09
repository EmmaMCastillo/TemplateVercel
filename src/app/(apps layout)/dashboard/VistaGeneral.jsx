import React from 'react';
import { Row, Col, Card, ButtonGroup, Button } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';
import { MoreVertical } from 'react-feather';

const VistaGeneral = () => {
    return (
        <>
            <Row>
                {/* Tarjetas de resumen */}
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Prospectos Totales</h6>
                            <h2 className="display-5 fw-medium mb-0">1,248</h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 7.2% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Solicitudes Creadas</h6>
                            <h2 className="display-5 fw-medium mb-0">486</h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 4.3% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Solicitudes Aprobadas</h6>
                            <h2 className="display-5 fw-medium mb-0">214</h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="danger" size="sm" soft>
                                    <i className="bi bi-arrow-down"></i> 2.1% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Monto Aprobado</h6>
                            <h2 className="display-5 fw-medium mb-0">$2,249,315</h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 10.8% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8} md={7} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Header className="card-header-action">
                            <h6>Solicitudes por Estado</h6>
                            <div className="card-action-wrap">
                                <ButtonGroup size="sm">
                                    <Button variant="outline-light" className="active">Diario</Button>
                                    <Button variant="outline-light">Semanal</Button>
                                    <Button variant="outline-light">Mensual</Button>
                                </ButtonGroup>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Aquí iría el gráfico de barras */}
                            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <p className="text-muted">Gráfico de Solicitudes por Estado</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={5} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Header className="card-header-action">
                            <h6>Tasa de Conversión</h6>
                        </Card.Header>
                        <Card.Body className="text-center">
                            {/* Aquí iría el gráfico circular */}
                            <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div>
                                    <h2 className="display-4 fw-medium mb-0">44.1%</h2>
                                    <p className="text-muted">Prospectos a Solicitudes</p>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Aprobadas</span>
                                        <span>38.9%</span>
                                    </div>
                                    <HkProgressBar now={38.9} variant="success" rounded size="sm" />
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Rechazadas</span>
                                        <span>25.7%</span>
                                    </div>
                                    <HkProgressBar now={25.7} variant="warning" rounded size="sm" />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>En Proceso</span>
                                        <span>35.4%</span>
                                    </div>
                                    <HkProgressBar now={35.4} variant="info" rounded size="sm" />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default VistaGeneral;