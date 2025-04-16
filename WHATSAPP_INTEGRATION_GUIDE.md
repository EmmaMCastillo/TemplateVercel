# Guía de Integración de WhatsApp

## Resumen de la Implementación

Hemos implementado una integración completa con la API oficial de WhatsApp Cloud que incluye:

1. **Envío automático de notificaciones** cuando se crea un nuevo usuario
2. **Integración con el módulo de chat existente** para conversaciones bidireccionales
3. **Recepción de mensajes entrantes** a través de webhooks
4. **Visualización en tiempo real** de las conversaciones

> **NOTA IMPORTANTE**: La cuenta de WhatsApp Business API está actualmente en modo sandbox, lo que significa que solo se pueden enviar mensajes usando plantillas predefinidas. Actualmente se usa la plantilla "hello_world" en lugar de mensajes personalizados. Para enviar mensajes personalizados, es necesario solicitar la aprobación de la cuenta en modo producción.

### Componentes Implementados

#### Notificaciones de WhatsApp (Implementación Original)

1. **Servicio de WhatsApp para Notificaciones**
   - Ubicación: `src/utils/notifications/whatsappSender.js`
   - Funciones:
     - `sendWhatsappNotification`: Función genérica para enviar mensajes
     - `sendWelcomeWhatsappMessage`: Función específica para mensajes de bienvenida

2. **Endpoint de API para Notificaciones**
   - Ubicación: `src/app/api/auth/send-whatsapp-notification/route.js`
   - Maneja las solicitudes de envío de notificaciones

3. **Integración en Modal de Usuarios**
   - Modificado: `src/app/(apps layout)/apps/usuarios/NuevoUsuarioModal.jsx`
   - Se agregó campo para número de teléfono
   - Se integró el envío de notificaciones al crear usuarios

4. **Script de Prueba**
   - Ubicación: `test-whatsapp-notification.js`
   - Permite probar el envío de notificaciones directamente

#### Integración con el Módulo de Chat (Nueva Implementación)

5. **Servicios de WhatsApp para Chat**
   - Ubicación: `src/services/whatsapp/sendMessage.js`
   - Ubicación: `src/services/whatsapp/receiveMessage.js`
   - Funciones para enviar y recibir mensajes de WhatsApp

6. **Webhook para Recepción de Mensajes**
   - Ubicación: `src/app/api/webhooks/whatsapp/route.js`
   - Recibe y procesa mensajes entrantes de WhatsApp

7. **Hook Personalizado para Integración**
   - Ubicación: `src/hooks/useWhatsAppIntegration.js`
   - Integra la funcionalidad de WhatsApp con el módulo de chat existente

8. **Modificación del Componente ChatFooter**
   - Ubicación: `src/app/(apps layout)/apps/chat/ChatFooter.jsx`
   - Integra la funcionalidad de envío de mensajes a WhatsApp

9. **Página de Prueba**
   - Ubicación: `src/app/whatsapp-test/page.jsx`
   - Permite probar la integración de WhatsApp en ambiente local

## Configuración de Variables de Entorno

Las siguientes variables de entorno son necesarias para el funcionamiento de la integración:

```
# Token de acceso para la API de WhatsApp
NEXT_PUBLIC_WHATSAPP_TOKEN=tu_token_de_acceso
WHATSAPP_TOKEN=${NEXT_PUBLIC_WHATSAPP_TOKEN}

# ID del número de teléfono en WhatsApp Business
NEXT_PUBLIC_PHONE_NUMBER_ID=tu_phone_number_id
PHONE_NUMBER_ID=${NEXT_PUBLIC_PHONE_NUMBER_ID}

# Token personalizado para verificar webhooks
WHATSAPP_VERIFY_TOKEN=token_personalizado_para_verificacion

# ID de la cuenta de WhatsApp Business
WHATSAPP_BUSINESS_ACCOUNT_ID=tu_id_de_cuenta_de_whatsapp_business
```

Estas variables ya están configuradas en el archivo `.env.local`.

## Actualización del Token de Acceso

El token de acceso para la API de WhatsApp Cloud tiene una fecha de caducidad. Cuando expire, necesitarás obtener un nuevo token siguiendo estos pasos:

