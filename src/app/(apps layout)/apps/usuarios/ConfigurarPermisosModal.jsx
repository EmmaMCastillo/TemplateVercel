'use client';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { X } from 'tabler-icons-react';
import './PermisosStyles.css';
import { supabase, supabaseAdmin } from '@/utils/supabase';

// Definición de todos los módulos y sus acciones
const modulesDefinition = {
    dashboard: {
        name: 'Dashboard',
        actions: [
            { id: 'ver_estadisticas', name: 'Ver Estadísticas Generales' },
            { id: 'ver_graficos', name: 'Ver Gráficos de Rendimiento' }
        ]
    },
    prospectos: {
        name: 'Prospectos',
        actions: [
            { id: 'ver_prospectos', name: 'Ver Lista de Prospectos' },
            { id: 'crear_prospecto', name: 'Crear Nuevo Prospecto' },
            { id: 'editar_prospecto', name: 'Editar Prospecto' },
            { id: 'eliminar_prospecto', name: 'Eliminar Prospecto' },
            { id: 'exportar_prospectos', name: 'Exportar Prospectos' }
        ]
    },
    solicitudes: {
        name: 'Solicitudes',
        actions: [
            { id: 'ver_solicitudes', name: 'Ver Lista de Solicitudes' },
            { id: 'crear_solicitud', name: 'Crear Nueva Solicitud' },
            { id: 'editar_solicitud', name: 'Editar Solicitud' },
            { id: 'gestionar_documentos', name: 'Gestionar Documentos' },
            { id: 'subir_documentos', name: 'Subir Documentos' },
            { id: 'desembolso', name: 'Gestionar Desembolso' }
        ]
    },
    bancos: {
        name: 'Bancos',
        actions: [
            { id: 'ver_bancos', name: 'Ver Lista de Bancos' },
            { id: 'crear_banco', name: 'Agregar Nuevo Banco' },
            { id: 'editar_banco', name: 'Editar Banco' }
        ]
    },
    usuarios: {
        name: 'Usuarios',
        actions: [
            { id: 'ver_usuarios', name: 'Ver Lista de Usuarios' },
            { id: 'crear_usuario', name: 'Crear Nuevo Usuario' },
            { id: 'editar_usuario', name: 'Editar Usuario' },
            { id: 'gestionar_permisos', name: 'Gestión de Permisos' }
        ]
    }
};

// Niveles de acceso
const accessLevels = [
    { id: 'no_access', name: 'Sin acceso', class: 'color-no-access' },
    { id: 'read', name: 'Lectura', class: 'color-read' },
    { id: 'write', name: 'Escritura', class: 'color-write' },
    { id: 'admin', name: 'Administrador', class: 'color-admin' }
];

