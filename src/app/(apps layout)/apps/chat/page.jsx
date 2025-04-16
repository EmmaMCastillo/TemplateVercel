'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página de redirección para el módulo de chat
 * Redirige automáticamente a la página de chats
 */
const ChatRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de chats
    router.push('/apps/chat/chats');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
};

export default ChatRedirect;