# Guía de Arquitectura Base y Buenas Prácticas de Desarrollo

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura de Carpetas](#arquitectura-de-carpetas)
3. [Patrones y Convenciones](#patrones-y-convenciones)
4. [Buenas Prácticas](#buenas-prácticas)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Antipatrones a Evitar](#antipatrones-a-evitar)

## Introducción

Esta guía establece la arquitectura base y las buenas prácticas para el desarrollo de aplicaciones utilizando:

- **Next.js 14 App Router**: Framework de React con enrutamiento basado en sistema de archivos
- **Supabase**: Plataforma para autenticación, base de datos y almacenamiento
- **Vercel**: Plataforma para despliegue y funciones serverless
- **Componentes modulares**: Enfoque de desarrollo basado en componentes reutilizables
- **APIs externas**: Integración con servicios como WhatsApp Cloud API

El objetivo es mantener un código limpio, reutilizable, escalable y con bajo acoplamiento.

## Arquitectura de Carpetas

```
# Estructura Actual del Repositorio
src/
│
├── app/                           # Rutas de Next.js (frontend + backend)
│   ├── (apps layout)/apps/        # Módulos de negocio (usuarios, prospectos, etc.)
│   │   └── [modulo]/              # Carpeta específica del módulo (ej: usuarios, solicitudes)
│   │
│   ├── api/                       # API routes para funciones backend
│   │   └── auth/                  # Endpoints relacionados con autenticación
│   │
│   └── layout.js                  # Layout global
│
├── assets/                        # Recursos estáticos (imágenes, etc.)
│   └── img/                       # Imágenes del proyecto
│
├── components/                    # Componentes reutilizables
│   ├── @hk-*/                     # Componentes UI del tema
│   ├── Animation/                 # Componentes de animación
│   ├── auth/                      # Componentes de autenticación
│   └── TinymceEditor/             # Editor de texto enriquecido
│
├── context/                       # Proveedores globales
│   ├── AuthContext.js             # Contexto de autenticación
│   ├── GolobalStateProvider.js    # Proveedor de estado global
│   └── reducer/                   # Reducers para gestión de estado
│
├── data/                          # Datos estáticos o mocks
│
├── hooks/                         # Hooks personalizados
│   ├── useSupabaseQuery.js        # Hook para consultas a Supabase
│   └── useSupabaseAdminQuery.js   # Hook para consultas administrativas
│
├── layout/                        # Componentes de layout
│   ├── apps-layout/               # Layout para aplicaciones
│   ├── auth-layout/               # Layout para autenticación
│   ├── Footer/                    # Componente de pie de página
│   ├── Header/                    # Componente de encabezado
│   └── Sidebar/                   # Componente de barra lateral
│
├── styles/                        # Archivos de estilo globales
│   ├── css/                       # Estilos CSS
│   ├── fonts/                     # Fuentes tipográficas
│   └── scss/                      # Estilos SCSS
│
└── utils/                         # Lógica utilitaria, instancias compartidas
    ├── supabase.js                # Única fuente de instancia Supabase
    └── notifications/             # Utilidades para notificaciones

# Estructura Recomendada (Mejoras Propuestas)
src/
│
├── app/                           # Rutas de Next.js (frontend + backend)
│   ├── (apps layout)/apps/        # Módulos de negocio (usuarios, prospectos, etc.)
│   │   ├── [modulo]/              # Carpeta específica del módulo
│   │   │   ├── page.jsx           # Página principal del módulo
│   │   │   ├── [ModuloPage].jsx   # Componente principal del módulo
│   │   │   ├── [ComponenteA].jsx  # Componentes específicos del módulo
│   │   │   └── [ComponenteB].jsx
│   │
│   ├── api/                       # API routes para funciones backend
│   │   ├── auth/                  # Endpoints relacionados con autenticación
│   │   ├── [modulo]/              # Endpoints específicos de un módulo
│   │   └── webhooks/              # Endpoints para webhooks externos
│   │
│   └── layout.jsx                 # Layout global
│
├── assets/                        # Recursos estáticos (imágenes, etc.)
│   └── img/                       # Imágenes del proyecto
│
├── components/                    # Componentes reutilizables
│   ├── ui/                        # Elementos visuales (inputs, botones, tablas, etc.)
│   │   └── @hk-*/                 # Componentes UI del tema
│   │
│   ├── layout/                    # Menús, encabezados, loaders globales
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   │
│   └── [modulo]/                  # Componentes específicos de un módulo que podrían ser reutilizados
│
├── context/                       # Proveedores globales
│   ├── AuthContext.js             # Contexto de autenticación
│   ├── [OtroContexto].js          # Otros contextos globales
│   └── reducer/                   # Reducers para gestión de estado
│
├── hooks/                         # Hooks personalizados
│   ├── useSupabaseQuery.js        # Hook para consultas a Supabase
│   ├── useSupabaseAdminQuery.js   # Hook para consultas administrativas
│   └── use[Funcionalidad].js      # Otros hooks personalizados
│
├── services/                      # PROPUESTA: Integraciones externas (a crear)
│   ├── whatsapp/                  # Servicios para WhatsApp API
│   │   ├── sendMessage.js
│   │   └── templates.js
│   │
│   └── [otroServicio]/            # Otros servicios externos
│
├── utils/                         # Lógica utilitaria, instancias compartidas
│   ├── supabase.js                # Única fuente de instancia Supabase
│   ├── constants.js               # Constantes globales
│   ├── helpers.js                 # Funciones auxiliares
│   └── notifications/             # Utilidades para notificaciones
│
├── styles/                        # Archivos de estilo globales
│   ├── css/
│   ├── scss/
│   └── fonts/
│
└── middleware.ts                  # Seguridad y reglas globales (a crear)
```

## Patrones y Convenciones

### Nomenclatura

1. **Archivos y Carpetas**:
   - Carpetas en minúsculas con guiones si son múltiples palabras: `user-management/`
   - Componentes React en PascalCase: `UserCard.jsx`
   - Hooks, utilidades y servicios en camelCase: `useSupabaseQuery.js`, `formatDate.js`
   - Archivos de API routes en camelCase: `createUser.js`

2. **Componentes**:
   - Nombres descriptivos que indiquen su función: `UserProfileCard`, `PaymentForm`
   - Archivos de componentes con extensión `.jsx`
   - Un componente por archivo (excepto componentes muy pequeños y relacionados)

3. **Hooks**:
   - Prefijo `use`: `useSupabaseQuery`, `useUserData`
   - Nombres que describan su funcionalidad

4. **Contextos**:
   - Sufijo `Context`: `AuthContext`, `ThemeContext`
   - Archivos de contexto con nombre descriptivo: `AuthContext.js`

5. **Servicios**:
   - Nombres de funciones en camelCase que describan la acción: `sendWhatsAppMessage`, `uploadFile`

### Estructura de Rutas (App Router)

1. **Páginas de Módulos**:
   - Ubicación: `/app/(apps layout)/apps/[nombreModulo]/page.jsx`
   - Componente principal: `/app/(apps layout)/apps/[nombreModulo]/[NombreModuloPage].jsx`

2. **API Routes**:
   - Ubicación: `/app/api/[nombreModulo]/[accion].js`
   - Ejemplo: `/app/api/usuarios/crear.js`

3. **Layouts**:
   - Layout global: `/app/layout.jsx`
   - Layout de aplicaciones: `/app/(apps layout)/layout.jsx`
   - Layout de autenticación: `/app/(auth layout)/layout.jsx`

## Buenas Prácticas

### 🧠 1. Supabase siempre desde una fuente centralizada

- **SIEMPRE** importar desde `utils/supabase.js`
- **NUNCA** volver a usar `createClient()` directamente
- Usar `supabase` para operaciones de cliente
- Usar `supabaseAdmin` solo para operaciones administrativas en el servidor

```javascript
// ✅ CORRECTO
import { supabase } from '@/utils/supabase';

// ❌ INCORRECTO
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

### 🔁 2. Toda lógica de consumo a BD debe ir en un hook personalizado

- Crear hooks específicos para cada tipo de operación
- Los hooks deben controlar loading, error y refetch
- Incluir timeout por defecto y manejo de reintentos
- Manejar errores de red y otros problemas comunes

```javascript
// ✅ CORRECTO
const { data, loading, error, refetch } = useSupabaseQuery('usuarios', {
  filters: { active: true },
  timeout: 5000
});

// ❌ INCORRECTO
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    const { data } = await supabase.from('usuarios').select('*');
    setUsers(data);
    setLoading(false);
  };
  fetchUsers();
}, []);
```

### 📦 3. Las llamadas a APIs externas deben estar encapsuladas en servicios dedicados

- **PROPUESTA DE MEJORA**: Crear una carpeta `src/services/` para organizar todas las integraciones externas
- Organizar por servicio: `services/whatsapp/`, `services/email/`
- Cada función debe recibir parámetros estructurados
- Manejar headers, errores y logs de manera consistente
- Implementar reintentos y timeouts cuando sea apropiado

```javascript
// ✅ CORRECTO (Estructura propuesta)
// src/services/whatsapp/sendMessage.js
export async function sendWhatsAppMessage({ to, templateName, parameters }) {
  // Implementación con manejo de errores, timeouts y reintentos
}

// En el componente o hook que lo utiliza:
import { sendWhatsAppMessage } from '@/services/whatsapp/sendMessage';

await sendWhatsAppMessage({
  to: '+1234567890',
  templateName: 'appointment_reminder',
  parameters: { name: 'Juan', date: '2023-05-15' }
});

// ❌ INCORRECTO: Llamadas a APIs directamente en componentes o hooks
const sendMessage = async () => {
  await fetch('https://graph.facebook.com/v13.0/...', {
    method: 'POST',
    headers: { ... },
    body: JSON.stringify({ ... })
  });
};
```

> **Nota**: Actualmente, el proyecto no tiene una carpeta `services` dedicada. Se recomienda crear esta estructura para mejorar la organización y mantenibilidad del código.

### 🧩 4. Componentes deben ser pequeños y separados por responsabilidad

- Componentes de UI puros en `components/ui/`
- Componentes específicos de módulos en su carpeta correspondiente
- Separar lógica de presentación
- Usar composición para construir componentes complejos

```javascript
// ✅ CORRECTO
// UserForm.jsx - Componente de formulario
const UserForm = ({ onSubmit, initialData }) => {
  // Lógica de formulario
  return <Form>...</Form>;
};

// UserPage.jsx - Componente de página
const UserPage = () => {
  const { data, loading } = useUserData();
  const handleSubmit = async (formData) => {
    await updateUser(formData);
  };
  
  return (
    <Container>
      {loading ? <Spinner /> : <UserForm onSubmit={handleSubmit} initialData={data} />}
    </Container>
  );
};

