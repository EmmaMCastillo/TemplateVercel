# Guía de Integración de WhatsApp

## Resumen de la Implementación

Hemos implementado la integración de envío automático de notificaciones por WhatsApp cuando se crea un nuevo usuario, utilizando la API oficial de WhatsApp Cloud. La solución está completamente integrada con el flujo existente de creación de usuarios.

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

### Error de Número de Teléfono

Si recibes un error relacionado con el número de teléfono, asegúrate de que:
1. El número esté en formato internacional (ej: +573153041548)
2. El número esté registrado en WhatsApp
3. Si estás en modo sandbox de WhatsApp, el número debe estar verificado en tu cuenta de desarrollador

## Recursos Adicionales

- [Documentación oficial de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Sample endpoints de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/sample-app-endpoints/)
- [Configuración de webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks)