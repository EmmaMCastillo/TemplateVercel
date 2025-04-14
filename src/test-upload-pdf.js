// Script para probar la subida de un archivo PDF al bucket documentos-solicitudes
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Crear cliente de Supabase con la clave de service role
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);

// Función para crear un archivo PDF de prueba
async function createTestPdf() {
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog
   /Pages 2 0 R
>>
endobj
2 0 obj
<< /Type /Pages
   /Kids [3 0 R]
   /Count 1
>>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /Resources << /Font << /F1 4 0 R >> >>
   /MediaBox [0 0 612 792]
   /Contents 5 0 R
>>
endobj
4 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length 68 >>
stream
BT
/F1 24 Tf
100 700 Td
(Archivo PDF de prueba para Supabase Storage) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000302 00000 n
trailer
<< /Size 6
   /Root 1 0 R
>>
startxref
420
%%EOF`;

    const filePath = path.resolve('./src/test-file.pdf');
    fs.writeFileSync(filePath, pdfContent);
    console.log(`Archivo PDF de prueba creado en: ${filePath}`);
    return filePath;
}

// Función para probar la subida de un archivo PDF
async function testPdfUpload() {
    try {
        console.log('Probando subida de archivo PDF a Supabase Storage...');
        
        // Crear archivo PDF de prueba
        const filePath = await createTestPdf();
        
        // Leer el archivo
        const fileBuffer = fs.readFileSync(filePath);
        
        // Nombre del bucket
        const bucketName = 'documentos-solicitudes';
        
        // Verificar si el bucket existe
        const { data: buckets } = await supabase.storage.listBuckets();
        console.log('Buckets disponibles:', buckets.map(b => b.name));
        
        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        if (!bucketExists) {
            console.log(`Bucket ${bucketName} no existe, creándolo...`);
            await supabase.storage.createBucket(bucketName, {
                public: false,
                fileSizeLimit: 10485760, // 10MB
            });
            console.log(`Bucket ${bucketName} creado`);
        }
        
        // Ruta en el storage
        const storagePath = 'test-upload/test-file.pdf';
        
        // Subir el archivo
        console.log(`Subiendo archivo a ${bucketName}/${storagePath}...`);
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileBuffer, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) {
            console.error('Error al subir el archivo:', error);
            throw new Error(`Error al subir el archivo: ${error.message}`);
        }
        
        console.log('Archivo PDF subido exitosamente:', data);
        
        // Obtener la URL pública del archivo
        const { data: urlData, error: urlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(storagePath, 31536000); // URL válida por 1 año
        
        if (urlError) {
            console.error('Error al obtener la URL del archivo:', urlError);
            throw new Error(`Error al obtener la URL del archivo: ${urlError.message}`);
        }
        
        console.log('URL del archivo PDF:', urlData.signedUrl);
        
        return { 
            success: true, 
            data: data,
            url: urlData.signedUrl
        };
    } catch (error) {
        console.error('Error en la prueba de subida de PDF:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testPdfUpload().then(result => {
    console.log('Resultado de la prueba:', result);
});

export default testPdfUpload;