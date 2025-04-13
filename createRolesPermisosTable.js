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
        // Intentar crear la tabla directamente usando SQL
        console.log('Intentando crear la tabla usando SQL directo...');
        
        // Ejecutar SQL para crear la tabla
        const { error: createTableError } = await supabase.rpc('execute_sql', {
            sql_query: `
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
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'roles_permisos_rol_id_key'
                ) THEN
                    ALTER TABLE roles_permisos ADD CONSTRAINT roles_permisos_rol_id_key UNIQUE (rol_id);
                END IF;
            END $$;
            `
        });
        
        if (createTableError) {
            console.error('Error al crear la tabla usando SQL directo:', createTableError);
            
            // Intentar un enfoque alternativo
            console.log('Intentando un enfoque alternativo...');
            
            // Verificar si la tabla existe
            const { error: checkError } = await supabase
                .from('roles_permisos')
                .select('count(*)', { count: 'exact', head: true });
            
            if (checkError) {
                console.log('La tabla no existe, intentando crearla...');
                
                // Crear la tabla usando la API de Supabase
                const { error: createError } = await supabase
                    .from('roles_permisos')
                    .insert([
                        {
                            rol_id: 'test',
                            permisos: {}
                        }
                    ]);
                
                if (createError && createError.code === '42P01') {
                    console.error('No se pudo crear la tabla automáticamente:', createError);
                    console.log('Por favor, crea la tabla manualmente en la interfaz de Supabase con la siguiente estructura:');
                    console.log(`
                    Tabla: roles_permisos
                    Columnas:
                    - id: uuid (primary key, default: uuid_generate_v4())
                    - rol_id: text (not null, unique)
                    - permisos: jsonb (not null, default: '{}')
                    - created_at: timestamptz (default: now())
                    - updated_at: timestamptz (default: now())
                    `);
                    return;
                }
            } else {
                console.log('La tabla roles_permisos ya existe.');
            }
        } else {
            console.log('Tabla roles_permisos creada exitosamente.');
        }
        
        // Verificar si la tabla existe ahora
        const { data, error: verifyError } = await supabase
            .from('roles_permisos')
            .select('count(*)', { count: 'exact', head: true });
        
        if (verifyError) {
            console.error('Error al verificar la existencia de la tabla:', verifyError);
            return;
        }
        
        // Insertar permisos por defecto para el rol de administrador
        console.log('Insertando permisos por defecto para el rol de administrador...');
        
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
        
        // Eliminar permisos existentes para el rol de administrador
        const { error: deleteError } = await supabase
            .from('roles_permisos')
            .delete()
            .eq('rol_id', 'admin');
        
        if (deleteError) {
            console.error('Error al eliminar permisos existentes:', deleteError);
        }
        
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