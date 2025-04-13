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
      // Esperar a que se cargue el estado de autenticación
      if (loading) return;

      // Si no hay usuario, redirigir al login
      if (!user) {
        router.push('/auth/login/classic');
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
        // Redirigir a una página de acceso denegado o al dashboard
        router.push('/');
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    checkAuth();
  }, [user, loading, router, requiredModule, requiredAction, requiredLevel, hasPermission]);

  // Mostrar spinner mientras se verifica la autenticación
  if (loading || checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  // Renderizar los hijos solo si está autorizado
  return authorized ? children : null;
};

export default ProtectedRoute;