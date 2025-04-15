'use client';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Eye, FileText, Filter, Pencil, Plus, Search } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoProspectoModal from './NuevoProspectoModal';
import VerProspectoModal from './VerProspectoModal';
import EditarProspectoModal from './EditarProspectoModal';
import { supabase } from '@/utils/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

const ProspectosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [selectedProspecto, setSelectedProspecto] = useState(null);
    
    // Usar el hook personalizado para cargar prospectos
    const { data: prospectos, loading, error, refetch: fetchProspectos } = useSupabaseQuery('prospectos', {
        timeout: 8000,
        retries: 2
    });

    // Función para filtrar prospectos según el término de búsqueda
    const filteredProspectos = prospectos.filter(prospecto => 
        prospecto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospecto.cedula?.includes(searchTerm) ||
        prospecto.celular?.includes(searchTerm) ||
        prospecto.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para abrir WhatsApp con un resumen del prospecto
    const openWhatsApp = (prospecto) => {
        // Verificar que el número de teléfono existe
        if (!prospecto.celular) {
            alert('El prospecto no tiene un número de teléfono válido');
            return;
        }
        
        // Formatear el número de teléfono para la URL de WhatsApp
        let phoneNumber = prospecto.celular;
        
        // Eliminar todos los caracteres no numéricos excepto el signo +
        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
        
        // Si el número comienza con "+", eliminarlo para la URL
        if (phoneNumber.startsWith('+')) {
            phoneNumber = phoneNumber.substring(1);
        }
        
        // Asegurarse de que el número tenga al menos 10 dígitos
        if (phoneNumber.length < 10) {
            alert('El número de teléfono no tiene el formato correcto. Debe tener al menos 10 dígitos incluyendo el código de país.');
            return;
        }
        
        console.log('Número para WhatsApp:', phoneNumber);
        
        // Crear un resumen del prospecto
        const message = `
*Resumen del Prospecto*
------------------------
*Nombre:* ${prospecto.nombre || 'N/A'}
*Cédula/RUC:* ${prospecto.cedula || 'N/A'}
*Email:* ${prospecto.email || 'N/A'}
*Teléfono:* ${prospecto.celular || 'N/A'}
*Origen:* ${prospecto.origen || 'N/A'}
*Dirección:* ${prospecto.ubicacion || 'N/A'}
*Fecha de registro:* ${new Date(prospecto.created_at).toLocaleDateString('es-ES') || 'N/A'}
*Estado:* ${prospecto.estado || 'Activo'}
------------------------
`.trim();
        
        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Crear el enlace de WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('URL de WhatsApp:', whatsappUrl);
        
        // Abrir WhatsApp en una nueva ventana
        window.open(whatsappUrl, '_blank');
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
                        <div>
                            {loading && <span className="text-muted">Cargando prospectos...</span>}
                            {error && <span className="text-danger">{error}</span>}
                            {!loading && !error && (
                                <Button variant="outline-primary" onClick={fetchProspectos}>
                                    Refrescar
                                </Button>
                            )}
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
                                                            {/* Botón de WhatsApp */}
                                                            <Button
                                                                variant="flush-success"
                                                                size="sm"
                                                                className="btn-icon btn-rounded flush-soft-hover"
                                                                onClick={() => openWhatsApp(prospecto)}
                                                                title="Contactar por WhatsApp"
                                                            >
                                                                <span className="icon">
                                                                    <i className="bi bi-whatsapp" style={{ fontSize: '18px', color: '#25D366' }}></i>
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
                fetchProspectos();
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
                fetchProspectos();
            }}
        />
        </>
    );
};

export default ProspectosPage;