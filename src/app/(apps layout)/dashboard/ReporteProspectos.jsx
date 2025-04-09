import React from 'react';
import { Row, Col, Card, Button, Dropdown, ButtonGroup, Form } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import { MoreVertical } from 'react-feather';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';
import AudienceReviewChart from './ChartData/AudienceReviewChart';

const ReporteProspectos = () => {
    return (
        <Row>
            <Col xxl={3} lg={4} md={5} className="mb-md-4 mb-3">
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
            <Col xxl={9} lg={8} md={7} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Prospectos por Canal</h6>
                        <div className="card-action-wrap">
                            <ButtonGroup size="sm">
                                <Button variant="outline-light" className="active">Todos</Button>
                                <Button variant="outline-light">Orgánico</Button>
                                <Button variant="outline-light">Referido</Button>
                                <Button variant="outline-light">Broker</Button>
                            </ButtonGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <AudienceReviewChart />
                        <div className="separator-full mt-5" />
                        <div className="flex-grow-1 ms-lg-3">
                            <Row>
                                <Col xxl={3} sm={6} className="mb-3">
                                    <span className="d-block fw-medium fs-7">Total</span>
                                    <div className="d-flex align-items-center">
                                        <span className="d-block fs-4 fw-medium text-dark mb-0">1,248</span>
                                        <HkBadge bg="success" size="sm" soft className="ms-1">
                                            <i className="bi bi-arrow-up" /> 7.2%
                                        </HkBadge>
                                    </div>
                                </Col>
                                <Col xxl={3} sm={6} className="mb-3">
                                    <span className="d-block fw-medium fs-7">Orgánico</span>
                                    <div className="d-flex align-items-center">
                                        <span className="d-block fs-4 fw-medium text-dark mb-0">486</span>
                                        <HkBadge bg="success" size="sm" soft className="ms-1">
                                            <i className="bi bi-arrow-up" /> 4.3%
                                        </HkBadge>
                                    </div>
                                </Col>
                                <Col xxl={3} sm={6} className="mb-3">
                                    <span className="d-block fw-medium fs-7">Referido</span>
                                    <div className="d-flex align-items-center">
                                        <span className="d-block fs-4 fw-medium text-dark mb-0">214</span>
                                        <HkBadge bg="danger" size="sm" soft className="ms-1">
                                            <i className="bi bi-arrow-down" /> 2.1%
                                        </HkBadge>
                                    </div>
                                </Col>
                                <Col xxl={3} sm={6}>
                                    <span className="d-block fw-medium fs-7">Broker</span>
                                    <div className="d-flex align-items-center">
                                        <span className="d-block fs-4 fw-medium text-dark mb-0">548</span>
                                        <HkBadge bg="success" size="sm" soft className="ms-1">
                                            <i className="bi bi-arrow-up" /> 10.8%
                                        </HkBadge>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ReporteProspectos;