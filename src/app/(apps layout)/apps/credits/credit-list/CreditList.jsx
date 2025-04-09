import { useState } from 'react';
import { Dropdown, Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import HkDataTable from '@/components/@hk-data-table'
import { creditColumns as columns, creditData as data } from '@/data/credits/credit-table';
import { useRouter } from 'next/navigation';
import { Archive, Edit, Trash2 } from 'react-feather';

//Custom Action Container
const actionFormatter = (cell, components) => {
    return (
        <div className="d-flex align-items-center">
            <components.Dropdown as={ButtonGroup} className="btn-group selectable-split-dropdown">
                <Button variant="outline-light" type="button" className="btn-dyn-text w-100p">Edit</Button>
                <Dropdown.Toggle variant="outline-light" split className="me-3">
                    <span className="sr-only">Toggle Dropdown</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item eventKey="Remind" >Remind</Dropdown.Item>
                    <Dropdown.Item eventKey="Sent" >Sent</Dropdown.Item>
                    <Dropdown.Item eventKey="Active" >Active</Dropdown.Item>
                    <Dropdown.Divider as="div" />
                    <Dropdown.Item eventKey="Edit" >Edit</Dropdown.Item>
                </Dropdown.Menu>
            </components.Dropdown>
            <div className="d-flex">
                <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                    <span className="btn-icon-wrap">
                        <span className="feather-icon">
                            <Archive />
                        </span>
                    </span>
                </Button>
                <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" href={cell?.actionsLink || '#'} >
                    <span className="btn-icon-wrap">
                        <span className="feather-icon">
                            <Edit />
                        </span>
                    </span>
                </Button>
                <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                    <span className="btn-icon-wrap">
                        <span className="feather-icon">
                            <Trash2 />
                        </span>
                    </span>
                </Button>
            </div>
        </div>
    )
}

const CreditList = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <Row className="mb-3" >
                <Col xs={7} mb={3}>
                    <div className="invoice-toolbar-left">
                        <Form.Select size="sm" className="d-flex align-items-center w-130p">
                            <option value={1}>Export to CSV</option>
                            <option value={2}>Export to PDF</option>
                        </Form.Select>
                    </div>
                </Col>
                <Col xs={5} mb={3}>
                    <div className="invoice-toolbar-right">
                        <div className="dataTables_filter">
                            <label>
                                <Form.Control
                                    size='sm'
                                    type='search'
                                    placeholder='Search'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="dataTables_paginate paging_simple_numbers" id="datable_1_paginate">
                            <ul className="pagination custom-pagination pagination-simple m-0">
                                <li className="paginate_button page-item previous disabled" id="datable_1_previous">
                                    <a href="#" className="page-link">
                                        <i className="ri-arrow-left-s-line" />
                                    </a>
                                </li>
                                <li className="paginate_button page-item next disabled" id="datable_1_next">
                                    <a href="#" className="page-link" >
                                        <i className="ri-arrow-right-s-line" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>

            <HkDataTable
                column={columns.map(col => col.accessor === 'acciones' ? { ...col, cellFormatter: actionFormatter } : col)}
                components={{ Dropdown }} // Add this line to pass the Dropdown component
                rowData={data}
                rowSelection={true}
                rowsPerPage={10}
                searchQuery={searchTerm}
                classes="nowrap w-100 mb-5"
                responsive
            />
            <Button variant="primary" onClick={() => router.push('/apps/credits/credit-request')}>
                Nueva Solicitud
            </Button>
        </>
    )
}

export default CreditList