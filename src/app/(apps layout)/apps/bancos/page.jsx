'use client';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Edit, Filter, Plus, Search, Trash } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoBancoModal from './NuevoBancoModal';
import EditarBancoModal from './EditarBancoModal';

const BancosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [selectedBanco, setSelectedBanco] = useState(null);

    // Datos de ejemplo para la tabla de bancos
    const bancos = [
        {
            id: 1,
            nombre: 'Banco Pichincha',
            codigo: 'PICH',
            tasaInteres: '5%',
            plazoMaximo: '30 días',
            estado: 'Activo'
        }
    ];

    // Filtrar bancos según el término de búsqueda
    const filteredBancos = bancos.filter(banco => 
        banco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banco.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNuevoModal = () => setShowNuevoModal(true);
    const handleCloseNuevoModal = () => setShowNuevoModal(false);
    
    const handleOpenEditarModal = (banco) => {
        setSelectedBanco(banco);
        setShowEditarModal(true);
    };
    const handleCloseEditarModal = () => setShowEditarModal(false);

    return (
        <>
        <Container fluid className="mt-xl-50p mt-sm-30p mt-15p">
            <Row>
                <Col>
                    <div className="hk-pg-header mb-4">
                        <div>
                            <h1 className="pg-title">Bancos</h1>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div></div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary">
                                <span className="d-flex align-items-center">
                                    <span className="icon-label me-2">
                                        <span className="feather-icon">
                                            <Filter size={18} />
                                        </span>
                                    </span>
                                    <span className="btn-text">Filtrar</span>
                                </span>
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleOpenNuevoModal}
                            >
                                <span className="d-flex align-items-center">
                                    <span className="icon-label me-2">
                                        <span className="feather-icon">
                                            <Plus size={18} />
                                        </span>
                                    </span>
                                    <span className="btn-text">Nuevo Banco</span>
                                </span>
                            </Button>
                        </div>
                    </div>
                    <Card className="card-border mb-lg-4 mb-3">
                        <Card.Body>
                            <div className="contact-search-wrap mb-4">
                                <InputGroup className="input-group-merge">
                                    <InputGroup.Text className="input-group-prepend">
                                        <span className="feather-icon">
                                            <Search size={18} />
                                        </span>
                                    </InputGroup.Text>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Buscar por nombre del banco, código..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-striped mb-0">
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
                                        {filteredBancos.map((banco) => (
                                            <tr key={banco.id}>
                                                <td>
                                                    <div className="avatar avatar-xs avatar-rounded">
                                                        <div className="avatar-text bg-primary-light-5">
                                                            <span className="initial-wrap">{banco.nombre.charAt(0)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{banco.nombre}</td>
                                                <td>{banco.codigo}</td>
                                                <td>{banco.tasaInteres}</td>
                                                <td>{banco.plazoMaximo}</td>
                                                <td>
                                                    <HkBadge bg="success" soft>
                                                        {banco.estado}
                                                    </HkBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="flush-dark"
                                                            size="sm"
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                            onClick={() => handleOpenEditarModal(banco)}
                                                        >
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <Edit size={18} />
                                                                </span>
                                                            </span>
                                                        </Button>
                                                        <Button 
                                                            variant="flush-dark" 
                                                            size="sm" 
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                        >
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <Trash size={18} />
                                                                </span>
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

        {/* Modales */}
        <NuevoBancoModal
            show={showNuevoModal}
            onHide={handleCloseNuevoModal}
        />
        
        <EditarBancoModal
            show={showEditarModal}
            handleClose={handleCloseEditarModal}
            banco={selectedBanco}
        />
        </>
    );
};

export default BancosPage;