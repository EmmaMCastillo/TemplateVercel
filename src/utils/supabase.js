import { createClient } from '@supabase/supabase-js';

// URL y claves de Supabase hardcodeadas (temporal)
const supabaseUrl = 'https://ljkqmizvyhlsfiqmpubr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE4NzEsImV4cCI6MjA1OTIyNzg3MX0.P25CoZR3XGsXv0I3E_QMbFsTO-GmJoLsZfxblADhTRs';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa3FtaXp2eWhsc2ZpcW1wdWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzY1MTg3MSwiZXhwIjoyMDU5MjI3ODcxfQ.DpOblFmGSBjQzsyiH9QvESlnsavFi3F29YUZOOnrEu8';

// Opciones de configuración para el cliente de Supabase
const supabaseOptions = {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  }
};

// Cliente principal (anónimo) - Este es el que se debe usar en la mayoría de los casos
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Cliente con clave de servicio (solo para operaciones administrativas)
// IMPORTANTE: Este cliente solo debe usarse en el servidor o en operaciones específicas
// que requieran privilegios administrativos
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);