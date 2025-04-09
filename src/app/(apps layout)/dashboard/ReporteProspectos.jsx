import React from 'react';
import { Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';
import AudienceReviewChart from './ChartData/AudienceReviewChart';

const ReporteProspectos = () => {
    return (
        <Row>
            <Col xxl={3} lg={4} md={5} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Total Prospectos</h6>
                        <div className="card-action-wrap">
                            <Dropdown className="inline-block">
                                <Dropdown.Toggle variant='transparent' className="btn-icon btn-rounded btn-flush-dark flush-soft-hover no-caret">
                                    <span className="icon">
                                        <span className="feather-icon">
                                            <MoreVertical />
                                        </span>
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item href="#/action-1">Exportar</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Imprimir</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="d-inline-block mt-4">
                            <span className="d-block badge-status lh-1">
                                <HkBadge bg="primary" className="badge-indicator badge-indicator-nobdr d-inline-block" />
                                <span className="badge-label d-inline-block">Orgánico</span>
                            </span>
                            <span className="d-block text-dark fs-5 fw-medium mb-0">243</span>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xxl={9} lg={8} md={7} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Prospectos por Canal</h6>
                    </Card.Header>
                    <Card.Body>
                        <AudienceReviewChart />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ReporteProspectos;