'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table, Spinner, Alert } from 'react-bootstrap';
import { Edit, Filter, Plus, Search, Trash, Adjustments } from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';
import NuevoUsuarioModal from './NuevoUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import ConfigurarPermisosModal from './ConfigurarPermisosModal';
import { createClient } from '@supabase/supabase-js';

// URL y claves de Supabase
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE4NzEsImV4cCI6MjA1OTIyNzg3MX0.P25CoZR3XGsXv0I3E_QMbFsTO-GmJoLsZfxblADhTRs';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Crear cliente de Supabase con clave de servicio para operaciones administrativas
// Nota: En producción, esto debería manejarse solo en el servidor
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

const UsuariosPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showPermisosModal, setShowPermisosModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar usuarios al iniciar
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Función para cargar usuarios desde Supabase Auth
    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            
            // Obtener usuarios de Supabase Auth
            const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (authError) {
                console.error('Error al cargar usuarios:', authError);
                setError(`Error al cargar usuarios: ${authError.message || 'Error desconocido'}`);
                return;
            }
            
            console.log('Usuarios cargados:', users?.length || 0);
            setUsuarios(users || []);
            setError(null);
        } catch (err) {
            console.error('Error general al cargar usuarios:', err);
            setError(`Error al cargar usuarios: ${err.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios según el término de búsqueda
    const filteredUsuarios = usuarios.filter(usuario => 
        usuario.user_metadata?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenNuevoModal = () => setShowNuevoModal(true);
    const handleCloseNuevoModal = () => setShowNuevoModal(false);
    
    const handleOpenEditarModal = (usuario) => {
        setSelectedUsuario(usuario);
        setShowEditarModal(true);
    };
    const handleCloseEditarModal = () => setShowEditarModal(false);

    const handleOpenPermisosModal = (usuario) => {
        setSelectedUsuario(usuario);
        setShowPermisosModal(true);
    };
    const handleClosePermisosModal = () => setShowPermisosModal(false);

    // Función para manejar la creación de un nuevo usuario
    const handleUsuarioCreated = (nuevoUsuario) => {
        console.log('Usuario creado:', nuevoUsuario);
        // Actualizar la lista de usuarios
        fetchUsuarios();
    };

    // Función para manejar la actualización de un usuario
    const handleUsuarioUpdated = (usuarioActualizado) => {
        console.log('Usuario actualizado:', usuarioActualizado);
        // Actualizar la lista de usuarios
        fetchUsuarios();
    };

    // Función para manejar la eliminación de un usuario
    const handleEliminarUsuario = async (usuarioId) => {
        if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
            return;
        }
        
        try {
            setLoading(true);
            
            // Eliminar usuario de Supabase Auth
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(usuarioId);
            
            if (authError) {
                console.error('Error al eliminar usuario:', authError);
                alert(`Error al eliminar usuario: ${authError.message || 'Error desconocido'}`);
                return;
            }
            
            console.log('Usuario eliminado exitosamente');
            
            // Actualizar la lista de usuarios
            fetchUsuarios();
        } catch (err) {
            console.error('Error general al eliminar usuario:', err);
            alert(`Error al eliminar usuario: ${err.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

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
                        <div>
                            {loading && <span className="text-muted">Cargando usuarios...</span>}
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
                                            <th>ROL</th>
                                            <th>ESTADO</th>
                                            <th className="text-center">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">
                                                    <Spinner animation="border" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </Spinner>
                                                </td>
                                            </tr>
                                        ) : filteredUsuarios.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">No se encontraron usuarios</td>
                                            </tr>
                                        ) : (
                                            filteredUsuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td>{usuario.user_metadata?.nombre || 'Sin nombre'}</td>
                                                    <td>{usuario.email}</td>
                                                    <td>
                                                        <HkBadge bg="success" soft>
                                                            {usuario.user_metadata?.rol || 'Usuario'}
                                                        </HkBadge>
                                                    </td>
                                                    <td>
                                                        <HkBadge bg={usuario.email_confirmed_at ? "success" : "warning"} soft>
                                                            {usuario.email_confirmed_at ? 'Confirmado' : 'Pendiente'}
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
                                                                onClick={() => handleOpenPermisosModal(usuario)}
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
                                                                onClick={() => handleEliminarUsuario(usuario.id)}
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
        <NuevoUsuarioModal
            show={showNuevoModal}
            onHide={handleCloseNuevoModal}
            onUsuarioCreated={handleUsuarioCreated}
        />
        
        <EditarUsuarioModal
            show={showEditarModal}
            onHide={handleCloseEditarModal}
            usuario={selectedUsuario}
            onUsuarioUpdated={handleUsuarioUpdated}
        />

        <ConfigurarPermisosModal
            show={showPermisosModal}
            onHide={handleClosePermisosModal}
            usuario={selectedUsuario}
            onPermissionsUpdated={() => fetchUsuarios()}
        />
        </>
    );
};

export default UsuariosPage;