const ConfigurarPermisosModal = ({ show, onHide, usuario, onPermissionsUpdated }) => {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [roles, setRoles] = useState([]);

    // Cargar roles disponibles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const { data, error } = await supabase
                    .from('roles_permisos')
                    .select('rol_id');
                
                if (error) {
                    console.error('Error al cargar roles:', error);
                    return;
                }
                
                // Extraer los IDs de rol y crear objetos de rol
                const rolesData = data.map(item => ({
                    id: item.rol_id,
                    name: item.rol_id.charAt(0).toUpperCase() + item.rol_id.slice(1) // Capitalizar
                }));
                
                // Asegurarse de que siempre exista el rol 'admin'
                if (!rolesData.some(role => role.id === 'admin')) {
                    rolesData.push({ id: 'admin', name: 'Administrador' });
                }
                
                setRoles(rolesData);
            } catch (err) {
                console.error('Error al cargar roles:', err);
            }
        };
        
        fetchRoles();
    }, []);

    // Cargar permisos cuando se abre el modal y hay un usuario seleccionado
    useEffect(() => {
        if (show && usuario) {
            loadPermissions();
        }
    }, [show, usuario]);

    // Función para cargar los permisos del usuario seleccionado
    const loadPermissions = async () => {
        if (!usuario) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const rol = usuario.user_metadata?.rol || 'usuario';
            
            // Obtener permisos del rol del usuario
            const { data, error } = await supabase
                .from('roles_permisos')
                .select('permisos')
                .eq('rol_id', rol)
                .single();
            
            if (data && !error) {
                console.log('Permisos cargados desde la base de datos:', data.permisos);
                setPermissions(data.permisos);
            } else {
                // Si no hay permisos definidos para este rol, crear permisos por defecto
                const defaultPermissions = {};
                
                // Generar permisos por defecto para cada módulo y acción
                Object.keys(modulesDefinition).forEach(moduleId => {
                    defaultPermissions[moduleId] = { access: rol === 'admin' ? 'admin' : 'read' };
                    
                    modulesDefinition[moduleId].actions.forEach(action => {
                        defaultPermissions[`${moduleId}_${action.id}`] = { 
                            access: rol === 'admin' ? 'admin' : 
                                    (action.id.startsWith('ver_') ? 'read' : 'no_access') 
                        };
                    });
                });
                
                console.log('Usando permisos por defecto:', defaultPermissions);
                setPermissions(defaultPermissions);
            }
        } catch (err) {
            console.error('Error al cargar permisos:', err);
            setError('Error al cargar los permisos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el cambio de permiso individual
    const handlePermissionChange = (itemId, accessLevel) => {
        setPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };
            newPermissions[itemId] = { access: accessLevel };
            return newPermissions;
        });
    };

    // Función para manejar el cambio de permiso de módulo
    const handleModulePermissionChange = (moduleId, accessLevel) => {
        setPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };
            // Actualizar el permiso del módulo
            newPermissions[moduleId] = { access: accessLevel };
            
            // Actualizar los permisos de todas las acciones del módulo
            modulesDefinition[moduleId].actions.forEach(action => {
                const actionId = `${moduleId}_${action.id}`;
                newPermissions[actionId] = { access: accessLevel };
            });
            
            return newPermissions;
        });
    };

    // Función para guardar los permisos
    const handleSavePermissions = async () => {
        if (!usuario) {
            setError('No se ha seleccionado ningún usuario');
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const rol = usuario.user_metadata?.rol || 'usuario';
            
            // Verificar si ya existe un registro para este rol
            const { data: existingRole, error: checkError } = await supabase
                .from('roles_permisos')
                .select('id')
                .eq('rol_id', rol)
                .single();
            
            let result;
            
            if (existingRole && !checkError) {
                // Actualizar el registro existente
                const { data, error } = await supabase
                    .from('roles_permisos')
                    .update({ permisos: permissions })
                    .eq('id', existingRole.id)
                    .select();
                
                result = { data, error };
            } else {
                // Insertar un nuevo registro
                const { data, error } = await supabase
                    .from('roles_permisos')
                    .insert([
                        {
                            rol_id: rol,
                            permisos: permissions
                        }
                    ])
                    .select();
                
                result = { data, error };
            }
            
            if (result.error) {
                throw new Error(`Error al guardar los permisos: ${result.error.message}`);
            }
            
            console.log('Permisos guardados exitosamente:', result.data);
            setSuccess(true);
            
            // Notificar al componente padre
            if (onPermissionsUpdated && typeof onPermissionsUpdated === 'function') {
                onPermissionsUpdated(result.data);
            }
            
            // Cerrar modal después de un tiempo
            setTimeout(() => {
                if (success) onHide();
            }, 2000);
        } catch (err) {
            console.error('Error al guardar los permisos:', err);
            setError(err.message || 'Error al guardar los permisos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) {
        return (
            <Modal show={show} onHide={onHide} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Configurar Permisos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún usuario para configurar permisos.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onHide} size="xl" centered className="permisos-modal">
            <Modal.Header closeButton>
                <Modal.Title>Configurar Permisos - {usuario.user_metadata?.nombre || usuario.email}</Modal.Title>
            </Modal.Header>
            
            <div className="modal-description">
                Aquí puedes configurar los permisos para el rol {usuario.user_metadata?.rol || 'usuario'}.
                Todos los usuarios con este rol tendrán los mismos permisos.
            </div>
            
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert variant="success" className="mb-3">
                        Permisos guardados exitosamente.
                    </Alert>
                )}
                
                <div className="permissions-controls">
                    <div className="role-info">
                        <h6>Rol: {usuario.user_metadata?.rol || 'usuario'}</h6>
                    </div>
                    
                    <div className="permission-legend">
                        {accessLevels.map(level => (
                            <div key={level.id} className="legend-item">
                                <div className={`legend-color ${level.class}`}></div>
                                <span>{level.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="tab-container">
                    <div className="tabs">
                        <div className="tab active">Permisos por Módulo</div>
                    </div>
                    
                    <div className="tab-panel active">
                        {loading ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                                <p className="mt-2">Cargando permisos...</p>
                            </div>
                        ) : (
                            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <table className="permissions-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '70%' }}>Módulo/Acción</th>
                                            <th style={{ width: '30%' }}>Acceso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(modulesDefinition).map(moduleId => (
                                            <React.Fragment key={moduleId}>
                                                {/* Módulo */}
                                                <tr className="permission-module">
                                                    <th>{modulesDefinition[moduleId].name}</th>
                                                    <td className="permission-select">
                                                        {accessLevels.map(level => (
                                                            <div 
                                                                key={level.id}
                                                                className={`permission-option ${level.class} ${permissions[moduleId]?.access === level.id ? 'selected' : ''}`}
                                                                onClick={() => handleModulePermissionChange(moduleId, level.id)}
                                                            ></div>
                                                        ))}
                                                    </td>
                                                </tr>
                                                
                                                {/* Acciones del módulo */}
                                                {modulesDefinition[moduleId].actions.map(action => {
                                                    const actionId = `${moduleId}_${action.id}`;
                                                    return (
                                                        <tr key={actionId} className="permission-subitem">
                                                            <th>{action.name}</th>
                                                            <td className="permission-select">
                                                                {accessLevels.map(level => (
                                                                    <div 
                                                                        key={level.id}
                                                                        className={`permission-option ${level.class} ${permissions[actionId]?.access === level.id ? 'selected' : ''}`}
                                                                        onClick={() => handlePermissionChange(actionId, level.id)}
                                                                    ></div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cerrar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSavePermissions}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Guardando...
                        </>
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfigurarPermisosModal;