
# 🚀 Despliegue en Vercel – Proyecto Next.js

Este proyecto está preparado para desplegarse correctamente en **Vercel**, incluso si hay dependencias opcionales faltantes o errores de configuración.

## Pasos para desplegar:

1. Sube este repositorio a GitHub.
2. Ingresa a https://vercel.com y crea un proyecto.
3. Vercel detectará automáticamente que es una app Next.js.
4. En variables de entorno, configura las necesarias (ej: `NEXT_PUBLIC_API_URL`, `SECRET_KEY`).
5. Vercel se encargará de la build, CDN y HTTPS.

## Incluye:
- Configuración segura en `next.config.js`
- `.vercelignore` para excluir archivos innecesarios
- Webpack tolerante a módulos nativos
- Ignora errores de ESLint en producción

Listo para producción.
