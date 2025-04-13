 'use client';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col, Spinner, Table, Alert } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';
import { Download, Trash, Upload } from 'tabler-icons-react';

// Crear cliente de Supabase con la clave de service role para tener acceso completo al storage
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);

const DocumentosProspectoModal = ({ show, onHide, prospecto }) => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [descripcion, setDescripcion] = useState('');

    // Nombre del bucket en Supabase Storage
    const BUCKET_NAME = 'prospectos-documentos';

    // Cargar documentos al abrir el modal
    useEffect(() => {
        if (show && prospecto) {
            cargarDocumentos();
        }
    }, [show, prospecto]);

    // Función para cargar los documentos del prospecto
    const cargarDocumentos = async () => {
        if (!prospecto) return;

        setLoading(true);
        setError(null);

        try {
            // Verificar si el bucket existe, si no, crearlo
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

            if (!bucketExists) {
                await supabase.storage.createBucket(BUCKET_NAME, {
                    public: false,
                    fileSizeLimit: 10485760, // 10MB
                });
                console.log(`Bucket ${BUCKET_NAME} creado`);
            }

            // Obtener la lista de archivos en la carpeta del prospecto
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list(`prospecto-${prospecto.id}`);

            if (error) {
                // Si la carpeta no existe, es posible que obtengamos un error, pero eso está bien
                console.log('Error al listar archivos (posiblemente carpeta vacía):', error);
                setDocumentos([]);
            } else {
                console.log('Documentos cargados:', data);
                setDocumentos(data || []);
            }
        } catch (err) {
            console.error('Error al cargar documentos:', err);
            setError(`Error al cargar documentos: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Función para subir un documento
    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setError('Por favor, seleccione un archivo para subir');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            // Crear un nombre de archivo único con la descripción
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Date.now()}_${descripcion.replace(/\s+/g, '_')}.${fileExt}`;
            const filePath = `prospecto-${prospecto.id}/${fileName}`;

            // Subir el archivo a Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw new Error(`Error al subir el archivo: ${error.message}`);
            }

            console.log('Archivo subido exitosamente:', data);
            setSuccess('Documento subido exitosamente');
            
            // Limpiar el formulario
            setSelectedFile(null);
            setDescripcion('');
            document.getElementById('fileInput').value = '';
            
            // Recargar la lista de documentos
            await cargarDocumentos();
        } catch (err) {
            console.error('Error al subir documento:', err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // Función para descargar un documento
    const handleDownload = async (fileName) => {
        try {
            const filePath = `prospecto-${prospecto.id}/${fileName}`;
            
            // Obtener URL de descarga
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .createSignedUrl(filePath, 60); // URL válida por 60 segundos

            if (error) {
                throw new Error(`Error al generar enlace de descarga: ${error.message}`);
            }

            // Abrir la URL en una nueva pestaña
            window.open(data.signedUrl, '_blank');
        } catch (err) {
            console.error('Error al descargar documento:', err);
            setError(`Error al descargar documento: ${err.message}`);
        }
    };

    // Función para eliminar un documento
    const handleDelete = async (fileName) => {
        if (!confirm(`¿Está seguro que desea eliminar el documento "${fileName}"?`)) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const filePath = `prospecto-${prospecto.id}/${fileName}`;
            
            // Eliminar el archivo
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([filePath]);

            if (error) {
                throw new Error(`Error al eliminar el documento: ${error.message}`);
            }

            console.log('Documento eliminado exitosamente');
            setSuccess('Documento eliminado exitosamente');
            
            // Recargar la lista de documentos
            await cargarDocumentos();
        } catch (err) {
            console.error('Error al eliminar documento:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Si no hay prospecto, mostrar un modal con un mensaje
    if (!prospecto) {
        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Documentos del Prospecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No se ha seleccionado ningún prospecto.</p>
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
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Documentos de {prospecto.nombre}</Modal.Title>
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

                <h5 className="mb-3">Subir nuevo documento</h5>
                <Form onSubmit={handleUpload}>
                    <Row className="mb-4">
                        <Col sm={12} md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Archivo</Form.Label>
                                <Form.Control
                                    type="file"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Tamaño máximo: 10MB
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Ej: Cédula, Comprobante de domicilio"
                                    disabled={uploading}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end mb-4">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={uploading || !selectedFile}
                        >
                            {uploading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} className="me-2" />
                                    Subir Documento
                                </>
                            )}
                        </Button>
                    </div>
                </Form>

                <h5 className="mb-3">Documentos existentes</h5>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando documentos...</p>
                    </div>
                ) : documentos.length === 0 ? (
                    <div className="text-center py-4">
                        <p>No hay documentos para este prospecto.</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tamaño</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentos.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.name}</td>
                                    <td>{(doc.metadata?.size / 1024).toFixed(2)} KB</td>
                                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleDownload(doc.name)}
                                                title="Descargar"
                                            >
                                                <Download size={16} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(doc.name)}
                                                title="Eliminar"
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DocumentosProspectoModal;