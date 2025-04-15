# Guía de Integración de WhatsApp

## Resumen de la Implementación

Hemos implementado la integración de envío automático de notificaciones por WhatsApp cuando se crea un nuevo usuario, utilizando la API oficial de WhatsApp Cloud. La solución está completamente integrada con el flujo existente de creación de usuarios.

> **NOTA IMPORTANTE**: La cuenta de WhatsApp Business API está actualmente en modo sandbox, lo que significa que solo se pueden enviar mensajes usando plantillas predefinidas. Actualmente se usa la plantilla "hello_world" en lugar de mensajes personalizados. Para enviar mensajes personalizados, es necesario solicitar la aprobación de la cuenta en modo producción.

### Componentes Implementados

1. **Servicio de WhatsApp**
   - Ubicación: `src/utils/notifications/whatsappSender.js`
   - Funciones:
     - `sendWhatsappNotification`: Función genérica para enviar mensajes
     - `sendWelcomeWhatsappMessage`: Función específica para mensajes de bienvenida

2. **Endpoint de API**
   - Ubicación: `src/app/api/auth/send-whatsapp-notification/route.js`
   - Maneja las solicitudes de envío de notificaciones

3. **Integración en Modal de Usuarios**
   - Modificado: `src/app/(apps layout)/apps/usuarios/NuevoUsuarioModal.jsx`
   - Se agregó campo para número de teléfono
   - Se integró el envío de notificaciones al crear usuarios

4. **Script de Prueba**
   - Ubicación: `test-whatsapp-notification.js`
   - Permite probar el envío de notificaciones directamente

## Configuración de Variables de Entorno

Las siguientes variables de entorno son necesarias para el funcionamiento de la integración:

```
WHATSAPP_TOKEN=tu_token_de_acceso
PHONE_NUMBER_ID=tu_phone_number_id
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

1. El administrador abre el modal para crear un nuevo usuario
2. Completa los datos, incluyendo el número de teléfono para WhatsApp
3. Al guardar, se crea el usuario en Supabase Auth
4. Si se proporcionó un número de teléfono, se envía automáticamente una notificación por WhatsApp
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
3. **Números verificados**: Solo se pueden enviar mensajes a números de teléfono que hayan sido verificados en la cuenta de desarrollador.
4. **Límite de mensajes**: Hay un límite en la cantidad de mensajes que se pueden enviar por día.

Para superar estas limitaciones, es necesario solicitar la aprobación de la cuenta en modo producción a través del [Meta Business Manager](https://business.facebook.com/).

### Error de Número de Teléfono

Si recibes un error relacionado con el número de teléfono, asegúrate de que:
1. El número esté en formato internacional (ej: +573153041548)
2. El número esté registrado en WhatsApp
3. El número esté verificado en tu cuenta de desarrollador de WhatsApp (requisito en modo sandbox)

## Recursos Adicionales

- [Documentación oficial de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Sample endpoints de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/sample-app-endpoints/)
- [Configuración de webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks)
- [Plantillas de mensajes](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- [Solicitar aprobación para modo producción](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#move-to-production)

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