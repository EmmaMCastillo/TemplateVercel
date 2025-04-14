// Script para probar el envío de correos electrónicos con AWS SES

async function testSendEmail() {
    try {
        console.log('Probando envío de correo electrónico...');
        
        // Datos de prueba
        const testData = {
            email: 'emma.castillo@globalmade360.com', // Usando el mismo correo que está configurado como remitente
            nombre: 'Usuario de Prueba',
            temporaryPassword: 'Temp123456!'
        };
        
        // Llamar a la API de envío de correos
        const response = await fetch('http://localhost:3001/api/auth/send-welcome-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('Correo enviado exitosamente:', result);
            return { success: true, data: result };
        } else {
            console.error('Error al enviar correo:', result);
            return { success: false, error: result };
        }
    } catch (error) {
        console.error('Error en la prueba de envío de correo:', error);
        return { success: false, error: error.message };
    }
}

// Ejecutar la prueba
testSendEmail().then(result => {
    console.log('Resultado de la prueba:', result);
    process.exit(0);
}).catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
});