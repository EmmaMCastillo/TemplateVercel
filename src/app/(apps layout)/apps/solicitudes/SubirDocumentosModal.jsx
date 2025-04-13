'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Upload, Check, X } from 'tabler-icons-react';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con la clave de service role para tener acceso completo al storage
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);
// Nombre del bucket en Supabase Storage
const BUCKET_NAME = 'solicitudes-documentos';

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

    const [uploading, setUploading] = useState({
        cedula: false,
        matricula: false,
        solicitudFirmada: false
    });

    const [documentosUrls, setDocumentosUrls] = useState({
        cedula: '',
        matricula: '',
        solicitudFirmada: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Verificar si el bucket existe al cargar el componente
    useEffect(() => {
        if (show) {
            verificarBucket();
            // Si la solicitud ya tiene documentos, mostrarlos
            if (solicitud.documentos) {
                const docs = solicitud.documentos;
                setDocumentosUrls({
                    cedula: docs.cedula || '',
                    matricula: docs.matricula || '',
                    solicitudFirmada: docs.solicitudFirmada || ''
                });
                
                setDocumentosSubidos({
                    cedula: !!docs.cedula,
                    matricula: !!docs.matricula,
                    solicitudFirmada: !!docs.solicitudFirmada
                });
            }
        }
    }, [show, solicitud]);

    // Función para verificar si el bucket existe, si no, crearlo
    const verificarBucket = async () => {
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

            if (!bucketExists) {
                await supabase.storage.createBucket(BUCKET_NAME, {
                    public: false,
                    fileSizeLimit: 10485760, // 10MB
                });
                console.log(`Bucket ${BUCKET_NAME} creado`);
            }
        } catch (err) {
            console.error('Error al verificar/crear bucket:', err);
            setError(`Error al inicializar almacenamiento: ${err.message}`);
        }
    };

    const handleFileChange = async (e, tipo) => {
        const file = e.target.files[0];
        if (file) {
            // Verificar que el archivo sea un PDF
            if (file.type !== 'application/pdf') {
                setError('Solo se permiten archivos PDF');
                return;
            }

            setDocumentos({
                ...documentos,
                [tipo]: file
            });
            
            // Iniciar la subida del archivo
            await subirArchivo(file, tipo);
        }
    };

    // Función para subir un archivo a Supabase Storage
    const subirArchivo = async (file, tipo) => {
        setUploading({
            ...uploading,
            [tipo]: true
        });
        setError(null);
        
        try {
            // Crear un nombre de archivo único
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${tipo}.${fileExt}`;
            const filePath = `solicitud-${solicitud.id}/${fileName}`;

            // Subir el archivo a Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                throw new Error(`Error al subir el archivo: ${error.message}`);
            }

            // Obtener la URL pública del archivo
            const { data: urlData } = await supabase.storage
                .from(BUCKET_NAME)
                .createSignedUrl(filePath, 31536000); // URL válida por 1 año

            if (urlData) {
                setDocumentosUrls({
                    ...documentosUrls,
                    [tipo]: urlData.signedUrl
                });
                
                setDocumentosSubidos({
                    ...documentosSubidos,
                    [tipo]: true
                });
                
                setSuccess(`Documento ${tipo} subido exitosamente`);
            }
        } catch (err) {
            console.error(`Error al subir documento ${tipo}:`, err);
            setError(`Error al subir documento: ${err.message}`);
            
            setDocumentosSubidos({
                ...documentosSubidos,
                [tipo]: false
            });
        } finally {
            setUploading({
                ...uploading,
                [tipo]: false
            });
        }
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            
            // Actualizar la solicitud con las URLs de los documentos
            const { error } = await supabase
                .from('solicitudes')
                .update({
                    documentos: {
                        cedula: documentosUrls.cedula,
                        matricula: documentosUrls.matricula,
                        solicitudFirmada: documentosUrls.solicitudFirmada
                    }
                })
                .eq('id', solicitud.id);

            if (error) {
                throw new Error(`Error al actualizar la solicitud: ${error.message}`);
            }

            setSuccess('Documentos guardados exitosamente');
            setTimeout(() => {
                onHide();
            }, 1500);
        } catch (err) {
            console.error('Error al guardar documentos:', err);
            setError(`Error al guardar documentos: ${err.message}`);
        }
    };

    if (!solicitud) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Subir Documentos - Solicitud {solicitud.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                        {success}
                    </Alert>
                )}
                
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
                                        disabled={uploading.cedula}
                                    >
                                        {uploading.cedula ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Subiendo...
                                            </>
                                        ) : (
                                            documentosSubidos.cedula ? 'Cambiar archivo' : 'Seleccionar archivo'
                                        )}
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
                                        disabled={uploading.matricula}
                                    >
                                        {uploading.matricula ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Subiendo...
                                            </>
                                        ) : (
                                            documentosSubidos.matricula ? 'Cambiar archivo' : 'Seleccionar archivo'
                                        )}
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
                                        disabled={uploading.solicitudFirmada}
                                    >
                                        {uploading.solicitudFirmada ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Subiendo...
                                            </>
                                        ) : (
                                            documentosSubidos.solicitudFirmada ? 'Cambiar archivo' : 'Seleccionar archivo'
                                        )}
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
                    disabled={
                        !documentosSubidos.cedula ||
                        !documentosSubidos.matricula ||
                        !documentosSubidos.solicitudFirmada ||
                        uploading.cedula ||
                        uploading.matricula ||
                        uploading.solicitudFirmada
                    }
                >
                    Guardar Documentos
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SubirDocumentosModal;