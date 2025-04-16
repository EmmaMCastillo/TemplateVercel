import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/services/whatsapp/sendMessage';

/**
 * Endpoint para probar el envío de mensajes de WhatsApp
 * Este endpoint es solo para pruebas en ambiente local
 */
export async function POST(request) {
  try {
    // Obtener datos de la solicitud
    const { phoneNumber, message } = await request.json();
    
    // Validar datos
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'El número de teléfono es requerido' },
        { status: 400 }
      );
    }
    
    console.log(`Enviando mensaje de prueba a ${phoneNumber}`);
    
    // Enviar mensaje
    const result = await sendWhatsAppMessage({
      to: phoneNumber,
      message: message || 'Mensaje de prueba desde la aplicación'
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: result.data
    });
  } catch (error) {
    console.error('Error al enviar mensaje de prueba:', error);
    return NextResponse.json(
      { error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}