// ❌ INCORRECTO
const UserPage = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data, update state, etc.
  }, []);
  
  const handleSubmit = async () => {
    // Validate, submit, handle errors, etc.
  };
  
  return (
    <Container>
      {loading ? <Spinner /> : (
        <Form onSubmit={handleSubmit}>
          {/* Muchos campos y lógica mezclados */}
        </Form>
      )}
    </Container>
  );
};
```

### 🔒 5. Todos los componentes con lógica sensible deben pasar por contextos

- Usar contextos para autenticación, permisos, temas, etc.
- Crear hooks personalizados para acceder a los contextos
- Mantener la lógica de estado global separada de los componentes

```javascript
// ✅ CORRECTO
// AuthContext.js
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lógica de autenticación
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
};

// useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

// Component.jsx
const Component = () => {
  const { user, signOut } = useAuth();
  // ...
};

// ❌ INCORRECTO
const Component = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const { data } = supabase.auth.getSession();
    setUser(data?.session?.user);
    
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // ...
};
```

### 🌐 6. Todas las nuevas rutas o páginas deben crearse bajo el esquema establecido

- Seguir la estructura de carpetas definida
- Mantener la coherencia en la organización de archivos
- Respetar las convenciones de nomenclatura

```
/app/(apps layout)/apps/usuarios/page.jsx         # Ruta: /apps/usuarios
/app/(apps layout)/apps/usuarios/UsuariosPage.jsx # Componente principal
/app/(apps layout)/apps/usuarios/[id]/page.jsx    # Ruta: /apps/usuarios/[id]
```

### 🧪 7. Toda nueva lógica debe tener prueba visual y validación manual

Checklist para QA manual:
- Carga del componente
- Validación de error
- Prueba de timeout
- Refetch
- No rompe login ni navegación

## Ejemplos de Implementación

### Ejemplo 1: Hook personalizado para consultas a Supabase

```javascript
// hooks/useSupabaseQuery.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';

