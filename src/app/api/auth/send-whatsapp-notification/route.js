import { NextResponse } from 'next/server';
import { sendWelcomeWhatsappMessage } from '@/utils/notifications/whatsappSender';

export async function POST(request) {
  try {
    // Obtener datos de la solicitud
    const { phoneNumber, nombre } = await request.json();

    // Validar datos
    if (!phoneNumber || !nombre) {
      return NextResponse.json(
        { error: 'El número de teléfono y el nombre son requeridos' },
        { status: 400 }
      );
    }

    // Imprimir variables de entorno para depuración
    console.log('WHATSAPP_TOKEN:', process.env.WHATSAPP_TOKEN ? 'Configurado' : 'No configurado');
    console.log('PHONE_NUMBER_ID:', process.env.PHONE_NUMBER_ID ? 'Configurado' : 'No configurado');
    
    // Iniciar el envío del mensaje pero no esperar a que termine
    sendWelcomeWhatsappMessage({ phoneNumber, nombre })
      .then(result => {
        if (result.success) {
          console.log('Mensaje de WhatsApp enviado exitosamente a:', phoneNumber);
        } else {
          console.error('Error al enviar mensaje de WhatsApp:', result.error);
        }
      })
      .catch(err => console.error('Error al enviar mensaje de WhatsApp:', err));
    
    // Responder inmediatamente con éxito
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al preparar el envío de mensaje de WhatsApp:', error);
    
    // Proporcionar información más detallada sobre el error
    let errorMessage = 'Error al enviar mensaje de WhatsApp';
    let errorDetails = {};
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        originalError: error.message
      },
      { status: 500 }
    );
  }
}