// Script para probar la conexión con el storage de Supabase
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con la clave de service role
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);

// Función para probar la conexión con el storage
async function testStorageConnection() {
    try {
        console.log('Probando conexión con Supabase Storage...');
        
        // Listar buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
            throw new Error(`Error al listar buckets: ${bucketsError.message}`);
        }
        
        console.log('Buckets disponibles:', buckets.map(b => b.name));
        
        // Verificar si existen los buckets que necesitamos
        const requiredBuckets = ['solicitudes-documentos', 'prospectos-documentos'];
        const missingBuckets = requiredBuckets.filter(
            bucket => !buckets.some(b => b.name === bucket)
        );
        
        // Crear buckets faltantes
        for (const bucketName of missingBuckets) {
            console.log(`Creando bucket ${bucketName}...`);
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: false,
                fileSizeLimit: 10485760, // 10MB
            });
            
            if (error) {
                throw new Error(`Error al crear bucket ${bucketName}: ${error.message}`);
            }
            
            console.log(`Bucket ${bucketName} creado exitosamente`);
        }
        
        console.log('Prueba de conexión completada exitosamente');
        return { success: true };
    } catch (error) {
        console.error('Error en la prueba de conexión:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testStorageConnection().then(result => {
    console.log('Resultado de la prueba:', result);
});

export default testStorageConnection;