export function useSupabaseQuery(table, options = {}) {
  const {
    select = '*',
    filters = null,
    timeout = 10000,
    retries = 2,
    initialFetch = true
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    let retry = 0;
    let timeoutId;

    const attempt = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(table).select(select);
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout de consulta')), timeout);
        });

        const { data: result, error: queryError } = await Promise.race([
          query,
          timeoutPromise,
        ]);

        if (timeoutId) clearTimeout(timeoutId);
        if (queryError) throw queryError;

        setData(result || []);
        return result;
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);

        if (retry < retries) {
          retry++;
          return await attempt();
        }

        setError(err.message || 'Error al cargar datos');
        setData([]);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return await attempt();
  }, [table, select, filters, retries, timeout]);

  useEffect(() => {
    if (initialFetch) fetchData();
  }, [fetchData, initialFetch]);

  return { data, loading, error, refetch: fetchData };
}
```

### Ejemplo 2: Servicio para enviar mensajes de WhatsApp (Propuesta de Implementación)

```javascript
// PROPUESTA: src/services/whatsapp/sendMessage.js
import { WHATSAPP_API_URL, WHATSAPP_TOKEN } from '@/utils/constants';

/**
 * Envía un mensaje de WhatsApp utilizando una plantilla
 * @param {Object} params - Parámetros para el envío
 * @param {string} params.to - Número de teléfono del destinatario (con código de país)
 * @param {string} params.templateName - Nombre de la plantilla aprobada
 * @param {Object} params.parameters - Parámetros para la plantilla
 * @param {number} [params.timeout=10000] - Tiempo máximo de espera en ms
 * @param {number} [params.retries=2] - Número de reintentos en caso de error
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function sendWhatsAppMessage({
  to,
  templateName,
  parameters,
  timeout = 10000,
  retries = 2
}) {
  let attempt = 0;
  
  const sendAttempt = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${WHATSAPP_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'es' },
            components: [
              {
                type: 'body',
                parameters: Object.entries(parameters).map(([_, value]) => ({
                  type: 'text',
                  text: value
                }))
              }
            ]
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al enviar mensaje');
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al enviar mensaje');
      }
      
      if (attempt < retries) {
        attempt++;
        console.log(`Reintentando envío de WhatsApp (${attempt}/${retries})...`);
        return await sendAttempt();
      }
      
      throw error;
    }
  };
  
  return await sendAttempt();
}
```

> **Nota**: Este es un ejemplo de cómo debería implementarse un servicio para WhatsApp siguiendo las buenas prácticas. Actualmente, el proyecto no tiene una carpeta `services` dedicada, por lo que se recomienda crear esta estructura.

### Ejemplo 3: Componente de página con hooks personalizados

```jsx
// app/(apps layout)/apps/usuarios/UsuariosPage.jsx
'use client';
import React, { useState } from 'react';
import { Button, Card, Container, Form, InputGroup, Row, Table, Spinner } from 'react-bootstrap';
import { Edit, Search, Plus, Trash } from 'tabler-icons-react';
import { useSupabaseAdminQuery } from '@/hooks/useSupabaseAdminQuery';
import { useUserManagement } from '@/hooks/useUserManagement';
import NuevoUsuarioModal from './NuevoUsuarioModal';
import EditarUsuarioModal from './EditarUsuarioModal';

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  
  // Usar hooks personalizados para la lógica de negocio
  const { users: usuarios, loading, error, refetch: fetchUsuarios } = useSupabaseAdminQuery({
    timeout: 8000,
    retries: 2
  });
  
  const { deleteUser } = useUserManagement();
  
  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.user_metadata?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handlers para modales
  const handleOpenNuevoModal = () => setShowNuevoModal(true);
  const handleCloseNuevoModal = () => setShowNuevoModal(false);
  
  const handleOpenEditarModal = (usuario) => {
    setSelectedUsuario(usuario);
    setShowEditarModal(true);
  };
  const handleCloseEditarModal = () => setShowEditarModal(false);
  
  // Handler para eliminar usuario
  const handleEliminarUsuario = async (usuarioId) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
      return;
    }
    
    try {
      await deleteUser(usuarioId);
      fetchUsuarios();
    } catch (err) {
      alert(`Error al eliminar usuario: ${err.message || 'Error desconocido'}`);
    }
  };
  
  return (
    <>
      <Container fluid className="mt-4">
        {/* Encabezado y controles */}
        <Row className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Usuarios</h1>
            <Button variant="primary" onClick={handleOpenNuevoModal}>
              <Plus size={18} className="me-2" />
              Nuevo Usuario
            </Button>
          </div>
        </Row>
        
        {/* Barra de búsqueda */}
        <InputGroup className="mb-4">
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        {/* Estado de carga y errores */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {/* Tabla de usuarios */}
        <Card>
          <Card.Body>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.user_metadata?.nombre || 'Sin nombre'}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.user_metadata?.rol || 'Usuario'}</td>
                      <td>{usuario.email_confirmed_at ? 'Confirmado' : 'Pendiente'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenEditarModal(usuario)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminarUsuario(usuario.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modales */}
      <NuevoUsuarioModal
        show={showNuevoModal}
        onHide={handleCloseNuevoModal}
        onUsuarioCreated={fetchUsuarios}
      />
      
      <EditarUsuarioModal
        show={showEditarModal}
        onHide={handleCloseEditarModal}
        usuario={selectedUsuario}
        onUsuarioUpdated={fetchUsuarios}
      />
    </>
  );
};

