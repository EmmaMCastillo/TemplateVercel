'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Eye, FileText, Filter, Pencil, Plus, Search } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoProspectoModal from './NuevoProspectoModal';
import VerProspectoModal from './VerProspectoModal';
import EditarProspectoModal from './EditarProspectoModal';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ProspectosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [selectedProspecto, setSelectedProspecto] = useState(null);
    const [prospectos, setProspectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar prospectos al iniciar
    useEffect(() => {
        const fetchProspectos = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('prospectos')
                    .select('*');
                
                if (error) {
                    console.error('Error al cargar prospectos:', error);
                    setError(`Error al cargar prospectos: ${error.message || 'Error desconocido'}`);
                } else {
                    console.log('Prospectos cargados:', data?.length || 0);
                    setProspectos(data || []);
                    setError(null);
                }
            } catch (err) {
                console.error('Error general al cargar prospectos:', err);
                setError(`Error al cargar prospectos: ${err.message || 'Error desconocido'}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProspectos();
    }, []);

    // Función para filtrar prospectos según el término de búsqueda
    const filteredProspectos = prospectos.filter(prospecto => 
        prospecto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospecto.cedula?.includes(searchTerm) ||
        prospecto.celular?.includes(searchTerm) ||
        prospecto.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div>
                            {loading && <span className="text-muted">Cargando prospectos...</span>}
                            {error && <span className="text-danger">{error}</span>}
                        </div>
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
                                            <th>ORIGEN</th>
                                            <th>ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">Cargando prospectos...</td>
                                            </tr>
                                        ) : filteredProspectos.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">No se encontraron prospectos</td>
                                            </tr>
                                        ) : (
                                            filteredProspectos.map((prospecto) => (
                                                <tr key={prospecto.id}>
                                                    <td>{prospecto.nombre}</td>
                                                    <td>{prospecto.cedula}</td>
                                                    <td>{prospecto.celular}</td>
                                                    <td>{prospecto.email}</td>
                                                    <td>{prospecto.origen}</td>
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
                                            ))
                                        )}
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
            onProspectoCreated={(nuevoProspecto) => {
                // Recargar prospectos después de crear uno nuevo
                console.log('Prospecto creado, recargando lista...');
                setLoading(true);
                
                try {
                    // Primero intentamos con created_at
                    supabase
                        .from('prospectos')
                        .select('*')
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar prospectos:', error);
                                setError(`Error al actualizar la lista de prospectos: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Prospectos recargados:', data?.length || 0);
                                setProspectos(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar prospectos:', err);
                            setError(`Error al actualizar la lista de prospectos: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar prospectos:', err);
                    setError(`Error al actualizar la lista de prospectos: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
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
            onProspectoUpdated={(prospectoActualizado) => {
                // Recargar prospectos después de actualizar uno
                console.log('Prospecto actualizado, recargando lista...');
                setLoading(true);
                
                try {
                    supabase
                        .from('prospectos')
                        .select('*')
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar prospectos después de actualizar:', error);
                                setError(`Error al actualizar la lista de prospectos: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Prospectos recargados después de actualizar:', data?.length || 0);
                                setProspectos(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar prospectos después de actualizar:', err);
                            setError(`Error al actualizar la lista de prospectos: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar prospectos después de actualizar:', err);
                    setError(`Error al actualizar la lista de prospectos: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
        />
        </>
    );
};

export default ProspectosPage;