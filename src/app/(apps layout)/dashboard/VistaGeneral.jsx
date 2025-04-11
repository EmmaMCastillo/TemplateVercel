import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ButtonGroup, Button } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';
import { MoreVertical } from 'react-feather';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const VistaGeneral = () => {
    const [estadisticas, setEstadisticas] = useState({
        totalProspectos: 0,
        totalSolicitudes: 0,
        solicitudesAprobadas: 0,
        montoAprobado: 0,
        tasaConversion: 0,
        porcentajeAprobadas: 0,
        porcentajeRechazadas: 0,
        porcentajeEnProceso: 0
    });
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Diario');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                setLoading(true);
                
                // Verificar si la tabla prospectos existe
                const { count: prospectosCount, error: prospectosCountError } = await supabase
                    .from('prospectos')
                    .select('*', { count: 'exact', head: true });
                
                if (prospectosCountError) {
                    console.error('Error al verificar la tabla prospectos:', prospectosCountError);
                    throw new Error(`Error al verificar la tabla prospectos: ${prospectosCountError.message || 'Error desconocido'}`);
                }
                
                // Obtener prospectos
                let { data: prospectos, error: prospectosError } = await supabase
                    .from('prospectos')
                    .select('id');
                
                if (prospectosError) {
                    console.error('Error al obtener prospectos:', prospectosError);
                    throw new Error(`Error al obtener prospectos: ${prospectosError.message || 'Error desconocido'}`);
                }
                // Verificar si la tabla solicitudes existe
                const { count: solicitudesCount, error: solicitudesCountError } = await supabase
                    .from('solicitudes')
                    .select('*', { count: 'exact', head: true });
                
                if (solicitudesCountError) {
                    console.error('Error al verificar la tabla solicitudes:', solicitudesCountError);
                    throw new Error(`Error al verificar la tabla solicitudes: ${solicitudesCountError.message || 'Error desconocido'}`);
                }
                
                // Obtener solicitudes
                let { data: solicitudes, error: solicitudesError } = await supabase
                    .from('solicitudes')
                    .select('id, estado, valor_credito');
                
                if (solicitudesError) {
                    console.error('Error al obtener solicitudes:', solicitudesError);
                    throw new Error(`Error al obtener solicitudes: ${solicitudesError.message || 'Error desconocido'}`);
                }
                if (solicitudesError) throw solicitudesError;
                
                // Calcular estadísticas
                const totalProspectos = prospectos.length;
                const totalSolicitudes = solicitudes.length;
                
                // Contar solicitudes por estado
                const solicitudesPorEstado = solicitudes.reduce((acc, solicitud) => {
                    acc[solicitud.estado] = (acc[solicitud.estado] || 0) + 1;
                    return acc;
                }, {});
                
                // Calcular solicitudes aprobadas
                const solicitudesAprobadas = (solicitudesPorEstado['APROBADA'] || 0) + 
                                            (solicitudesPorEstado['DESEMBOLSADA'] || 0) + 
                                            (solicitudesPorEstado['MATRICULADA'] || 0) + 
                                            (solicitudesPorEstado['COMPLETADA'] || 0);
                
                // Calcular monto aprobado
                const montoAprobado = solicitudes
                    .filter(s => ['APROBADA', 'DESEMBOLSADA', 'MATRICULADA', 'COMPLETADA'].includes(s.estado))
                    .reduce((acc, s) => acc + (s.valor_credito || 0), 0);
                
                // Calcular tasa de conversión
                const tasaConversion = totalProspectos > 0 
                    ? (totalSolicitudes / totalProspectos) * 100 
                    : 0;
                
                // Calcular porcentajes por estado
                const porcentajeAprobadas = totalSolicitudes > 0 
                    ? (solicitudesAprobadas / totalSolicitudes) * 100 
                    : 0;
                
                const porcentajeRechazadas = totalSolicitudes > 0 
                    ? ((solicitudesPorEstado['RECHAZADA'] || 0) / totalSolicitudes) * 100 
                    : 0;
                
                const porcentajeEnProceso = totalSolicitudes > 0 
                    ? (((solicitudesPorEstado['CREADA'] || 0) + 
                        (solicitudesPorEstado['ENVIADA A BANCO'] || 0)) / totalSolicitudes) * 100 
                    : 0;
                
                setEstadisticas({
                    totalProspectos,
                    totalSolicitudes,
                    solicitudesAprobadas,
                    montoAprobado,
                    tasaConversion: tasaConversion.toFixed(1),
                    porcentajeAprobadas: porcentajeAprobadas.toFixed(1),
                    porcentajeRechazadas: porcentajeRechazadas.toFixed(1),
                    porcentajeEnProceso: porcentajeEnProceso.toFixed(1)
                });
                
            } catch (err) {
                console.error('Error al cargar estadísticas:', err.message || err);
                setError(`No se pudieron cargar las estadísticas: ${err.message || 'Error desconocido'}. Por favor, intente de nuevo más tarde.`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEstadisticas();
    }, []);

    // Función para formatear montos
    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(monto);
    };

    return (
        <>
            <Row>
                {/* Tarjetas de resumen */}
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Prospectos Totales</h6>
                            <h2 className="display-5 fw-medium mb-0">
                                {loading ? '...' : estadisticas.totalProspectos}
                            </h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 7.2% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Solicitudes Creadas</h6>
                            <h2 className="display-5 fw-medium mb-0">
                                {loading ? '...' : estadisticas.totalSolicitudes}
                            </h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 4.3% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Solicitudes Aprobadas</h6>
                            <h2 className="display-5 fw-medium mb-0">
                                {loading ? '...' : estadisticas.solicitudesAprobadas}
                            </h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="danger" size="sm" soft>
                                    <i className="bi bi-arrow-down"></i> 2.1% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={3} md={6} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <h6 className="mb-2">Monto Aprobado</h6>
                            <h2 className="display-5 fw-medium mb-0">
                                {loading ? '...' : formatMonto(estadisticas.montoAprobado)}
                            </h2>
                            <div className="d-flex align-items-center mt-2">
                                <HkBadge bg="success" size="sm" soft>
                                    <i className="bi bi-arrow-up"></i> 10.8% vs. periodo anterior
                                </HkBadge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8} md={7} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Header className="card-header-action">
                            <h6>Solicitudes por Estado</h6>
                            <div className="card-action-wrap">
                                <ButtonGroup size="sm">
                                    <Button 
                                        variant="outline-light" 
                                        className={periodoSeleccionado === 'Diario' ? 'active' : ''}
                                        onClick={() => setPeriodoSeleccionado('Diario')}
                                    >
                                        Diario
                                    </Button>
                                    <Button 
                                        variant="outline-light"
                                        className={periodoSeleccionado === 'Semanal' ? 'active' : ''}
                                        onClick={() => setPeriodoSeleccionado('Semanal')}
                                    >
                                        Semanal
                                    </Button>
                                    <Button 
                                        variant="outline-light"
                                        className={periodoSeleccionado === 'Mensual' ? 'active' : ''}
                                        onClick={() => setPeriodoSeleccionado('Mensual')}
                                    >
                                        Mensual
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Aquí iría el gráfico de barras */}
                            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <p className="text-muted">Gráfico de Solicitudes por Estado</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={5} className="mb-md-4 mb-3">
                    <Card className="card-border mb-0 h-100">
                        <Card.Header className="card-header-action">
                            <h6>Tasa de Conversión</h6>
                        </Card.Header>
                        <Card.Body className="text-center">
                            {/* Aquí iría el gráfico circular */}
                            <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div>
                                    <h2 className="display-4 fw-medium mb-0">
                                        {loading ? '...' : `${estadisticas.tasaConversion}%`}
                                    </h2>
                                    <p className="text-muted">Prospectos a Solicitudes</p>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Aprobadas</span>
                                        <span>{loading ? '...' : `${estadisticas.porcentajeAprobadas}%`}</span>
                                    </div>
                                    <HkProgressBar 
                                        now={loading ? 0 : parseFloat(estadisticas.porcentajeAprobadas)} 
                                        variant="success" 
                                        rounded 
                                        size="sm" 
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Rechazadas</span>
                                        <span>{loading ? '...' : `${estadisticas.porcentajeRechazadas}%`}</span>
                                    </div>
                                    <HkProgressBar 
                                        now={loading ? 0 : parseFloat(estadisticas.porcentajeRechazadas)} 
                                        variant="warning" 
                                        rounded 
                                        size="sm" 
                                    />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>En Proceso</span>
                                        <span>{loading ? '...' : `${estadisticas.porcentajeEnProceso}%`}</span>
                                    </div>
                                    <HkProgressBar 
                                        now={loading ? 0 : parseFloat(estadisticas.porcentajeEnProceso)} 
                                        variant="info" 
                                        rounded 
                                        size="sm" 
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default VistaGeneral;