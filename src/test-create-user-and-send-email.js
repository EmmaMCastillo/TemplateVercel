// Script para probar la creación de un usuario y el envío del correo de bienvenida
const { createClient } = require('@supabase/supabase-js');

// URL y claves de Supabase
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Crear cliente de Supabase con clave de servicio
const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Función para generar una contraseña aleatoria
const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Función para probar la creación de un usuario y el envío del correo
async function testCreateUserAndSendEmail() {
    try {
        console.log('Probando creación de usuario y envío de correo...');
        
        // Datos de prueba
        const userData = {
            nombre: 'Usuario de Prueba',
            email: 'emma.castillo@globalmade360.com', // Usar un correo verificado
            rol: 'usuario'
        };
        
        // Generar contraseña aleatoria
        const password = generateRandomPassword();
        console.log('Contraseña generada:', password);
        
        // Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: password,
            email_confirm: true, // Confirmar email automáticamente
            user_metadata: {
                nombre: userData.nombre,
                rol: userData.rol
            }
        });
        
        if (authError) {
            console.error('Error al crear el usuario:', authError);
            return { success: false, error: authError };
        }
        
        console.log('Usuario creado exitosamente en Auth:', authData);
        
        // Enviar correo de bienvenida
        const response = await fetch('http://localhost:3001/api/auth/send-welcome-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                nombre: userData.nombre,
                temporaryPassword: password
            }),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('Correo enviado exitosamente:', result);
            return { success: true, data: { user: authData.user, emailResult: result } };
        } else {
            console.error('Error al enviar correo:', result);
            return { success: false, error: result };
        }
    } catch (error) {
        console.error('Error en la prueba:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testCreateUserAndSendEmail().then(result => {
    console.log('Resultado de la prueba:', result);
    process.exit(0);
}).catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
});