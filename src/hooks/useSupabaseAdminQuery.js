import { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '@/utils/supabase';

export function useSupabaseAdminQuery(options = {}) {
  const {
    timeout = 10000,
    retries = 2,
    initialFetch = true
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    let retry = 0;
    let timeoutId;

    const attempt = async () => {
      setLoading(true);
      setError(null);

      try {
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Timeout de consulta')), timeout);
        });

        const { data, error: queryError } = await Promise.race([
          supabaseAdmin.auth.admin.listUsers(),
          timeoutPromise,
        ]);

        if (timeoutId) clearTimeout(timeoutId);
        if (queryError) throw queryError;

        setData(data?.users || []);
        return data?.users || [];
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);

        if (retry < retries) {
          retry++;
          console.log(`Reintentando consulta (${retry}/${retries})...`);
          return await attempt();
        }

        setError(err.message || 'Error al cargar usuarios');
        setData([]);
        return null;
      } finally {
        setLoading(false);
      }
    };

    return await attempt();
  }, [retries, timeout]);

  useEffect(() => {
    if (initialFetch) fetchUsers();
  }, [fetchUsers, initialFetch]);

  return { users: data, loading, error, refetch: fetchUsers };
}