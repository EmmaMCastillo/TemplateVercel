/**
 * Servicio para enviar notificaciones por WhatsApp utilizando la API oficial de WhatsApp Cloud
 * 
 * Este servicio permite enviar mensajes de texto a través de la API de WhatsApp Cloud
 * utilizando el token de acceso y el phone_number_id proporcionados.
 */

/**
 * Envía un mensaje de texto a través de WhatsApp
 * @param {Object} params - Parámetros para enviar el mensaje
 * @param {string} params.phoneNumber - Número de teléfono del destinatario (formato internacional sin +, ej: 573153041548)
 * @param {string} params.message - Mensaje a enviar
 * @param {string} [params.token] - Token de acceso (opcional, por defecto usa la variable de entorno)
 * @param {string} [params.phoneNumberId] - ID del número de teléfono del remitente (opcional, por defecto usa la variable de entorno)
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function sendWhatsappNotification({ 
  phoneNumber, 
  message, 
  token = process.env.WHATSAPP_TOKEN, 
  phoneNumberId = process.env.PHONE_NUMBER_ID 
}) {
  try {
    // Validar parámetros
    if (!phoneNumber) {
      throw new Error('El número de teléfono es obligatorio');
    }
    
    if (!message) {
      throw new Error('El mensaje es obligatorio');
    }
    
    if (!token) {
      throw new Error('No se encontró el token de WhatsApp. Verifique la variable de entorno WHATSAPP_TOKEN');
    }
    
    if (!phoneNumberId) {
      throw new Error('No se encontró el ID del número de teléfono. Verifique la variable de entorno PHONE_NUMBER_ID');
    }

    // Formatear el número de teléfono (eliminar el + si existe)
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber.substring(1) 
      : phoneNumber;
    
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
    
    console.log('Mensaje de WhatsApp enviado exitosamente:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error en el servicio de WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al enviar mensaje de WhatsApp'
    };
  }
}

/**
 * Envía un mensaje de bienvenida a un nuevo usuario
 * @param {Object} params - Parámetros para enviar el mensaje
 * @param {string} params.phoneNumber - Número de teléfono del destinatario
 * @param {string} params.nombre - Nombre del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function sendWelcomeWhatsappMessage({ phoneNumber, nombre }) {
  const message = `Hola ${nombre}, ¡tu registro fue exitoso! En breve te daremos acceso al sistema. 🛠️`;
  return sendWhatsappNotification({ phoneNumber, message });
}