1. Inicia sesión en [Meta for Developers](https://developers.facebook.com/)
2. Navega a tu aplicación en el panel de control
3. Ve a "Herramientas" > "WhatsApp" > "Configuración de la API"
4. Genera un nuevo token de acceso permanente
5. Actualiza la variable `WHATSAPP_TOKEN` en el archivo `.env.local`

## Prueba de la Integración

Para probar la integración, puedes utilizar el script de prueba incluido:

```bash
node test-whatsapp-notification.js +NÚMERO_DE_TELÉFONO "Nombre del Usuario"
```

Por ejemplo:
```bash
node test-whatsapp-notification.js +573153041548 "Usuario de Prueba"
```
## Flujo de Funcionamiento

### Notificaciones de Usuarios

1. El administrador abre el modal para crear un nuevo usuario
2. Completa los datos, incluyendo el número de teléfono para WhatsApp
3. Al guardar, se crea el usuario en Supabase Auth
4. Si se proporcionó un número de teléfono, se envía automáticamente una notificación por WhatsApp
5. El mensaje enviado es: "Hola [nombre], ¡tu registro fue exitoso! En breve te daremos acceso al sistema. 🛠️"

### Chat con WhatsApp

1. **Envío de Mensajes**:
   - El usuario selecciona un contacto de WhatsApp en el chat (identificado por su número de teléfono)
   - Escribe un mensaje en el componente ChatFooter
   - El mensaje se envía a través de la API de WhatsApp Cloud
   - El mensaje se muestra en el chat y se guarda en la base de datos

2. **Recepción de Mensajes**:
   - El usuario de WhatsApp envía un mensaje al número de la aplicación
   - Meta envía una notificación al webhook configurado
   - El webhook procesa el mensaje y lo guarda en la base de datos
   - El mensaje se muestra en tiempo real en el chat gracias a la suscripción de Supabase
5. El mensaje enviado es: "Hola [nombre], ¡tu registro fue exitoso! En breve te daremos acceso al sistema. 🛠️"

## Solución de Problemas

### Error de Token Expirado

Si recibes un error como:
```
Error validating access token: Session has expired
```

Significa que el token de acceso ha expirado y necesitas generar uno nuevo siguiendo los pasos en la sección "Actualización del Token de Acceso".

### Limitaciones del Modo Sandbox

La cuenta de WhatsApp Business API está actualmente en modo sandbox, lo que implica las siguientes limitaciones:

1. **Solo se pueden usar plantillas predefinidas**: No es posible enviar mensajes de texto personalizados.
2. **Plantilla "hello_world"**: Actualmente se usa esta plantilla en inglés, que envía un mensaje genérico.
3. **Números verificados**: Solo se pueden enviar mensajes a números de teléfono que hayan sido verificados en la cuenta de desarrollador (máximo 5 números).
4. **Límite de mensajes**: Hay un límite de 250 mensajes por día.
5. **Ventana de 24 horas**: Las conversaciones expiran después de 24 horas, y solo se pueden iniciar nuevas conversaciones con plantillas.

Para superar estas limitaciones, es necesario solicitar la aprobación de la cuenta en modo producción a través del [Meta Business Manager](https://business.facebook.com/).

### Error de Número de Teléfono

Si recibes un error relacionado con el número de teléfono, asegúrate de que:
1. El número esté en formato internacional (ej: +573153041548)
2. El número esté registrado en WhatsApp
3. El número esté verificado en tu cuenta de desarrollador de WhatsApp (requisito en modo sandbox)

## Configuración del Webhook

Para recibir mensajes entrantes de WhatsApp, es necesario configurar un webhook en Meta for Developers:

1. **Crear una URL Pública**:
   - La URL del webhook debe ser accesible desde Internet
   - Para desarrollo local, puedes usar [ngrok](https://ngrok.com/) para exponer tu servidor local
   - Ejemplo: `https://tu-dominio.com/api/webhooks/whatsapp`

2. **Configurar el Webhook en Meta**:
   - Ir a [Meta for Developers](https://developers.facebook.com/)
   - Seleccionar tu aplicación
   - Ir a "WhatsApp" > "Configuración" > "Webhooks"
   - Hacer clic en "Configurar webhooks"
   - Ingresar la URL del webhook
   - Ingresar el token de verificación (el mismo que `WHATSAPP_VERIFY_TOKEN`)
   - Seleccionar los campos `messages` y `message_status_updates`

3. **Verificar la Configuración**:
   - Meta enviará una solicitud GET al webhook para verificar la propiedad
   - El endpoint debe responder con el desafío proporcionado por Meta
   - Una vez verificado, Meta comenzará a enviar notificaciones al webhook

## Modelo de Datos

Para almacenar los mensajes de WhatsApp, se han creado las siguientes tablas en Supabase:

```sql
-- Tabla para almacenar mensajes de WhatsApp
CREATE TABLE whatsapp_messages (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) UNIQUE,
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20),
  text TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'text',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  media_url TEXT,
  sender_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar actualizaciones de estado de mensajes
CREATE TABLE whatsapp_message_status (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) REFERENCES whatsapp_messages(message_id),
  status VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  error_code VARCHAR(50),
  error_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Recursos Adicionales

- [Documentación oficial de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Sample endpoints de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/sample-app-endpoints/)
- [Configuración de webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks)
- [Plantillas de mensajes](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- [Solicitar aprobación para modo producción](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#move-to-production)
- [Guía de mensajes de sesión](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-session-messages)

## Próximos Pasos para Producción

Para utilizar mensajes personalizados y enviar a cualquier número de teléfono, se recomienda:

1. Solicitar la aprobación de la cuenta en modo producción
2. Crear plantillas de mensajes personalizadas para diferentes casos de uso
3. Una vez aprobada la cuenta, modificar el código para usar mensajes personalizados en lugar de la plantilla "hello_world"

```javascript
// Ejemplo de código para mensajes personalizados (para usar después de la aprobación)
const requestBody = {
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: formattedPhoneNumber,
  type: "text",
  text: {
    preview_url: false,
    body: `Hola ${nombre}, ¡tu registro fue exitoso! En breve te daremos acceso al sistema. 🛠️`
  }
};
```

## Pruebas y Validación

Para probar la integración completa, se recomienda seguir estos pasos:

1. **Probar Notificaciones**:
   ```bash
   node test-whatsapp-notification.js +NÚMERO_DE_TELÉFONO "Nombre del Usuario"
   ```

2. **Probar Chat Bidireccional**:
   - Acceder a la página de prueba: `http://localhost:3000/whatsapp-test`
   - Enviar un mensaje a un número verificado
   - Verificar que el mensaje se reciba en el teléfono
   - Responder desde el teléfono y verificar que el mensaje aparezca en la página de prueba

3. **Probar Integración con el Módulo de Chat**:
   - Acceder al módulo de chat: `http://localhost:3000/apps/chat/chats`
   - Seleccionar un contacto con formato de número de teléfono
   - Enviar un mensaje y verificar que se envíe a través de WhatsApp
   - Responder desde el teléfono y verificar que el mensaje aparezca en el chat