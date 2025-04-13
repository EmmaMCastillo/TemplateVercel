-- Crear la tabla roles_permisos
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

-- Insertar permisos por defecto para el rol de administrador
INSERT INTO roles_permisos (rol_id, permisos)
VALUES (
    'admin',
    '{
        "dashboard": {"access": "admin"},
        "dashboard_ver_estadisticas": {"access": "admin"},
        "dashboard_ver_graficos": {"access": "admin"},
        
        "prospectos": {"access": "admin"},
        "prospectos_ver_prospectos": {"access": "admin"},
        "prospectos_crear_prospecto": {"access": "admin"},
        "prospectos_editar_prospecto": {"access": "admin"},
        "prospectos_eliminar_prospecto": {"access": "admin"},
        "prospectos_exportar_prospectos": {"access": "admin"},
        
        "solicitudes": {"access": "admin"},
        "solicitudes_ver_solicitudes": {"access": "admin"},
        "solicitudes_crear_solicitud": {"access": "admin"},
        "solicitudes_editar_solicitud": {"access": "admin"},
        "solicitudes_gestionar_documentos": {"access": "admin"},
        "solicitudes_subir_documentos": {"access": "admin"},
        "solicitudes_desembolso": {"access": "admin"},
        
        "bancos": {"access": "admin"},
        "bancos_ver_bancos": {"access": "admin"},
        "bancos_crear_banco": {"access": "admin"},
        "bancos_editar_banco": {"access": "admin"},
        
        "usuarios": {"access": "admin"},
        "usuarios_ver_usuarios": {"access": "admin"},
        "usuarios_crear_usuario": {"access": "admin"},
        "usuarios_editar_usuario": {"access": "admin"},
        "usuarios_gestionar_permisos": {"access": "admin"}
    }'::jsonb
)
ON CONFLICT (rol_id) 
DO UPDATE SET 
    permisos = EXCLUDED.permisos,
    updated_at = NOW();

-- Insertar permisos por defecto para el rol de ejecutivo
INSERT INTO roles_permisos (rol_id, permisos)
VALUES (
    'ejecutivo',
    '{
        "dashboard": {"access": "read"},
        "dashboard_ver_estadisticas": {"access": "read"},
        "dashboard_ver_graficos": {"access": "read"},
        
        "prospectos": {"access": "write"},
        "prospectos_ver_prospectos": {"access": "read"},
        "prospectos_crear_prospecto": {"access": "write"},
        "prospectos_editar_prospecto": {"access": "write"},
        "prospectos_eliminar_prospecto": {"access": "no_access"},
        "prospectos_exportar_prospectos": {"access": "read"},
        
        "solicitudes": {"access": "write"},
        "solicitudes_ver_solicitudes": {"access": "read"},
        "solicitudes_crear_solicitud": {"access": "write"},
        "solicitudes_editar_solicitud": {"access": "write"},
        "solicitudes_gestionar_documentos": {"access": "write"},
        "solicitudes_subir_documentos": {"access": "write"},
        "solicitudes_desembolso": {"access": "no_access"},
        
        "bancos": {"access": "read"},
        "bancos_ver_bancos": {"access": "read"},
        "bancos_crear_banco": {"access": "no_access"},
        "bancos_editar_banco": {"access": "no_access"},
        
        "usuarios": {"access": "no_access"},
        "usuarios_ver_usuarios": {"access": "no_access"},
        "usuarios_crear_usuario": {"access": "no_access"},
        "usuarios_editar_usuario": {"access": "no_access"},
        "usuarios_gestionar_permisos": {"access": "no_access"}
    }'::jsonb
)
ON CONFLICT (rol_id) 
DO UPDATE SET 
    permisos = EXCLUDED.permisos,
    updated_at = NOW();