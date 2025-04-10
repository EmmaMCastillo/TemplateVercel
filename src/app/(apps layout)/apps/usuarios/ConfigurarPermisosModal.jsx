'use client';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { X } from 'tabler-icons-react';
import './PermisosStyles.css';

const ConfigurarPermisosModal = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} size="xl" centered className="permisos-modal">
            <Modal.Header closeButton>
                <Modal.Title>Configurar Permisos</Modal.Title>
            </Modal.Header>
            
            <div className="modal-description">
                Aquí puedes configurar los permisos para los usuarios.
            </div>
            
            <Modal.Body>
                <div className="permissions-controls">
                    <div className="role-selector">
                        <Form.Label htmlFor="role-select">Rol:</Form.Label>
                        <Form.Select id="role-select">
                            <option value="admin">Administrador</option>
                            <option value="ejecutivo">Ejecutivos</option>
                            <option value="comisionista">Comisionistas</option>
                            <option value="operaciones">Operaciones</option>
                            <option value="llamadas">Llamadas</option>
                            <option value="comercial">Comercial</option>
                            <option value="coordinador-operaciones">Coordinador de Operaciones</option>
                            <option value="coordinador-llamadas">Coordinador de Llamadas</option>
                            <option value="coordinador-comercial">Coordinador Comercial</option>
                        </Form.Select>
                    </div>
                    
                    <div className="permission-legend">
                        <div className="legend-item">
                            <div className="legend-color color-no-access"></div>
                            <span>Sin acceso</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color color-read"></div>
                            <span>Lectura</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color color-write"></div>
                            <span>Escritura</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color color-admin"></div>
                            <span>Administrador</span>
                        </div>
                    </div>
                </div>
                
                <div className="tab-container">
                    <div className="tabs">
                        <div className="tab active">Permisos por Módulo</div>
                    </div>
                    
                    <div className="tab-panel active">
                        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="permissions-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '70%' }}>Módulo/Acción</th>
                                        <th style={{ width: '30%' }}>Acceso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Dashboard Module */}
                                    <tr className="permission-module">
                                        <th>Dashboard</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Estadísticas Generales</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Gráficos de Rendimiento</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    
                                    {/* Prospectos Module */}
                                    <tr className="permission-module">
                                        <th>Prospectos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Lista de Prospectos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Crear Nuevo Prospecto</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Editar Prospecto</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Eliminar Prospecto</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Exportar Prospectos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    
                                    {/* Solicitudes Module */}
                                    <tr className="permission-module">
                                        <th>Solicitudes</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Lista de Solicitudes</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Crear Nueva Solicitud</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Editar Solicitud</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Gestionar Documentos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write selected"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    
                                    {/* Bancos Module */}
                                    <tr className="permission-module">
                                        <th>Bancos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Lista de Bancos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Agregar Nuevo Banco</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Editar Banco</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    
                                    {/* Usuarios Module */}
                                    <tr className="permission-module">
                                        <th>Usuarios</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Ver Lista de Usuarios</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read selected"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Crear Nuevo Usuario</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Editar Usuario</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                    <tr className="permission-subitem">
                                        <th>Gestión de Permisos</th>
                                        <td className="permission-select">
                                            <div className="permission-option color-no-access"></div>
                                            <div className="permission-option color-read"></div>
                                            <div className="permission-option color-write"></div>
                                            <div className="permission-option color-admin selected"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary">
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfigurarPermisosModal;