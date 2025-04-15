'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Eye, FileText, Filter, Pencil, Plus, Search, Upload, CurrencyDollar } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevaSolicitudModal from './NuevaSolicitudModal';
import VerSolicitudModal from './VerSolicitudModal';
import EditarSolicitudModal from './EditarSolicitudModal';
import SubirDocumentosModal from './SubirDocumentosModal';
import DesembolsoModal from './DesembolsoModal';
import { supabase } from '@/utils/supabase';

const SolicitudesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showSubirDocumentosModal, setShowSubirDocumentosModal] = useState(false);
    const [showDesembolsoModal, setShowDesembolsoModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar solicitudes al iniciar
    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('solicitudes')
                    .select(`
                        *,
                        prospectos:prospecto_id(*),
                        bancos:banco_id(*)
                    `);
                
                if (error) {
                    console.error('Error al cargar solicitudes:', error);
                    setError(`Error al cargar solicitudes: ${error.message || 'Error desconocido'}`);
                } else {
                    console.log('Solicitudes cargadas:', data?.length || 0);
                    setSolicitudes(data || []);
                    setError(null);
                }
            } catch (err) {
                console.error('Error general al cargar solicitudes:', err);
                setError(`Error al cargar solicitudes: ${err.message || 'Error desconocido'}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSolicitudes();
    }, []);

    // Función para filtrar solicitudes según el término de búsqueda
    const filteredSolicitudes = solicitudes.filter(solicitud => {
        const solicitudId = solicitud.id?.toString() || '';
        const clienteNombre = solicitud.prospectos?.nombre || '';
        const vehiculo = solicitud.vehiculo || '';
        const banco = solicitud.bancos?.nombre || '';
        
        return (
            solicitudId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            banco.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Función para formatear montos
    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(monto || 0);
    };

    // Función para abrir WhatsApp con un resumen de la solicitud
    const openWhatsApp = (solicitud) => {
        // Verificar que el prospecto y su número de teléfono existen
        if (!solicitud.prospectos?.celular) {
            alert('El cliente no tiene un número de teléfono válido');
            return;
        }
        
        // Formatear el número de teléfono para la URL de WhatsApp
        let phoneNumber = solicitud.prospectos.celular;
        
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
        
        // Crear un resumen de la solicitud
        const message = `
*Resumen de Solicitud #${solicitud.id}*
------------------------
*Cliente:* ${solicitud.prospectos?.nombre || 'N/A'}
*Cédula/RUC:* ${solicitud.prospectos?.cedula || 'N/A'}
*Teléfono:* ${solicitud.prospectos?.celular || 'N/A'}
*Email:* ${solicitud.prospectos?.email || 'N/A'}
------------------------
*Detalles de la Solicitud:*
*Monto:* ${formatMonto(solicitud.valor_credito)}
*Vehículo:* ${solicitud.vehiculo || 'N/A'}
*Banco:* ${solicitud.bancos?.nombre || 'N/A'}
*Estado:* ${solicitud.estado || 'N/A'}
*Fecha:* ${new Date(solicitud.created_at).toLocaleDateString('es-ES') || 'N/A'}
------------------------
*Observaciones:* ${solicitud.observaciones || 'Sin observaciones'}
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
                            <h1 className="pg-title">Solicitudes</h1>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            {loading && <span className="text-muted">Cargando solicitudes...</span>}
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
                                            <th>Banco</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center">Cargando solicitudes...</td>
                                            </tr>
                                        ) : filteredSolicitudes.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center">No se encontraron solicitudes</td>
                                            </tr>
                                        ) : (
                                            filteredSolicitudes.map((solicitud) => (
                                                <tr key={solicitud.id}>
                                                    <td>{solicitud.id}</td>
                                                    <td>{solicitud.prospectos?.nombre || 'N/A'}</td>
                                                    <td>{formatMonto(solicitud.valor_credito)}</td>
                                                    <td>{solicitud.vehiculo || 'N/A'}</td>
                                                    <td>{solicitud.bancos?.nombre || 'N/A'}</td>
                                                    <td>{new Date(solicitud.created_at).toLocaleDateString('es-ES')}</td>
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
                                                            {/* Botón de WhatsApp */}
                                                            <Button
                                                                variant="flush-success"
                                                                size="sm"
                                                                className="btn-icon btn-rounded flush-soft-hover"
                                                                onClick={() => openWhatsApp(solicitud)}
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
        <NuevaSolicitudModal
            show={showNuevoModal}
            onHide={() => setShowNuevoModal(false)}
            onSolicitudCreated={() => {
                // Recargar solicitudes después de crear una nueva
                console.log('Solicitud creada, recargando lista...');
                setLoading(true);
                
                try {
                    supabase
                        .from('solicitudes')
                        .select(`
                            *,
                            prospectos:prospecto_id(*),
                            bancos:banco_id(*)
                        `)
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar solicitudes después de crear:', error);
                                setError(`Error al actualizar la lista de solicitudes: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Solicitudes recargadas después de crear:', data?.length || 0);
                                setSolicitudes(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar solicitudes después de crear:', err);
                            setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar solicitudes después de crear:', err);
                    setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
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
            onSolicitudUpdated={() => {
                // Recargar solicitudes después de actualizar una
                console.log('Solicitud actualizada, recargando lista...');
                setLoading(true);
                
                try {
                    supabase
                        .from('solicitudes')
                        .select(`
                            *,
                            prospectos:prospecto_id(*),
                            bancos:banco_id(*)
                        `)
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar solicitudes después de actualizar:', error);
                                setError(`Error al actualizar la lista de solicitudes: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Solicitudes recargadas después de actualizar:', data?.length || 0);
                                setSolicitudes(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar solicitudes después de actualizar:', err);
                            setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar solicitudes después de actualizar:', err);
                    setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
        />

        <SubirDocumentosModal
            show={showSubirDocumentosModal}
            onHide={() => setShowSubirDocumentosModal(false)}
            solicitud={selectedSolicitud}
            onDocumentosSubidos={() => {
                // Recargar solicitudes después de subir documentos
                console.log('Documentos subidos, recargando lista...');
                setLoading(true);
                
                try {
                    supabase
                        .from('solicitudes')
                        .select(`
                            *,
                            prospectos:prospecto_id(*),
                            bancos:banco_id(*)
                        `)
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar solicitudes después de subir documentos:', error);
                                setError(`Error al actualizar la lista de solicitudes: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Solicitudes recargadas después de subir documentos:', data?.length || 0);
                                setSolicitudes(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar solicitudes después de subir documentos:', err);
                            setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar solicitudes después de subir documentos:', err);
                    setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
        />

        <DesembolsoModal
            show={showDesembolsoModal}
            onHide={() => setShowDesembolsoModal(false)}
            solicitud={selectedSolicitud}
            onDesembolsoRegistrado={() => {
                // Recargar solicitudes después de registrar desembolso
                console.log('Desembolso registrado, recargando lista...');
                setLoading(true);
                
                try {
                    supabase
                        .from('solicitudes')
                        .select(`
                            *,
                            prospectos:prospecto_id(*),
                            bancos:banco_id(*)
                        `)
                        .then(({ data, error }) => {
                            if (error) {
                                console.error('Error al recargar solicitudes después de registrar desembolso:', error);
                                setError(`Error al actualizar la lista de solicitudes: ${error.message || 'Error desconocido'}`);
                            } else {
                                console.log('Solicitudes recargadas después de registrar desembolso:', data?.length || 0);
                                setSolicitudes(data || []);
                                setError(null);
                            }
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error en la promesa al recargar solicitudes después de registrar desembolso:', err);
                            setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                            setLoading(false);
                        });
                } catch (err) {
                    console.error('Error general al recargar solicitudes después de registrar desembolso:', err);
                    setError(`Error al actualizar la lista de solicitudes: ${err.message || 'Error desconocido'}`);
                    setLoading(false);
                }
            }}
        />
        </>
    );
};

export default SolicitudesPage;