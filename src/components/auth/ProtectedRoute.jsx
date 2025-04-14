'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ 
  children, 
  requiredModule = null, 
  requiredAction = null, 
  requiredLevel = 'read' 
}) => {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Esperar a que se cargue el estado de autenticación
        if (loading) return;

        // Si no hay usuario, redirigir al login
        if (!user) {
          console.log('No hay usuario autenticado, redirigiendo al login');
          
          // Establecer un timeout para evitar redirecciones infinitas
          setTimeout(() => {
            router.push('/auth/login/classic');
          }, 100);
          return;
        }

        // Si no se requiere un módulo específico, solo verificar autenticación
        if (!requiredModule) {
          setAuthorized(true);
          setChecking(false);
          return;
        }

        // Verificar permisos específicos
        const hasAccess = await hasPermission(requiredModule, requiredAction, requiredLevel);
        
        if (!hasAccess) {
          console.log('Usuario no tiene permisos para acceder a este módulo');
          // Redirigir a una página de acceso denegado o al dashboard
          router.push('/');
          return;
        }

        setAuthorized(true);
        setChecking(false);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // En caso de error, redirigir al login
        router.push('/auth/login/classic');
      }
    };

    // Establecer un timeout para evitar problemas de carrera
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, loading, router, requiredModule, requiredAction, requiredLevel, hasPermission]);

  // Mostrar spinner mientras se verifica la autenticación
  if (loading || checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" className="mb-2">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Renderizar los hijos solo si está autorizado
  return authorized ? children : null;
};

export default ProtectedRoute;