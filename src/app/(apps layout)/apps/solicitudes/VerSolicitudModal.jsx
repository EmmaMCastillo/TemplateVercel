'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Table, Spinner } from 'react-bootstrap';
import { FileText, ExternalLink } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import { supabase } from '@/utils/supabase';

const VerSolicitudModal = ({ show, onHide, solicitud }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prospecto, setProspecto] = useState(null);
    const [banco, setBanco] = useState(null);

    // Cargar datos relacionados cuando se muestra el modal
    useEffect(() => {
        if (show && solicitud) {
            fetchRelatedData();
        }
    }, [show, solicitud]);

    // Función para cargar datos relacionados (prospecto y banco)
    const fetchRelatedData = async () => {
        if (!solicitud) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Cargar prospecto
            if (solicitud.prospecto_id) {
                const { data: prospectoData, error: prospectoError } = await supabase
                    .from('prospectos')
                    .select('*')
                    .eq('id', solicitud.prospecto_id)
                    .single();
                
                if (prospectoError) {
                    console.error('Error al cargar prospecto:', prospectoError);
                } else {
                    setProspecto(prospectoData);
                }
            }
            
            // Cargar banco
            if (solicitud.banco_id) {
                const { data: bancoData, error: bancoError } = await supabase
                    .from('bancos')
                    .select('*')
                    .eq('id', solicitud.banco_id)
                    .single();
                
                if (bancoError) {
                    console.error('Error al cargar banco:', bancoError);
                } else {
                    setBanco(bancoData);
                }
            }
        } catch (err) {
            console.error('Error general al cargar datos relacionados:', err);
            setError('Error al cargar datos relacionados');
        } finally {
            setLoading(false);
        }
    };

    if (!solicitud) return null;

    // Función para obtener la clase de badge según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'Enviada':
                return 'primary';
            case 'En revisión':
                return 'info';
            case 'Aprobada':
                return 'success';
            case 'Rechazada':
                return 'danger';
            case 'Desembolsada':
                return 'warning';
            case 'Completada':
                return 'dark';
            default:
                return 'secondary';
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return dateString;
        }
    };

    // Función para formatear el valor del crédito
    const formatCurrency = (value) => {
        if (!value && value !== 0) return 'N/A';
        
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                        <p className="mt-2">Cargando datos...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : (
                    <>
                        <Row className="mb-4">
                            <Col md={6}>
                                <h5>Información del Prospecto</h5>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">Nombre:</td>
                                            <td>{prospecto?.nombre || 'No disponible'}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Cédula:</td>
                                            <td>{prospecto?.cedula || 'No disponible'}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Teléfono:</td>
                                            <td>{prospecto?.celular || 'No disponible'}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Email:</td>
                                            <td>{prospecto?.email || 'No disponible'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={6}>
                                <h5>Información de la Solicitud</h5>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td className="fw-medium">Valor del Crédito:</td>
                                            <td>{formatCurrency(solicitud.valor_credito)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Cuotas:</td>
                                            <td>{solicitud.cuotas} meses</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Banco:</td>
                                            <td>{banco?.nombre || 'No disponible'}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Ejecutivo:</td>
                                            <td>{solicitud.ejecutivo || 'No asignado'}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-medium">Fecha de Envío:</td>
                                            <td>{formatDate(solicitud.fechas_clave?.fecha_envio)}</td>
                                        </tr>
                                        {solicitud.fechas_clave?.fecha_aprobacion && (
                                            <tr>
                                                <td className="fw-medium">Fecha de Aprobación:</td>
                                                <td>{formatDate(solicitud.fechas_clave.fecha_aprobacion)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="fw-medium">Estado:</td>
                                            <td>
                                                <HkBadge bg={getBadgeClass(solicitud.estado)} soft>
                                                    {solicitud.estado || 'Sin estado'}
                                                </HkBadge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <h5>Documentos</h5>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {solicitud.documentos?.cedula ? (
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            href={solicitud.documentos.cedula}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText size={16} className="me-1" />
                                            Cédula
                                            <ExternalLink size={14} className="ms-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="outline-secondary" size="sm" disabled>
                                            <FileText size={16} className="me-1" />
                                            Cédula (No disponible)
                                        </Button>
                                    )}
                                    
                                    {solicitud.documentos?.extractos ? (
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            href={solicitud.documentos.extractos}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText size={16} className="me-1" />
                                            Extractos Bancarios
                                            <ExternalLink size={14} className="ms-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="outline-secondary" size="sm" disabled>
                                            <FileText size={16} className="me-1" />
                                            Extractos Bancarios (No disponible)
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerSolicitudModal;