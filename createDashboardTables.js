// Script para crear las tablas necesarias para el dashboard
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente de Supabase con las credenciales del .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Faltan las credenciales de Supabase en el archivo .env');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Presente' : 'Ausente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Forzar el uso del token anon_key para Realtime (solución basada en la comunidad)
supabase.realtime.accessToken = supabaseAnonKey;

async function createDashboardTables() {
  console.log('Creando tablas necesarias para el dashboard...');

  try {
    // Crear tabla prospectos si no existe
    console.log('Verificando tabla prospectos...');
    const { count: prospectosCount, error: prospectosCountError } = await supabase
      .from('prospectos')
      .select('*', { count: 'exact', head: true });

    if (prospectosCountError && prospectosCountError.code === '42P01') {
      console.log('La tabla prospectos no existe. Creando tabla...');
      
      const { error: createProspectosError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS prospectos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre TEXT NOT NULL,
          email TEXT,
          telefono TEXT,
          estado TEXT DEFAULT 'NUEVO',
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (createProspectosError) {
        console.error('Error al crear la tabla prospectos:', createProspectosError);
      } else {
        console.log('Tabla prospectos creada exitosamente.');
        
        // Insertar datos de ejemplo
        const { error: insertProspectosError } = await supabase
          .from('prospectos')
          .insert([
            { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', telefono: '1234567890', estado: 'NUEVO' },
            { nombre: 'María García', email: 'maria@ejemplo.com', telefono: '0987654321', estado: 'CONTACTADO' },
            { nombre: 'Carlos López', email: 'carlos@ejemplo.com', telefono: '5555555555', estado: 'INTERESADO' }
          ]);
        
        if (insertProspectosError) {
          console.error('Error al insertar datos de ejemplo en prospectos:', insertProspectosError);
        } else {
          console.log('Datos de ejemplo insertados en prospectos.');
        }
      }
    } else {
      console.log('La tabla prospectos ya existe.');
    }

    // Crear tabla solicitudes si no existe
    console.log('Verificando tabla solicitudes...');
    const { count: solicitudesCount, error: solicitudesCountError } = await supabase
      .from('solicitudes')
      .select('*', { count: 'exact', head: true });

    if (solicitudesCountError && solicitudesCountError.code === '42P01') {
      console.log('La tabla solicitudes no existe. Creando tabla...');
      
      const { error: createSolicitudesError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS solicitudes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          prospecto_id UUID REFERENCES prospectos(id),
          estado TEXT DEFAULT 'CREADA',
          valor_credito NUMERIC DEFAULT 0,
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (createSolicitudesError) {
        console.error('Error al crear la tabla solicitudes:', createSolicitudesError);
      } else {
        console.log('Tabla solicitudes creada exitosamente.');
        
        // Obtener IDs de prospectos
        const { data: prospectos, error: getProspectosError } = await supabase
          .from('prospectos')
          .select('id');
        
        if (getProspectosError) {
          console.error('Error al obtener IDs de prospectos:', getProspectosError);
        } else if (prospectos && prospectos.length > 0) {
          // Insertar datos de ejemplo
          const solicitudesEjemplo = [
            { prospecto_id: prospectos[0].id, estado: 'APROBADA', valor_credito: 5000000 },
            { prospecto_id: prospectos[1].id, estado: 'RECHAZADA', valor_credito: 3000000 },
            { prospecto_id: prospectos[2].id, estado: 'CREADA', valor_credito: 8000000 }
          ];
          
          const { error: insertSolicitudesError } = await supabase
            .from('solicitudes')
            .insert(solicitudesEjemplo);
          
          if (insertSolicitudesError) {
            console.error('Error al insertar datos de ejemplo en solicitudes:', insertSolicitudesError);
          } else {
            console.log('Datos de ejemplo insertados en solicitudes.');
          }
        }
      }
    } else {
      console.log('La tabla solicitudes ya existe.');
    }

    console.log('Proceso completado exitosamente.');
  } catch (error) {
    console.error('Error durante la creación de tablas:', error);
  }
}

createDashboardTables();