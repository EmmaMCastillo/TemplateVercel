'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { Upload, Check, X } from 'tabler-icons-react';

const SubirDocumentosModal = ({ show, onHide, solicitud }) => {
    const [documentos, setDocumentos] = useState({
        cedula: null,
        matricula: null,
        solicitudFirmada: null
    });

    const [documentosSubidos, setDocumentosSubidos] = useState({
        cedula: false,
        matricula: false,
        solicitudFirmada: false
    });

    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (file) {
            setDocumentos({
                ...documentos,
                [tipo]: file
            });
            
            // Simulación de subida exitosa
            setTimeout(() => {
                setDocumentosSubidos({
                    ...documentosSubidos,
                    [tipo]: true
                });
            }, 1000);
        }
    };

    const handleSubmit = () => {
        console.log('Documentos subidos:', documentos);
        // Aquí iría la lógica para procesar los documentos
        onHide();
    };

    if (!solicitud) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Subir Documentos - Solicitud {solicitud.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-4">
                    Por favor, suba los documentos requeridos para procesar la solicitud de crédito.
                    Todos los archivos deben estar en formato PDF.
                </p>

                <Row className="mb-4">
                    <Col md={4}>
                        <Card className={`h-100 ${documentosSubidos.cedula ? 'border-success' : ''}`}>
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                                <div className="mb-3 text-center">
                                    <h6>Cédula de Identidad</h6>
                                    {documentosSubidos.cedula ? (
                                        <div className="text-success mt-2">
                                            <Check size={24} />
                                            <p className="mb-0 mt-1">Subido</p>
                                        </div>
                                    ) : (
                                        <Upload size={24} className="mt-2" />
                                    )}
                                </div>
                                <Form.Group controlId="cedulaFile" className="w-100">
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'cedula')}
                                        className="d-none"
                                    />
                                    <Button
                                        variant={documentosSubidos.cedula ? "success" : "outline-primary"}
                                        className="w-100"
                                        onClick={() => document.getElementById('cedulaFile').click()}
                                    >
                                        {documentosSubidos.cedula ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                    </Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className={`h-100 ${documentosSubidos.matricula ? 'border-success' : ''}`}>
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                                <div className="mb-3 text-center">
                                    <h6>Matrícula del Vehículo</h6>
                                    {documentosSubidos.matricula ? (
                                        <div className="text-success mt-2">
                                            <Check size={24} />
                                            <p className="mb-0 mt-1">Subido</p>
                                        </div>
                                    ) : (
                                        <Upload size={24} className="mt-2" />
                                    )}
                                </div>
                                <Form.Group controlId="matriculaFile" className="w-100">
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'matricula')}
                                        className="d-none"
                                    />
                                    <Button
                                        variant={documentosSubidos.matricula ? "success" : "outline-primary"}
                                        className="w-100"
                                        onClick={() => document.getElementById('matriculaFile').click()}
                                    >
                                        {documentosSubidos.matricula ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                    </Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className={`h-100 ${documentosSubidos.solicitudFirmada ? 'border-success' : ''}`}>
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                                <div className="mb-3 text-center">
                                    <h6>Solicitud Firmada</h6>
                                    {documentosSubidos.solicitudFirmada ? (
                                        <div className="text-success mt-2">
                                            <Check size={24} />
                                            <p className="mb-0 mt-1">Subido</p>
                                        </div>
                                    ) : (
                                        <Upload size={24} className="mt-2" />
                                    )}
                                </div>
                                <Form.Group controlId="solicitudFile" className="w-100">
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'solicitudFirmada')}
                                        className="d-none"
                                    />
                                    <Button
                                        variant={documentosSubidos.solicitudFirmada ? "success" : "outline-primary"}
                                        className="w-100"
                                        onClick={() => document.getElementById('solicitudFile').click()}
                                    >
                                        {documentosSubidos.solicitudFirmada ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                    </Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={!documentosSubidos.cedula || !documentosSubidos.matricula || !documentosSubidos.solicitudFirmada}
                >
                    Guardar Documentos
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SubirDocumentosModal;