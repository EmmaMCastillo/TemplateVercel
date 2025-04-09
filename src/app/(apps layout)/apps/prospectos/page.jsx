'use client';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Eye, FileText, Filter, Pencil, Plus, Search } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoProspectoModal from './NuevoProspectoModal';
import VerProspectoModal from './VerProspectoModal';
import EditarProspectoModal from './EditarProspectoModal';

const ProspectosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [selectedProspecto, setSelectedProspecto] = useState(null);

    // Datos de ejemplo para la tabla de prospectos
    const prospectos = [
        {
            id: 1,
            nombre: 'Juan Pérez Solano',
            cedula: '1724563218',
            telefono: '0998765432',
            email: 'juan.perez@example.com',
            asesor: 'Carlos Mendoza',
            fecha: '09/04/2025',
            estado: 'SUJETO'
        },
        {
            id: 2,
            nombre: 'María González Flores',
            cedula: '1756781234',
            telefono: '0987123456',
            email: 'maria.gonzalez@example.com',
            asesor: 'Luis Torres',
            fecha: '08/04/2025',
            estado: 'CREADA'
        },
        {
            id: 3,
            nombre: 'Roberto Morales Jiménez',
            cedula: '0923456789',
            telefono: '0991234567',
            email: 'roberto.morales@example.com',
            asesor: 'Ana Salazar',
            fecha: '07/04/2025',
            estado: 'STAND BY'
        },
        {
            id: 4,
            nombre: 'Sofía Mendoza Rivera',
            cedula: '1789012345',
            telefono: '0995678901',
            email: 'sofia.mendoza@example.com',
            asesor: 'Pedro Alvarado',
            fecha: '06/04/2025',
            estado: 'NO SUJETO'
        }
    ];

    // Función para filtrar prospectos según el término de búsqueda
    const filteredProspectos = prospectos.filter(prospecto => 
        prospecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospecto.cedula.includes(searchTerm) ||
        prospecto.telefono.includes(searchTerm) ||
        prospecto.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para obtener la clase de badge según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'CREADA':
                return 'success';
            case 'STAND BY':
                return 'warning';
            case 'SUJETO':
                return 'primary';
            case 'NO SUJETO':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (
        <>
        <Container fluid className="mt-xl-50p mt-sm-30p mt-15p">
            <Row>
                <Col>
                    <div className="hk-pg-header mb-4">
                        <div>
                            <h1 className="pg-title">Prospectos</h1>
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
                                onClick={() => {
                                    console.log('Abriendo modal de nuevo prospecto');
                                    setShowNuevoModal(true);
                                }}
                            >
                                <span className="d-flex align-items-center">
                                    <span className="icon-label me-2">
                                        <span className="feather-icon">
                                            <Plus size={18} />
                                        </span>
                                    </span>
                                    <span className="btn-text">Nuevo Prospecto</span>
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
                                        placeholder="Buscar por nombre, cédula, teléfono..." 
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
                                            <th>CÉDULA/RUC</th>
                                            <th>TELÉFONO</th>
                                            <th>EMAIL</th>
                                            <th>ASESOR</th>
                                            <th>FECHA</th>
                                            <th>ESTADO</th>
                                            <th>ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProspectos.map((prospecto) => (
                                            <tr key={prospecto.id}>
                                                <td>{prospecto.nombre}</td>
                                                <td>{prospecto.cedula}</td>
                                                <td>{prospecto.telefono}</td>
                                                <td>{prospecto.email}</td>
                                                <td>{prospecto.asesor}</td>
                                                <td>{prospecto.fecha}</td>
                                                <td>
                                                    <HkBadge bg={getBadgeClass(prospecto.estado)} soft>
                                                        {prospecto.estado}
                                                    </HkBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="flush-dark"
                                                            size="sm"
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                            onClick={() => {
                                                                console.log('Ver prospecto:', prospecto);
                                                                setSelectedProspecto({...prospecto});
                                                                setTimeout(() => {
                                                                    setShowVerModal(true);
                                                                }, 100);
                                                            }}
                                                        >
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <Eye size={18} />
                                                                </span>
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant="flush-dark"
                                                            size="sm"
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                            onClick={() => {
                                                                console.log('Editar prospecto:', prospecto);
                                                                setSelectedProspecto({...prospecto});
                                                                setTimeout(() => {
                                                                    setShowEditarModal(true);
                                                                }, 100);
                                                            }}
                                                        >
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <Pencil size={18} />
                                                                </span>
                                                            </span>
                                                        </Button>
                                                        <Button variant="flush-dark" size="sm" className="btn-icon btn-rounded flush-soft-hover">
                                                            <span className="icon">
                                                                <span className="feather-icon">
                                                                    <FileText size={18} />
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
        <NuevoProspectoModal
            show={showNuevoModal}
            onHide={() => setShowNuevoModal(false)}
        />
        
        <VerProspectoModal
            show={showVerModal}
            onHide={() => setShowVerModal(false)}
            prospecto={selectedProspecto}
        />
        
        <EditarProspectoModal
            show={showEditarModal}
            onHide={() => setShowEditarModal(false)}
            prospecto={selectedProspecto}
        />
        </>
    );
};

export default ProspectosPage;