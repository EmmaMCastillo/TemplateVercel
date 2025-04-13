// Script para crear un usuario administrador en Supabase Auth
const { createClient } = require('@supabase/supabase-js');

// Usar directamente las credenciales proporcionadas
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Crear cliente de Supabase con la clave de servicio
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Datos del usuario administrador
const adminUser = {
  email: 'admin@example.com',
  password: 'Admin123!',
  user_metadata: {
    nombre: 'Administrador',
    rol: 'admin'
  },
  email_confirm: true // Confirmar email automáticamente
};

// Función para crear el usuario administrador
async function createAdminUser() {
  try {
    console.log('Creando usuario administrador...');
    
    // Crear usuario administrador
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminUser.email,
      password: adminUser.password,
      email_confirm: adminUser.email_confirm,
      user_metadata: adminUser.user_metadata
    });
    
    if (error) {
      console.error('Error al crear usuario administrador:', error);
      return;
    }
    
    console.log('Usuario administrador creado exitosamente:', data.user);
    
    // Verificar si existe el rol de administrador en la tabla roles_permisos
    const { data: existingRole, error: roleError } = await supabaseAdmin
      .from('roles_permisos')
      .select('id')
      .eq('rol_id', 'admin')
      .single();
    
    if (roleError && roleError.code !== 'PGRST116') {
      console.error('Error al verificar rol de administrador:', roleError);
    }
    
    // Si no existe el rol, crearlo con todos los permisos
    if (!existingRole) {
      console.log('Creando rol de administrador con permisos...');
      
      // Definir permisos de administrador
      const adminPermisos = {};
      
      // Módulos y acciones
      const modules = {
        dashboard: {
          actions: ['ver_estadisticas', 'ver_graficos']
        },
        prospectos: {
          actions: ['ver_prospectos', 'crear_prospecto', 'editar_prospecto', 'eliminar_prospecto', 'exportar_prospectos']
        },
        solicitudes: {
          actions: ['ver_solicitudes', 'crear_solicitud', 'editar_solicitud', 'gestionar_documentos', 'subir_documentos', 'desembolso']
        },
        bancos: {
          actions: ['ver_bancos', 'crear_banco', 'editar_banco']
        },
        usuarios: {
          actions: ['ver_usuarios', 'crear_usuario', 'editar_usuario', 'gestionar_permisos']
        }
      };
      
      // Asignar permisos de administrador a todos los módulos y acciones
      Object.keys(modules).forEach(moduleId => {
        adminPermisos[moduleId] = { access: 'admin' };
        
        modules[moduleId].actions.forEach(actionId => {
          adminPermisos[`${moduleId}_${actionId}`] = { access: 'admin' };
        });
      });
      
      // Insertar permisos para el rol de administrador
      const { error: insertError } = await supabaseAdmin
        .from('roles_permisos')
        .insert([
          {
            rol_id: 'admin',
            permisos: adminPermisos
          }
        ]);
      
      if (insertError) {
        console.error('Error al insertar permisos para el rol de administrador:', insertError);
      } else {
        console.log('Permisos para el rol de administrador insertados exitosamente.');
      }
    }
    
    console.log('\n===== CREDENCIALES DE ACCESO =====');
    console.log('Email: ' + adminUser.email);
    console.log('Contraseña: ' + adminUser.password);
    console.log('===================================\n');
    
  } catch (err) {
    console.error('Error general al crear usuario administrador:', err);
  }
}

// Ejecutar la función
createAdminUser();