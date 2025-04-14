// Script para probar la actualización de una solicitud con URLs de documentos
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con la clave de service role
const supabase = createClient(
    'https://ljkqmizvyhlsfiqmpubr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8'
);

// Función para probar la actualización de una solicitud
async function testUpdateSolicitud() {
    try {
        console.log('Probando actualización de solicitud con URLs de documentos...');
        
        // Primero, obtener una solicitud existente
        const { data: solicitudes, error: fetchError } = await supabase
            .from('solicitudes')
            .select('*')
            .limit(1);
        
        if (fetchError) {
            throw new Error(`Error al obtener solicitud: ${fetchError.message}`);
        }
        
        if (!solicitudes || solicitudes.length === 0) {
            throw new Error('No se encontraron solicitudes para actualizar');
        }
        
        const solicitud = solicitudes[0];
        console.log('Solicitud a actualizar:', solicitud.id);
        
        // URLs de prueba para los documentos
        const documentosUrls = {
            cedula: 'https://ljkqmizvyhlsfiqmpubr.supabase.co/storage/v1/object/sign/prospectos-documentos/test-upload/test-file.txt?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9zcGVjdG9zLWRvY3VtZW50b3MvdGVzdC11cGxvYWQvdGVzdC1maWxlLnR4dCIsImlhdCI6MTc0NDU4MTQ5OSwiZXhwIjoxNzc2MTE3NDk5fQ.AfYBPZaO1-44ltfcX5HH5_CijJtn5EnZfiOsBzWKht8',
            matricula: 'https://ljkqmizvyhlsfiqmpubr.supabase.co/storage/v1/object/sign/prospectos-documentos/test-upload/test-file.txt?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9zcGVjdG9zLWRvY3VtZW50b3MvdGVzdC11cGxvYWQvdGVzdC1maWxlLnR4dCIsImlhdCI6MTc0NDU4MTQ5OSwiZXhwIjoxNzc2MTE3NDk5fQ.AfYBPZaO1-44ltfcX5HH5_CijJtn5EnZfiOsBzWKht8',
            solicitudFirmada: 'https://ljkqmizvyhlsfiqmpubr.supabase.co/storage/v1/object/sign/prospectos-documentos/test-upload/test-file.txt?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9zcGVjdG9zLWRvY3VtZW50b3MvdGVzdC11cGxvYWQvdGVzdC1maWxlLnR4dCIsImlhdCI6MTc0NDU4MTQ5OSwiZXhwIjoxNzc2MTE3NDk5fQ.AfYBPZaO1-44ltfcX5HH5_CijJtn5EnZfiOsBzWKht8'
        };
        
        // Actualizar la solicitud con las URLs de los documentos
        const { data, error } = await supabase
            .from('solicitudes')
            .update({
                documentos: documentosUrls
            })
            .eq('id', solicitud.id)
            .select();
        
        if (error) {
            throw new Error(`Error al actualizar la solicitud: ${error.message}`);
        }
        
        console.log('Solicitud actualizada exitosamente:', data);
        
        return { 
            success: true, 
            data: data
        };
    } catch (error) {
        console.error('Error en la prueba de actualización:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testUpdateSolicitud().then(result => {
    console.log('Resultado de la prueba:', result);
});

export default testUpdateSolicitud;