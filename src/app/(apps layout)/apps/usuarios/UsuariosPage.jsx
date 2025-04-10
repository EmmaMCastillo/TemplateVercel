'use client';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Edit, Filter, Plus, Search, Trash, Adjustments } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoUsuarioModal from './NuevoUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import ConfigurarPermisosModal from './ConfigurarPermisosModal';

const UsuariosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showPermisosModal, setShowPermisosModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    // Datos de ejemplo para la tabla de usuarios
    const usuarios = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            estado: 'Activo'
        }
    ];

    // Filtrar usuarios según el término de búsqueda
    const filteredUsuarios = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNuevoModal = () => setShowNuevoModal(true);
    const handleCloseNuevoModal = () => setShowNuevoModal(false);
    
    const handleOpenEditarModal = (usuario) => {
        setSelectedUsuario(usuario);
        setShowEditarModal(true);
    };
    const handleCloseEditarModal = () => setShowEditarModal(false);

    const handleOpenPermisosModal = () => setShowPermisosModal(true);
    const handleClosePermisosModal = () => setShowPermisosModal(false);

    return (
        <>
        <Container fluid className="mt-xl-50p mt-sm-30p mt-15p">
            <Row>
                <Col>
                    <div className="hk-pg-header mb-4">
                        <div>
                            <h1 className="pg-title">Usuarios</h1>
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
                                    <span className="btn-text">Nuevo Usuario</span>
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
                                        placeholder="Buscar por nombre, email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>NOMBRE</th>
                                            <th>EMAIL</th>
                                            <th>ESTADO</th>
                                            <th className="text-center">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsuarios.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td>{usuario.nombre}</td>
                                                <td>{usuario.email}</td>
                                                <td>
                                                    <HkBadge bg="success" soft>
                                                        {usuario.estado}
                                                    </HkBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center">
                                                        <Button
                                                            variant="flush-dark"
                                                            size="sm"
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                            onClick={() => handleOpenEditarModal(usuario)}
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
                                                            onClick={handleOpenPermisosModal}
                                                        >
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <Adjustments size={18} />
                                                                </span>
                                                            </span>
                                                        </Button>
                                                        <Button 
                                                            variant="flush-dark" 
                                                            size="sm" 
                                                            className="btn-icon btn-rounded flush-soft-hover text-danger"
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
        <NuevoUsuarioModal
            show={showNuevoModal}
            onHide={handleCloseNuevoModal}
        />
        
        <EditarUsuarioModal
            show={showEditarModal}
            onHide={handleCloseEditarModal}
            usuario={selectedUsuario}
        />

        <ConfigurarPermisosModal
            show={showPermisosModal}
            onHide={handleClosePermisosModal}
        />
        </>
    );
};

export default UsuariosPage;