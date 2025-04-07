
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import HkDataTable from '@/components/@hk-data-table';
import { columns, data } from '@/data/credits/credit-list-table';

const CreditList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <Row className="mb-3">
                <Col sm={7} className="mb-3 mb-sm-0">
                    <div className="credit-toolbar-left">
                        <Form.Select size="sm" className="d-flex align-items-center w-130p">
                            <option value={1}>Exportar a CSV</option>
                            <option value={2}>Exportar a PDF</option>
                            <option value={3}>Enviar mensaje</option>
                        </Form.Select>
                    </div>
                </Col>
                <Col sm={5}>
                    <div className="credit-toolbar-right d-flex justify-content-end">
                        <div className="dataTables_filter">
                            <label>
                                <Form.Control
                                    size='sm'
                                    type='search'
                                    placeholder='Buscar'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="table-wrap">
                <HkDataTable
                    column={columns}
                    rowData={data}
                    rowSelection={true}
                    rowsPerPage={10}
                    searchQuery={searchTerm}
                    classes="nowrap w-100 mb-5"
                    responsive
                />
            </div>
        </>
    )
}

export default CreditList
