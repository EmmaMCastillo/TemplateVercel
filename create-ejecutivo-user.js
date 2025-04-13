// Script para crear un usuario ejecutivo en Supabase Auth
const { createClient } = require('@supabase/supabase-js');

// Usar directamente las credenciales proporcionadas
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Crear cliente de Supabase con la clave de servicio
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Datos del usuario ejecutivo
const ejecutivoUser = {
  email: 'ejecutivo@example.com',
  password: 'Ejecutivo123!',
  user_metadata: {
    nombre: 'Usuario Ejecutivo',
    rol: 'ejecutivo'
  },
  email_confirm: true // Confirmar email automáticamente
};

// Función para crear el usuario ejecutivo
async function createEjecutivoUser() {
  try {
    console.log('Creando usuario ejecutivo...');
    
    // Crear usuario ejecutivo
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ejecutivoUser.email,
      password: ejecutivoUser.password,
      email_confirm: ejecutivoUser.email_confirm,
      user_metadata: ejecutivoUser.user_metadata
    });
    
    if (error) {
      console.error('Error al crear usuario ejecutivo:', error);
      return;
    }
    
    console.log('Usuario ejecutivo creado exitosamente:', data.user);
    
    // Verificar si existe el rol de ejecutivo en la tabla roles_permisos
    const { data: existingRole, error: roleError } = await supabaseAdmin
      .from('roles_permisos')
      .select('id')
      .eq('rol_id', 'ejecutivo')
      .single();
    
    if (roleError && roleError.code !== 'PGRST116') {
      console.error('Error al verificar rol de ejecutivo:', roleError);
    }
    
    // Si no existe el rol, crearlo con permisos limitados
    if (!existingRole) {
      console.log('Creando rol de ejecutivo con permisos...');
      
      // Definir permisos de ejecutivo
      const ejecutivoPermisos = {
        // Dashboard - solo lectura
        'dashboard': { access: 'read' },
        'dashboard_ver_estadisticas': { access: 'read' },
        'dashboard_ver_graficos': { access: 'read' },
        
        // Prospectos - escritura
        'prospectos': { access: 'write' },
        'prospectos_ver_prospectos': { access: 'read' },
        'prospectos_crear_prospecto': { access: 'write' },
        'prospectos_editar_prospecto': { access: 'write' },
        'prospectos_eliminar_prospecto': { access: 'no_access' },
        'prospectos_exportar_prospectos': { access: 'read' },
        
        // Solicitudes - escritura limitada
        'solicitudes': { access: 'write' },
        'solicitudes_ver_solicitudes': { access: 'read' },
        'solicitudes_crear_solicitud': { access: 'write' },
        'solicitudes_editar_solicitud': { access: 'write' },
        'solicitudes_gestionar_documentos': { access: 'write' },
        'solicitudes_subir_documentos': { access: 'write' },
        'solicitudes_desembolso': { access: 'no_access' },
        
        // Bancos - solo lectura
        'bancos': { access: 'read' },
        'bancos_ver_bancos': { access: 'read' },
        'bancos_crear_banco': { access: 'no_access' },
        'bancos_editar_banco': { access: 'no_access' },
        
        // Usuarios - sin acceso
        'usuarios': { access: 'no_access' },
        'usuarios_ver_usuarios': { access: 'no_access' },
        'usuarios_crear_usuario': { access: 'no_access' },
        'usuarios_editar_usuario': { access: 'no_access' },
        'usuarios_gestionar_permisos': { access: 'no_access' }
      };
      
      // Insertar permisos para el rol de ejecutivo
      const { error: insertError } = await supabaseAdmin
        .from('roles_permisos')
        .insert([
          {
            rol_id: 'ejecutivo',
            permisos: ejecutivoPermisos
          }
        ]);
      
      if (insertError) {
        console.error('Error al insertar permisos para el rol de ejecutivo:', insertError);
      } else {
        console.log('Permisos para el rol de ejecutivo insertados exitosamente.');
      }
    }
    
    console.log('\n===== CREDENCIALES DE ACCESO =====');
    console.log('Email: ' + ejecutivoUser.email);
    console.log('Contraseña: ' + ejecutivoUser.password);
    console.log('===================================\n');
    
  } catch (err) {
    console.error('Error general al crear usuario ejecutivo:', err);
  }
}

// Ejecutar la función
createEjecutivoUser();