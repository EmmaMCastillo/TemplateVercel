import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';

const ReporteSolicitudes = () => {
    return (
        <Row>
            <Col xl={3} md={6} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Pendientes
                            <HkBadge bg="light" size="sm" text="dark" className="ms-1">42</HkBadge>
                        </h6>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="d-inline-block">
                            <span className="d-block text-dark display-5 fw-medium mb-0">$1,245,600</span>
                            <span className="d-block fs-7 mt-2">Monto total</span>
                        </div>
                        <div className="mt-4">
                            <HkProgressBar now={25} variant="warning" rounded size="sm" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={3} md={6} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Aprobadas
                            <HkBadge bg="light" size="sm" text="dark" className="ms-1">78</HkBadge>
                        </h6>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="d-inline-block">
                            <span className="d-block text-dark display-5 fw-medium mb-0">$2,568,400</span>
                            <span className="d-block fs-7 mt-2">Monto total</span>
                        </div>
                        <div className="mt-4">
                            <HkProgressBar now={45} variant="success" rounded size="sm" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={3} md={6} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Rechazadas
                            <HkBadge bg="light" size="sm" text="dark" className="ms-1">23</HkBadge>
                        </h6>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="d-inline-block">
                            <span className="d-block text-dark display-5 fw-medium mb-0">$876,200</span>
                            <span className="d-block fs-7 mt-2">Monto total</span>
                        </div>
                        <div className="mt-4">
                            <HkProgressBar now={15} variant="danger" rounded size="sm" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={3} md={6} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>En Análisis
                            <HkBadge bg="light" size="sm" text="dark" className="ms-1">31</HkBadge>
                        </h6>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="d-inline-block">
                            <span className="d-block text-dark display-5 fw-medium mb-0">$1,124,800</span>
                            <span className="d-block fs-7 mt-2">Monto total</span>
                        </div>
                        <div className="mt-4">
                            <HkProgressBar now={20} variant="primary" rounded size="sm" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={12} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Comparativa por Estado</h6>
                    </Card.Header>
                    <Card.Body>
                        {/* Gráfico comparativo aquí */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ReporteSolicitudes;