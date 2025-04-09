import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';

const TasaConversion = () => {
    return (
        <Row>
            <Col md={12} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Tasa de Conversión</h6>
                    </Card.Header>
                    <Card.Body className="text-center">
                        {/* Gráfico circular */}
                        <div style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                            <div className="position-relative" style={{ width: "200px", height: "200px" }}>
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <h2 className="display-4 fw-medium mb-0">44.1%</h2>
                                    <p className="text-muted">Prospectos a Solicitudes</p>
                                </div>
                                <div style={{ 
                                    width: "200px", 
                                    height: "200px", 
                                    borderRadius: "50%", 
                                    background: "conic-gradient(#25cba1 0% 44%, #f8f8f8 44% 100%)",
                                    transform: "rotate(-90deg)"
                                }}></div>
                            </div>
                        </div>
                        
                        <div className="mt-4 px-4">
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
    );
};

export default TasaConversion;