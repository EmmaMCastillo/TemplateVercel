import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { sendWhatsAppMessage } from '@/services/whatsapp/sendMessage';
import { useGlobalStateContext } from '@/context/GolobalStateProvider';

/**
 * Hook personalizado para integrar WhatsApp con el chat existente
 * Siguiendo las buenas prácticas del README.md, este hook encapsula
 * toda la lógica de integración con WhatsApp
 * 
 * @returns {Object} - Funciones y estado para la integración
 */
export function useWhatsAppIntegration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { states, dispatch } = useGlobalStateContext();
  
  // Suscribirse a nuevos mensajes de WhatsApp
  useEffect(() => {
    const subscription = supabase
      .channel('whatsapp_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'whatsapp_messages'
      }, (payload) => {
        const newMsg = payload.new;
        
        // Solo procesar mensajes recibidos (no los enviados por nosotros)
        if (newMsg.status === 'received') {
          // Formatear el mensaje para el chat
          const formattedMsg = {
            text: newMsg.text,
            time: new Date(newMsg.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            types: 'received'
          };
          
          // Actualizar el estado global
          dispatch({ type: 'send_msg', msg: formattedMsg });
          
          // Actualizar el usuario actual si es necesario
          dispatch({
            type: 'set_user',
            userId: newMsg.from_number,
            userName: newMsg.sender_name || `WhatsApp (${newMsg.from_number})`,
            status: 'WhatsApp',
            avatar: {
              type: 'init',
              title: (newMsg.sender_name || 'W').charAt(0),
              variant: 'success'
            }
          });
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);
  
  // Función para enviar un mensaje a través de WhatsApp
  const sendMessageToWhatsApp = useCallback(async (text) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el número de teléfono del usuario actual
      const phoneNumber = states.chatState.userId;
      
      if (!phoneNumber || !text) {
        throw new Error('Número de teléfono o mensaje no válido');
      }
      
      // Enviar el mensaje a través de WhatsApp
      const result = await sendWhatsAppMessage({
        to: phoneNumber,
        message: text
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error al enviar mensaje de WhatsApp:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [states.chatState.userId]);
  
  // Función para verificar si un usuario es un contacto de WhatsApp
  const isWhatsAppContact = useCallback((userId) => {
    // Verificar si el ID de usuario tiene formato de número de teléfono
    return /^\+?\d+$/.test(userId);
  }, []);
  
  return {
    loading,
    error,
    sendMessageToWhatsApp,
    isWhatsAppContact
  };
}