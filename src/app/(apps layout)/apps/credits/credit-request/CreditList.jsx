
'use client';
import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Edit2, Trash } from 'react-feather';
import { creditData } from '@/data/credits/credit-data';
import HkDataTable from '@/components/@hk-data-table';

const CreditList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        {
            Header: 'Crédito #',
            accessor: 'id',
            Cell: ({ value }) => <strong>{value}</strong>,
        },
        {
            Header: 'Solicitante',
            accessor: 'applicant',
        },
        {
            Header: 'Fecha',
            accessor: 'date',
        },
        {
            Header: 'Monto',
            accessor: 'amount',
            Cell: ({ value }) => <span>${value}</span>,
        },
        {
            Header: 'Estado',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`badge badge-${value === 'Aprobado' ? 'success' : value === 'Pendiente' ? 'warning' : 'danger'}`}>
                    {value}
                </span>
            ),
        },
        {
            Header: 'Acciones',
            accessor: 'actions',
            Cell: () => (
                <div className="d-flex align-items-center">
                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                        <span className="icon">
                            <span className="feather-icon">
                                <Edit2 />
                            </span>
                        </span>
                    </Button>
                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                        <span className="icon">
                            <span className="feather-icon">
                                <Trash />
                            </span>
                        </span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="creditapp-detail-wrap">
                <Row className="mb-3">
                    <Col sm={7} className="mb-3 mb-sm-0">
                        <div className="credit-toolbar-left">
                            <Form.Select size="sm" className="d-flex align-items-center w-130p">
                                <option value={1}>Exportar a CSV</option>
                                <option value={2}>Exportar a Excel</option>
                                <option value={3}>Exportar a PDF</option>
                            </Form.Select>
                        </div>
                    </Col>
                    <Col sm={5}>
                        <div className="credit-toolbar-right d-flex justify-content-end">
                            <Button variant="primary" className="me-3">Nueva Solicitud</Button>
                            <div className="dataTables_filter">
                                <label>
                                    <Form.Control
                                        size="sm"
                                        type="search"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                    </Col>
                </Row>

                <div className="table-wrap">
                    <HkDataTable
                        column={columns}
                        rowData={creditData}
                        rowSelection={true}
                        rowsPerPage={10}
                        searchQuery={searchTerm}
                        classes="nowrap w-100 mb-5"
                        responsive
                    />
                </div>
            </div>
        </>
    );
};

export default CreditList;
