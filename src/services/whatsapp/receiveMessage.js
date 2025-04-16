import { supabase } from '@/utils/supabase';

/**
 * Procesa un mensaje entrante de WhatsApp
 * @param {Object} webhookData - Datos del webhook recibido
 * @returns {Promise<Object>} - Resultado del procesamiento
 */
export async function processIncomingMessage(webhookData) {
  try {
    console.log('Procesando webhook de WhatsApp:', JSON.stringify(webhookData, null, 2));
    
    // Extraer datos relevantes del webhook
    const { entry } = webhookData;
    
    if (!entry || !entry.length || !entry[0].changes || !entry[0].changes.length) {
      throw new Error('Formato de webhook inválido');
    }
    
    const change = entry[0].changes[0];
    const value = change.value;
    
    // Verificar si es un evento de mensaje
    if (value.messages && value.messages.length > 0) {
      return await processMessage(value);
    }
    
    // Verificar si es un evento de estado
    if (value.statuses && value.statuses.length > 0) {
      return await processStatus(value);
    }
    
    // No es un evento reconocido
    return { 
      success: true, 
      action: 'ignored', 
      reason: 'No relevant data found' 
    };
  } catch (error) {
    console.error('Error al procesar mensaje entrante:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Procesa un mensaje entrante
 * @param {Object} value - Datos del mensaje
 * @returns {Promise<Object>} - Resultado del procesamiento
 */
async function processMessage(value) {
  const message = value.messages[0];
  const sender = value.contacts[0];
  
  console.log(`Mensaje recibido de ${message.from}: ${message.type === 'text' ? message.text.body : '[no es texto]'}`);
  
  // Extraer información del mensaje
  const messageData = {
    message_id: message.id,
    from_number: message.from,
    to_number: value.metadata.display_phone_number,
    timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
    type: message.type,
    text: message.type === 'text' ? message.text.body : null,
    sender_name: sender?.profile?.name || 'Unknown',
    status: 'received',
    created_at: new Date().toISOString()
  };
  
  // Guardar el mensaje en la base de datos
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert(messageData)
    .select();
  
  if (error) {
    throw new Error(`Error al guardar mensaje: ${error.message}`);
  }
  
  return {
    success: true,
    action: 'processed_message',
    message: data[0]
  };
}

/**
 * Procesa una actualización de estado
 * @param {Object} value - Datos del estado
 * @returns {Promise<Object>} - Resultado del procesamiento
 */
async function processStatus(value) {
  const status = value.statuses[0];
  
  console.log(`Actualización de estado para mensaje ${status.id}: ${status.status}`);
  
  // Guardar la actualización de estado
  const { error: statusError } = await supabase
    .from('whatsapp_message_status')
    .insert({
      message_id: status.id,
      status: status.status,
      timestamp: new Date(parseInt(status.timestamp) * 1000).toISOString(),
      error_code: status.errors?.[0]?.code,
      error_title: status.errors?.[0]?.title,
      created_at: new Date().toISOString()
    });
  
  if (statusError) {
    throw new Error(`Error al guardar estado: ${statusError.message}`);
  }
  
  // Actualizar el estado del mensaje
  const { error: updateError } = await supabase
    .from('whatsapp_messages')
    .update({ status: status.status })
    .eq('message_id', status.id);
  
  if (updateError) {
    console.error(`Error al actualizar estado del mensaje: ${updateError.message}`);
  }
  
  return {
    success: true,
    action: 'processed_status',
    status: status.status
  };
}