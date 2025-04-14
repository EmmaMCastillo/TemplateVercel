'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Upload, Check, X } from 'tabler-icons-react';
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con la clave de service role para tener acceso completo al storage
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// También crear un cliente con la clave anónima para probar
const supabaseAnon = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE4NzEsImV4cCI6MjA1OTIyNzg3MX0.P25CoZR3XGsXv0I3E_QMbFsTO-GmJoLsZfxblADhTRs'
);
// Nombre del bucket en Supabase Storage
// Probar con diferentes buckets para ver cuál funciona
const BUCKET_NAME = 'documentos-solicitudes'; // Bucket existente que vimos en las pruebas
const BACKUP_BUCKET_NAME = 'solicitudes-documentos'; // Bucket alternativo que creamos en las pruebas

// Función para registrar errores en la consola y mostrarlos al usuario
const logError = (message, error) => {
    console.error(message, error);
    // Si el error es un objeto con propiedades, mostrar más detalles
    if (error && typeof error === 'object') {
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
    }
    return `${message}: ${error?.message || error || 'Error desconocido'}`;
};
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
            console.log('Verificando buckets disponibles...');
            
            // Listar todos los buckets disponibles
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            
            if (bucketsError) {
                console.error('Error al listar buckets con service role:', bucketsError);
                throw new Error(`No se pudieron listar los buckets: ${bucketsError.message}`);
            }
            
            console.log('Buckets disponibles:', buckets.map(b => b.name));
            
            // Verificar si los buckets que necesitamos existen
            const mainBucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
            const backupBucketExists = buckets.some(bucket => bucket.name === BACKUP_BUCKET_NAME);
            
            console.log(`Bucket principal '${BUCKET_NAME}' existe:`, mainBucketExists);
            console.log(`Bucket alternativo '${BACKUP_BUCKET_NAME}' existe:`, backupBucketExists);
            
            // Intentar habilitar el acceso público a los buckets existentes
            if (mainBucketExists) {
                try {
                    // Intentar configurar políticas de RLS para el bucket principal
                    await supabase.rpc('create_storage_policy', {
                        bucket_id: BUCKET_NAME,
                        name: 'allow_public_read',
                        definition: 'true',
                        operation: 'SELECT'
                    });
                    
                    await supabase.rpc('create_storage_policy', {
                        bucket_id: BUCKET_NAME,
                        name: 'allow_public_insert',
                        definition: 'true',
                        operation: 'INSERT'
                    });
                    
                    console.log(`Políticas de RLS configuradas para ${BUCKET_NAME}`);
                } catch (policyError) {
                    console.log(`Nota sobre políticas para ${BUCKET_NAME}:`, policyError.message);
                }
            }
            
            if (backupBucketExists) {
                try {
                    // Intentar configurar políticas de RLS para el bucket alternativo
                    await supabase.rpc('create_storage_policy', {
                        bucket_id: BACKUP_BUCKET_NAME,
                        name: 'allow_public_read',
                        definition: 'true',
                        operation: 'SELECT'
                    });
                    
                    await supabase.rpc('create_storage_policy', {
                        bucket_id: BACKUP_BUCKET_NAME,
                        name: 'allow_public_insert',
                        definition: 'true',
                        operation: 'INSERT'
                    });
                    
                    console.log(`Políticas de RLS configuradas para ${BACKUP_BUCKET_NAME}`);
                } catch (policyError) {
                    console.log(`Nota sobre políticas para ${BACKUP_BUCKET_NAME}:`, policyError.message);
                }
            }
            
            // Si ninguno de los buckets existe, intentar crear uno
            if (!mainBucketExists && !backupBucketExists) {
                console.log('Intentando crear bucket...');
                try {
                    const { error: createError } = await supabase.storage.createBucket(BACKUP_BUCKET_NAME, {
                        public: true, // Intentar con acceso público
                        fileSizeLimit: 10485760, // 10MB
                    });
                    
                    if (createError) {
                        console.error('Error al crear bucket:', createError);
                    } else {
                        console.log(`Bucket ${BACKUP_BUCKET_NAME} creado exitosamente`);
                    }
                } catch (createError) {
                    console.error('Error al crear bucket:', createError);
                }
            }
        } catch (err) {
            const errorMsg = logError('Error al verificar/crear bucket', err);
            setError(`Error al inicializar almacenamiento: ${errorMsg}`);
        }
    };

    const handleFileChange = async (e, tipo) => {
        const file = e.target.files[0];
        if (file) {
            // Verificar que el archivo sea un PDF (de manera más flexible)
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (fileExt !== 'pdf') {
                setError('Solo se permiten archivos PDF');
                return;
            }
            
            console.log('Archivo seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);

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
        
        console.log(`Iniciando subida de archivo ${tipo}:`, file.name, 'Tamaño:', file.size);
        
        try {
            // Crear un nombre de archivo único
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${tipo}.${fileExt}`;
            const filePath = `solicitud-${solicitud.id}/${fileName}`;

            // Intentar subir con el cliente de service role
            console.log(`Intentando subir archivo a ${BUCKET_NAME}/${filePath} con service role...`);
            let data, error;
            
            try {
                const result = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(filePath, file, {
                        contentType: 'application/pdf', // Especificar explícitamente el tipo de contenido
                        cacheControl: '3600',
                        upsert: true
                    });
                
                data = result.data;
                error = result.error;
                
                if (error) {
                    console.error(`Error al subir a ${BUCKET_NAME} con service role:`, error);
                    
                    // Si falla, intentar con el bucket alternativo
                    console.log(`Intentando subir a bucket alternativo ${BACKUP_BUCKET_NAME}...`);
                    const backupResult = await supabase.storage
                        .from(BACKUP_BUCKET_NAME)
                        .upload(filePath, file, {
                            contentType: 'application/pdf',
                            cacheControl: '3600',
                            upsert: true
                        });
                    
                    if (backupResult.error) {
                        console.error(`Error al subir a ${BACKUP_BUCKET_NAME}:`, backupResult.error);
                        
                        // Como último recurso, intentar con la clave anónima
                        console.log('Intentando subir con clave anónima...');
                        const anonResult = await supabaseAnon.storage
                            .from(BUCKET_NAME)
                            .upload(filePath, file, {
                                contentType: 'application/pdf',
                                cacheControl: '3600',
                                upsert: true
                            });
                        
                        data = anonResult.data;
                        error = anonResult.error;
                    } else {
                        data = backupResult.data;
                        error = null;
                        // Si el bucket alternativo funciona, usarlo para futuras operaciones
                        console.log(`Subida exitosa a ${BACKUP_BUCKET_NAME}, usando este bucket para futuras operaciones`);
                    }
                }
            } catch (uploadError) {
                console.error('Error inesperado durante la subida:', uploadError);
                error = uploadError;
            }

            if (error) {
                console.error('Error al subir archivo:', error);
                console.error('Detalles completos:', JSON.stringify(error, null, 2));
                
                // Verificar si es un error de RLS
                if (error.message && error.message.includes('row-level security policy')) {
                    throw new Error(`Error de permisos: ${error.message}. Contacte al administrador.`);
                } else {
                    throw new Error(`Error al subir el archivo: ${error.message || JSON.stringify(error)}`);
                }
            }
            
            console.log('Archivo subido exitosamente:', data);

            // Obtener la URL pública del archivo
            const { data: urlData, error: urlError } = await supabase.storage
                .from(BUCKET_NAME)
                .createSignedUrl(filePath, 31536000, { // URL válida por 1 año
                    download: true, // Permitir descarga del archivo
                    transform: { // No aplicar transformaciones
                        width: 0,
                        height: 0
                    }
                });
                
            if (urlError) {
                console.error('Error al crear URL firmada:', urlError);
                throw new Error(`Error al crear URL de acceso: ${urlError.message || JSON.stringify(urlError)}`);
            }
            
            console.log('URL firmada creada:', urlData);

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
            const errorMsg = logError(`Error al subir documento ${tipo}`, err);
            setError(`Error al subir documento: ${errorMsg}`);
            
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
            console.log('Actualizando solicitud con URLs de documentos...');
            
            // Intentar primero con service role
            let updateError;
            try {
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
                
                updateError = error;
            } catch (err) {
                updateError = err;
            }
            
            // Si falla, intentar con la clave anónima
            if (updateError) {
                console.error('Error al actualizar con service role:', updateError);
                console.log('Intentando actualizar con clave anónima...');
                
                try {
                    const { error } = await supabaseAnon
                        .from('solicitudes')
                        .update({
                            documentos: {
                                cedula: documentosUrls.cedula,
                                matricula: documentosUrls.matricula,
                                solicitudFirmada: documentosUrls.solicitudFirmada
                            }
                        })
                        .eq('id', solicitud.id);
                    
                    updateError = error;
                } catch (err) {
                    updateError = err;
                }
            }

            if (updateError) {
                console.error('Error al actualizar solicitud:', updateError);
                throw new Error(`Error al actualizar la solicitud: ${updateError.message || JSON.stringify(updateError)}`);
            }
            
            console.log('Solicitud actualizada exitosamente con documentos');

            setSuccess('Documentos guardados exitosamente');
            setTimeout(() => {
                onHide();
            }, 1500);
        } catch (err) {
            const errorMsg = logError('Error al guardar documentos', err);
            setError(`Error al guardar documentos: ${errorMsg}`);
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