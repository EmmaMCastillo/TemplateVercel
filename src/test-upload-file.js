// Script para probar la subida de un archivo al storage de Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Crear cliente de Supabase con la clave de service role
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);

// Función para probar la subida de un archivo
async function testFileUpload() {
    try {
        console.log('Probando subida de archivo a Supabase Storage...');
        
        // Ruta del archivo a subir
        const filePath = path.resolve('./src/test-file.txt');
        
        // Leer el archivo
        const fileBuffer = fs.readFileSync(filePath);
        
        // Nombre del bucket
        const bucketName = 'prospectos-documentos';
        
        // Ruta en el storage
        const storagePath = 'test-upload/test-file.txt';
        
        // Subir el archivo
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileBuffer, {
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) {
            throw new Error(`Error al subir el archivo: ${error.message}`);
        }
        
        console.log('Archivo subido exitosamente:', data);
        
        // Obtener la URL pública del archivo
        const { data: urlData, error: urlError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(storagePath, 31536000); // URL válida por 1 año
        
        if (urlError) {
            throw new Error(`Error al obtener la URL del archivo: ${urlError.message}`);
        }
        
        console.log('URL del archivo:', urlData.signedUrl);
        
        return { 
            success: true, 
            data: data,
            url: urlData.signedUrl
        };
    } catch (error) {
        console.error('Error en la prueba de subida:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testFileUpload().then(result => {
    console.log('Resultado de la prueba:', result);
});

export default testFileUpload;