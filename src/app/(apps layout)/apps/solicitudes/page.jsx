'use client';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Eye, FileText, Filter, Pencil, Plus, Search, Upload, CurrencyDollar } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevaSolicitudModal from './NuevaSolicitudModal';
import VerSolicitudModal from './VerSolicitudModal';
import EditarSolicitudModal from './EditarSolicitudModal';
import SubirDocumentosModal from './SubirDocumentosModal';
import DesembolsoModal from './DesembolsoModal';

const SolicitudesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showSubirDocumentosModal, setShowSubirDocumentosModal] = useState(false);
    const [showDesembolsoModal, setShowDesembolsoModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);

    // Datos de ejemplo para la tabla de solicitudes
    const solicitudes = [
        {
            id: 'SOL-2025-001',
            cliente: 'Juan Pérez Solano',
            monto: '$25,000.00',
            vehiculo: 'Toyota Corolla 2023',
            asesor: 'Carlos Mendoza',
            banco: 'Banco Pichincha',
            fecha: '09/04/2025',
            estado: 'APROBADA'
        },
        {
            id: 'SOL-2025-002',
            cliente: 'María González Flores',
            monto: '$18,500.00',
            vehiculo: 'Hyundai Tucson 2022',
            asesor: 'Luis Torres',
            banco: 'Banco Guayaquil',
            fecha: '08/04/2025',
            estado: 'CREADA'
        },
        {
            id: 'SOL-2025-003',
            cliente: 'Roberto Morales Jiménez',
            monto: '$32,000.00',
            vehiculo: 'Kia Sportage 2023',
            asesor: 'Ana Salazar',
            banco: 'Banco Bolivariano',
            fecha: '07/04/2025',
            estado: 'ENVIADA A BANCO'
        },
        {
            id: 'SOL-2025-004',
            cliente: 'Sofía Mendoza Rivera',
            monto: '$22,500.00',
            vehiculo: 'Chevrolet Onix 2022',
            asesor: 'Pedro Alvarado',
            banco: 'Banco Internacional',
            fecha: '06/04/2025',
            estado: 'DESEMBOLSADA'
        },
        {
            id: 'SOL-2025-005',
            cliente: 'Daniel Vargas Torres',
            monto: '$28,900.00',
            vehiculo: 'Nissan X-Trail 2021',
            asesor: 'María Sánchez',
            banco: 'Produbanco',
            fecha: '05/04/2025',
            estado: 'MATRICULADA'
        }
    ];

    // Función para filtrar solicitudes según el término de búsqueda
    const filteredSolicitudes = solicitudes.filter(solicitud => {
        return (
            solicitud.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solicitud.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solicitud.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solicitud.asesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solicitud.banco.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Función para obtener la clase de badge según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'CREADA':
                return 'primary';
            case 'ENVIADA A BANCO':
                return 'info';
            case 'APROBADA':
                return 'success';
            case 'RECHAZADA':
                return 'danger';
            case 'DESEMBOLSADA':
                return 'warning';
            case 'MATRICULADA':
                return 'violet';
            case 'COMPLETADA':
                return 'dark';
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
                            <h1 className="pg-title">Solicitudes</h1>
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
                                    console.log('Abriendo modal de nueva solicitud');
                                    setShowNuevoModal(true);
                                }}
                            >
                                <span className="d-flex align-items-center">
                                    <span className="icon-label me-2">
                                        <span className="feather-icon">
                                            <Plus size={18} />
                                        </span>
                                    </span>
                                    <span className="btn-text">Nueva Solicitud</span>
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
                                        placeholder="Buscar por nombre, número, vehículo..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nº Solicitud</th>
                                            <th>Cliente</th>
                                            <th>Monto</th>
                                            <th>Vehículo</th>
                                            <th>Asesor</th>
                                            <th>Banco</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSolicitudes.map((solicitud, index) => (
                                            <tr key={index}>
                                                <td>{solicitud.id}</td>
                                                <td>{solicitud.cliente}</td>
                                                <td>{solicitud.monto}</td>
                                                <td>{solicitud.vehiculo}</td>
                                                <td>{solicitud.asesor}</td>
                                                <td>{solicitud.banco}</td>
                                                <td>{solicitud.fecha}</td>
                                                <td>
                                                    <HkBadge bg={getBadgeClass(solicitud.estado)} soft>
                                                        {solicitud.estado}
                                                    </HkBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="flush-dark"
                                                            size="sm"
                                                            className="btn-icon btn-rounded flush-soft-hover"
                                                            onClick={() => {
                                                                console.log('Ver solicitud:', solicitud);
                                                                setSelectedSolicitud({...solicitud});
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
                                                                console.log('Editar solicitud:', solicitud);
                                                                setSelectedSolicitud({...solicitud});
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
                                                        {solicitud.estado === 'CREADA' && (
                                                            <Button
                                                                variant="flush-dark"
                                                                size="sm"
                                                                className="btn-icon btn-rounded flush-soft-hover"
                                                                onClick={() => {
                                                                    console.log('Subir documentos:', solicitud);
                                                                    setSelectedSolicitud({...solicitud});
                                                                    setTimeout(() => {
                                                                        setShowSubirDocumentosModal(true);
                                                                    }, 100);
                                                                }}
                                                            >
                                                                <span className="icon">
                                                                    <span className="feather-icon">
                                                                        <Upload size={18} />
                                                                    </span>
                                                                </span>
                                                            </Button>
                                                        )}
                                                        {solicitud.estado === 'APROBADA' && (
                                                            <Button
                                                                variant="flush-dark"
                                                                size="sm"
                                                                className="btn-icon btn-rounded flush-soft-hover"
                                                                onClick={() => {
                                                                    console.log('Registrar desembolso:', solicitud);
                                                                    setSelectedSolicitud({...solicitud});
                                                                    setTimeout(() => {
                                                                        setShowDesembolsoModal(true);
                                                                    }, 100);
                                                                }}
                                                            >
                                                                <span className="icon">
                                                                    <span className="feather-icon">
                                                                        <CurrencyDollar size={18} />
                                                                    </span>
                                                                </span>
                                                            </Button>
                                                        )}
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
        <NuevaSolicitudModal
            show={showNuevoModal}
            onHide={() => setShowNuevoModal(false)}
        />
        
        <VerSolicitudModal
            show={showVerModal}
            onHide={() => setShowVerModal(false)}
            solicitud={selectedSolicitud}
        />
        
        <EditarSolicitudModal
            show={showEditarModal}
            onHide={() => setShowEditarModal(false)}
            solicitud={selectedSolicitud}
        />

        <SubirDocumentosModal
            show={showSubirDocumentosModal}
            onHide={() => setShowSubirDocumentosModal(false)}
            solicitud={selectedSolicitud}
        />

        <DesembolsoModal
            show={showDesembolsoModal}
            onHide={() => setShowDesembolsoModal(false)}
            solicitud={selectedSolicitud}
        />
        </>
    );
};

export default SolicitudesPage;