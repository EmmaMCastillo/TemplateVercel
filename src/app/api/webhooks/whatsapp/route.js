import { NextResponse } from 'next/server';
import { processIncomingMessage } from '@/services/whatsapp/receiveMessage';

/**
 * Endpoint para verificación del webhook de WhatsApp
 * Este endpoint es llamado por Meta para verificar la propiedad del webhook
 */
export async function GET(request) {
  try {
    console.log('Recibida solicitud de verificación de webhook');
    
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    
    // Obtener el token de verificación y el desafío
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');
    
    console.log(`Parámetros de verificación: mode=${mode}, token=${token}, challenge=${challenge}`);
    
    // Verificar que sea una solicitud de suscripción y que el token coincida
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verificado exitosamente');
      // Devolver el desafío como respuesta para confirmar la verificación
      return new Response(challenge, { status: 200 });
    } else {
      console.error('Verificación de webhook fallida');
      return new Response('Verification failed', { status: 403 });
    }
  } catch (error) {
    console.error('Error en la verificación del webhook:', error);
    return new Response('Error', { status: 500 });
  }
}

/**
 * Endpoint para recibir notificaciones de WhatsApp
 * Este endpoint es llamado por Meta cuando hay nuevos mensajes o eventos
 */
export async function POST(request) {
  try {
    console.log('Recibida notificación de webhook');
    
    // Obtener datos del webhook
    const webhookData = await request.json();
    
    // Verificar si es una notificación válida de WhatsApp
    if (!webhookData.object || webhookData.object !== 'whatsapp_business_account') {
      console.log('Evento no relacionado con WhatsApp Business');
      return NextResponse.json({ success: true, message: 'Ignored' });
    }
    
    // Procesar el mensaje entrante
    const result = await processIncomingMessage(webhookData);
    
    if (!result.success) {
      console.error('Error al procesar mensaje:', result.error);
      // Importante: Siempre devolver un 200 OK para que Meta no reintente el webhook
      return NextResponse.json({ success: false, error: result.error }, { status: 200 });
    }
    
    // Siempre devolver un 200 OK para confirmar la recepción del webhook
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('Error en el webhook de WhatsApp:', error);
    // Importante: Siempre devolver un 200 OK para que Meta no reintente el webhook
    return NextResponse.json(
      { success: false, error: error.message || 'Error desconocido' },
      { status: 200 }
    );
  }
}