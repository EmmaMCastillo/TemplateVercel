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