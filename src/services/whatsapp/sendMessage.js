import { supabase } from '@/utils/supabase';

/**
 * Envía un mensaje de texto a través de WhatsApp
 * @param {Object} params - Parámetros para enviar el mensaje
 * @param {string} params.to - Número de teléfono del destinatario (formato internacional)
 * @param {string} params.message - Mensaje a enviar
 * @param {string} [params.token] - Token de acceso (opcional, por defecto usa la variable de entorno)
 * @param {string} [params.phoneNumberId] - ID del número de teléfono del remitente
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function sendWhatsAppMessage({
  to,
  message,
  token = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN,
  phoneNumberId = process.env.NEXT_PUBLIC_PHONE_NUMBER_ID
}) {
  try {
    console.log(`Enviando mensaje a ${to}: "${message}"`);
    
    // Formatear el número de teléfono
    const formattedPhoneNumber = to.startsWith('+') ? to.substring(1) : to;
    
    // Construir la URL de la API
    const apiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    // En modo sandbox, solo se pueden enviar mensajes usando plantillas predefinidas
    // Construir el cuerpo de la solicitud usando la plantilla hello_world
    const requestBody = {
      messaging_product: "whatsapp",
      to: formattedPhoneNumber,
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "es"
        }
      }
    };
    
    console.log('Enviando solicitud a WhatsApp API:', JSON.stringify(requestBody, null, 2));
    
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
    
    console.log('Respuesta de WhatsApp API:', JSON.stringify(data, null, 2));
    
    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error(`Error al enviar mensaje: ${data.error?.message || 'Error desconocido'}`);
    }
    
    // Guardar el mensaje en la base de datos
    const { error } = await supabase
      .from('whatsapp_messages')
      .insert({
        message_id: data.messages[0].id,
        to_number: formattedPhoneNumber,
        from_number: process.env.NEXT_PUBLIC_PHONE_NUMBER_ID,
        text: message,
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'template',
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error al guardar mensaje en la base de datos:', error);
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error en el servicio de WhatsApp:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al enviar mensaje'
    };
  }
}