import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configurar AWS SES
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export async function POST(request) {
  try {
    // Imprimir las variables de entorno para depuración
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Configurado' : 'No configurado');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Configurado' : 'No configurado');
    console.log('AWS_SES_FROM_EMAIL:', process.env.AWS_SES_FROM_EMAIL);
    
    const { email, nombre, temporaryPassword } = await request.json();

    if (!email || !nombre) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Plantilla HTML del correo
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a la Plataforma</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .credentials {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a la Plataforma!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente. A continuación, encontrarás tus credenciales de acceso:</p>
            
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              ${temporaryPassword ? `<p><strong>Contraseña temporal:</strong> ${temporaryPassword}</p>` : ''}
            </div>
            
            <p>Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login/classic" class="button">Iniciar Sesión</a>
            </div>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            
            <p>Saludos,<br>El Equipo de Soporte</p>
          </div>
          <div class="footer">
            <p>Este es un correo electrónico automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Texto plano para clientes de correo que no soportan HTML
    const textBody = `
      ¡Bienvenido a la Plataforma!
      
      Hola ${nombre},
      
      Tu cuenta ha sido creada exitosamente. A continuación, encontrarás tus credenciales de acceso:
      
      Email: ${email}
      ${temporaryPassword ? `Contraseña temporal: ${temporaryPassword}` : ''}
      
      Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
      
      Para iniciar sesión, visita: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login/classic
      
      Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
      
      Saludos,
      El Equipo de Soporte
      
      Este es un correo electrónico automático, por favor no respondas a este mensaje.
    `;

    // Parámetros para enviar el correo
    const params = {
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: '¡Bienvenido a la Plataforma!',
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          },
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8'
          }
        }
      }
    };

    // Enviar el correo
    await ses.sendEmail(params).promise();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al enviar correo de bienvenida:', error);
    
    // Proporcionar información más detallada sobre el error
    let errorMessage = 'Error al enviar correo de bienvenida';
    let errorDetails = {};
    
    if (error.code === 'InvalidClientTokenId') {
      errorMessage = 'Credenciales de AWS inválidas';
      errorDetails = {
        suggestion: 'Verifique que las credenciales de AWS (AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY) sean correctas y estén activas.',
        code: error.code,
        statusCode: error.statusCode
      };
    } else if (error.code === 'MessageRejected') {
      errorMessage = 'Mensaje rechazado por AWS SES';
      errorDetails = {
        suggestion: 'La cuenta de AWS SES está en modo sandbox. Verifique que el correo del remitente y destinatario estén verificados en la consola de AWS SES.',
        code: error.code,
        statusCode: error.statusCode
      };
    }
    
    // Simular éxito en entorno de desarrollo para permitir pruebas
    if (process.env.NODE_ENV === 'development') {
      console.log('Simulando envío exitoso en entorno de desarrollo');
      return NextResponse.json({
        success: true,
        warning: 'Correo simulado en entorno de desarrollo',
        originalError: errorMessage,
        details: errorDetails
      });
    }
    
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