require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Crear cliente de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createRolesPermisosTable() {
    console.log('Creando tabla roles_permisos...');

    try {
        // Verificar si la tabla ya existe
        const { data: existingTable, error: checkError } = await supabase
            .from('roles_permisos')
            .select('*')
            .limit(1);

        if (checkError && checkError.code === 'PGRST116') {
            // La tabla no existe, crearla
            const { error: createError } = await supabase.rpc('create_roles_permisos_table');

            if (createError) {
                console.error('Error al crear la tabla roles_permisos:', createError);
                
                // Intentar crear la tabla usando SQL directo
                console.log('Intentando crear la tabla usando SQL directo...');
                
                // Crear la función para crear la tabla
                const { error: createFunctionError } = await supabase.rpc('execute_sql', {
                    sql_query: `
                    CREATE OR REPLACE FUNCTION create_roles_permisos_table()
                    RETURNS void AS $$
                    BEGIN
                        CREATE TABLE IF NOT EXISTS roles_permisos (
                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            rol_id TEXT NOT NULL,
                            permisos JSONB NOT NULL DEFAULT '{}'::jsonb,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                        
                        -- Crear índice para búsquedas rápidas por rol_id
                        CREATE INDEX IF NOT EXISTS roles_permisos_rol_id_idx ON roles_permisos (rol_id);
                        
                        -- Agregar restricción de unicidad para rol_id
                        ALTER TABLE roles_permisos DROP CONSTRAINT IF EXISTS roles_permisos_rol_id_key;
                        ALTER TABLE roles_permisos ADD CONSTRAINT roles_permisos_rol_id_key UNIQUE (rol_id);
                    END;
                    $$ LANGUAGE plpgsql;
                    `
                });
                
                if (createFunctionError) {
                    console.error('Error al crear la función:', createFunctionError);
                    return;
                }
                
                // Ejecutar la función para crear la tabla
                const { error: executeFunctionError } = await supabase.rpc('create_roles_permisos_table');
                
                if (executeFunctionError) {
                    console.error('Error al ejecutar la función para crear la tabla:', executeFunctionError);
                    return;
                }
            }
            
            console.log('Tabla roles_permisos creada exitosamente.');
            
            // Insertar permisos por defecto para el rol de administrador
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
            const { error: insertError } = await supabase
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
        } else {
            console.log('La tabla roles_permisos ya existe.');
        }
    } catch (error) {
        console.error('Error general al crear la tabla roles_permisos:', error);
    }
}

// Ejecutar la función principal
createRolesPermisosTable()
    .then(() => {
        console.log('Proceso completado.');
    })
    .catch(error => {
        console.error('Error en el proceso:', error);
    });