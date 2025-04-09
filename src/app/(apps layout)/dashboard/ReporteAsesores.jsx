import React from 'react';
import { Row, Col, Card, Button, ButtonGroup, Form } from 'react-bootstrap';
import HkDataTable from '@/components/@hk-data-table';

const ReporteAsesores = () => {
    return (
        <Row>
            <Col md={12} className="mb-md-4 mb-3">
                <Card className="card-border mb-0 h-100">
                    <Card.Header className="card-header-action">
                        <h6>Rendimiento</h6>
                        <div className="card-action-wrap">
                            <ButtonGroup className="d-lg-flex d-none">
                                <Button variant="outline-light" className="active">Asesor</Button>
                                <Button variant="outline-light">Broker</Button>
                                <Button variant="outline-light">Vitrina</Button>
                            </ButtonGroup>
                            <Form.Select className="d-lg-none d-flex">
                                <option value={1}>Asesor</option>
                                <option value={2}>Broker</option>
                                <option value={3}>Vitrina</option>
                            </Form.Select>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <HkDataTable
                            column={[
                                {
                                    accessor: "id",
                                    title: "ID",
                                    hidden: true,
                                },
                                {
                                    accessor: "name",
                                    title: "Nombre",
                                    sort: true,
                                },
                                {
                                    accessor: "solicitudes",
                                    title: "Solicitudes",
                                    sort: true,
                                },
                                {
                                    accessor: "montoAprobado",
                                    title: "Monto Aprobado",
                                    sort: true,
                                },
                                {
                                    accessor: "conversion",
                                    title: "Tasa Conversión",
                                    sort: true,
                                },
                                {
                                    accessor: "actions",
                                    title: "",
                                }
                            ]}
                            rowData={[
                                {
                                    id: 1,
                                    name: "Carlos Méndez",
                                    solicitudes: 24,
                                    montoAprobado: "$1,245,600",
                                    conversion: "68%",
                                    actions: ""
                                },
                                {
                                    id: 2,
                                    name: "Ana Gutiérrez",
                                    solicitudes: 18,
                                    montoAprobado: "$986,400",
                                    conversion: "72%",
                                    actions: ""
                                },
                                {
                                    id: 3,
                                    name: "Roberto Sánchez",
                                    solicitudes: 15,
                                    montoAprobado: "$756,200",
                                    conversion: "53%",
                                    actions: ""
                                },
                                {
                                    id: 4,
                                    name: "María Fernández",
                                    solicitudes: 12,
                                    montoAprobado: "$542,800",
                                    conversion: "58%",
                                    actions: ""
                                }
                            ]}
                            rowSelection
                            rowsPerPage={4}
                            paginatorSize="sm"
                            classes="display pb-30"
                            responsive
                        />
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="primary" size="sm">
                                <span>
                                    <span className="icon">
                                        <span className="feather-icon">
                                            <Upload />
                                        </span>
                                    </span>
                                    <span className="btn-text">Exportar CSV</span>
                                </span>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ReporteAsesores;