export default UsuariosPage;
```

### Ejemplo 4: Hook para gestión de usuarios (Propuesta de Implementación)

```javascript
// PROPUESTA: src/hooks/useUserManagement.js
import { useState } from 'react';
import { supabaseAdmin } from '@/utils/supabase';

export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          nombre: userData.nombre,
          rol: userData.rol,
          telefono: userData.telefono
        }
      });
      
      if (createError) throw createError;
      
      return data.user;
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualiza un usuario existente
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  const updateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          email: userData.email,
          user_metadata: {
            nombre: userData.nombre,
            rol: userData.rol,
            telefono: userData.telefono
          }
        }
      );
      
      if (updateError) throw updateError;
      
      return data.user;
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Elimina un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<void>}
   */
  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    createUser,
    updateUser,
    deleteUser,
    loading,
    error
  };
}
```

> **Nota**: Este es un ejemplo de cómo debería implementarse un hook para gestión de usuarios siguiendo las buenas prácticas. Actualmente, el proyecto no tiene este hook, por lo que se recomienda crearlo para encapsular la lógica de gestión de usuarios.

## Antipatrones a Evitar

### 1. Múltiples instancias de Supabase

```javascript
// ❌ INCORRECTO: Crear múltiples instancias de Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// En otro archivo
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### 2. Lógica de consulta directamente en componentes

```jsx
// ❌ INCORRECTO: Lógica de consulta en componentes
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Resto del componente
};
```

### 3. Uso de setTimeout sin control

```javascript
// ❌ INCORRECTO: Uso de setTimeout sin control
const fetchData = async () => {
  setTimeout(() => {
    // Código que puede ejecutarse múltiples veces si el componente se remonta
  }, 5000);
};
```

### 4. Mezclar lógica de presentación y negocio

```jsx
// ❌ INCORRECTO: Mezclar lógica de presentación y negocio
const UserForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validación
      if (!formData.email) {
        alert('El email es requerido');
        return;
      }
      
      // Llamada a API
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      
      if (error) throw error;
      
      // Actualizar metadatos
      await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: formData.name,
          updated_at: new Date()
        });
        
      // Redirección
      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // JSX con mucha lógica mezclada
};
```

### 5. No manejar errores ni estados de carga

```jsx
// ❌ INCORRECTO: No manejar errores ni estados de carga
const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('items').select('*');
      setData(data);
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```
