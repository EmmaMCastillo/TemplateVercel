// Script para probar el envío de notificaciones por WhatsApp
// Ejecutar con: node test-whatsapp-notification.js

// Importar módulos necesarios
require('dotenv').config({ path: '.env.local' }); // Cargar variables de entorno
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Para realizar solicitudes HTTP

// Función para enviar un mensaje de WhatsApp directamente usando la API de WhatsApp Cloud
async function testWhatsappNotification(phoneNumber, nombre) {
  try {
    console.log('Iniciando prueba de envío de notificación WhatsApp...');
    console.log('Número de teléfono:', phoneNumber);
    console.log('Nombre:', nombre);
    
    // Verificar variables de entorno
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;
    
    if (!token) {
      throw new Error('No se encontró el token de WhatsApp. Verifique la variable de entorno WHATSAPP_TOKEN');
    }
    
    if (!phoneNumberId) {
      throw new Error('No se encontró el ID del número de teléfono. Verifique la variable de entorno PHONE_NUMBER_ID');
    }
    
    console.log('Variables de entorno configuradas correctamente');
    console.log('PHONE_NUMBER_ID:', phoneNumberId);
    console.log('WHATSAPP_TOKEN:', token ? 'Configurado (valor oculto por seguridad)' : 'No configurado');
    
    // Formatear el número de teléfono (eliminar el + si existe)
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber.substring(1) 
      : phoneNumber;
    
    // Construir el mensaje
    const message = `Hola ${nombre}, ¡tu registro fue exitoso! En breve te daremos acceso al sistema. 🛠️`;
    
    // Construir la URL de la API
    const apiUrl = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
    
    // Construir el cuerpo de la solicitud para un mensaje de texto
    const requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhoneNumber,
      type: "text",
      text: {
        preview_url: false,
        body: message
      }
    };
    
    console.log('Enviando solicitud a la API de WhatsApp Cloud...');
    console.log('URL:', apiUrl);
    console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody, null, 2));
    
    // Realizar la solicitud a la API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Procesar la respuesta
    const data = await response.json();
    
    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      console.error('Error al enviar mensaje de WhatsApp:', data);
      throw new Error(`Error al enviar mensaje de WhatsApp: ${data.error?.message || 'Error desconocido'}`);
    }
    
    console.log('¡Mensaje de WhatsApp enviado exitosamente!');
    console.log('Respuesta de la API:', JSON.stringify(data, null, 2));
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error en la prueba de WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al enviar mensaje de WhatsApp'
    };
  }
}

// Función principal para ejecutar la prueba
async function main() {
  // Obtener el número de teléfono y el nombre de los argumentos de la línea de comandos
  const args = process.argv.slice(2);
  const phoneNumber = args[0] || '+573153041548'; // Número de ejemplo o el proporcionado como argumento
  const nombre = args[1] || 'Usuario de Prueba'; // Nombre de ejemplo o el proporcionado como argumento
  
  console.log('='.repeat(50));
  console.log('PRUEBA DE NOTIFICACIÓN WHATSAPP');
  console.log('='.repeat(50));
  
  try {
    const result = await testWhatsappNotification(phoneNumber, nombre);
    
    if (result.success) {
      console.log('\n✅ Prueba completada exitosamente');
      console.log('El mensaje ha sido enviado correctamente al número:', phoneNumber);
    } else {
      console.log('\n❌ La prueba falló');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Error inesperado durante la prueba:', error);
  }
  
  console.log('\nPara probar con un número diferente, ejecute:');
  console.log('node test-whatsapp-notification.js +NÚMERO_DE_TELÉFONO "Nombre del Usuario"');
  console.log('='.repeat(50));
}

// Ejecutar la función principal
main();