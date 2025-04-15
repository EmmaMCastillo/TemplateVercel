'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// Crear contexto de autenticación

// Crear contexto de autenticación
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay una sesión activa
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Error al verificar sesión:', error);
                    setUser(null);
                } else if (session) {
                    // Obtener datos del usuario
                    const { data: userData, error: userError } = await supabase.auth.getUser();
                    
                    if (userError) {
                        console.error('Error al obtener datos del usuario:', userError);
                        setUser(null);
                    } else {
                        setUser(userData.user);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Error general al verificar sesión:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkSession();
        
        // Suscribirse a cambios en la autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Evento de autenticación:', event);
            
            if (session) {
                const { data: userData } = await supabase.auth.getUser();
                setUser(userData.user);
            } else {
                setUser(null);
            }
            
            setLoading(false);
        });
        
        // Limpiar suscripción al desmontar
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Función para iniciar sesión
    const signIn = async (email, password, keepSession = true) => {
        try {
            // Configurar opciones de persistencia según la elección del usuario
            const options = {
                emailRedirectTo: `${window.location.origin}/`,
            };

            // Limpiar cualquier sesión anterior que pueda estar causando problemas
            await supabase.auth.signOut();
            
            // Iniciar sesión con las opciones configuradas
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: options
            });
            
            if (error) {
                throw error;
            }
            
            console.log('Inicio de sesión exitoso:', data);
            
            return { success: true, data };
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            return { success: false, error: err.message };
        }
    };

    // Función para cerrar sesión
    const signOut = async () => {
        try {
            // Limpiar completamente la sesión
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                throw error;
            }
            
            // Limpiar cualquier dato de sesión que pueda haber quedado en localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('supabase.auth.token');
                localStorage.removeItem('supabase.auth.refreshToken');
                
                // Limpiar cualquier otro dato de sesión que pueda estar causando problemas
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('supabase.auth.')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            
            router.push('/auth/login/classic');
            return { success: true };
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            return { success: false, error: err.message };
        }
    };

    // Función para restablecer contraseña
    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });
            
            if (error) {
                throw error;
            }
            
            return { success: true };
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            return { success: false, error: err.message };
        }
    };

    // Función para actualizar contraseña
    const updatePassword = async (password) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });
            
            if (error) {
                throw error;
            }
            
            return { success: true };
        } catch (err) {
            console.error('Error al actualizar contraseña:', err);
            return { success: false, error: err.message };
        }
    };

    // Función para verificar si el usuario tiene un permiso específico
    const hasPermission = async (moduleId, actionId = null, requiredLevel = 'read') => {
        if (!user) return false;
        
        try {
            const rol = user.user_metadata?.rol || 'usuario';
            
            // Obtener permisos del rol del usuario
            const { data, error } = await supabase
                .from('roles_permisos')
                .select('permisos')
                .eq('rol_id', rol)
                .single();
            
            if (error || !data) {
                console.error('Error al obtener permisos:', error);
                return false;
            }
            
            const permisos = data.permisos;
            
            // Si es administrador, tiene todos los permisos
            if (rol === 'admin') {
                return true;
            }
            
            // Verificar permiso específico
            const permissionKey = actionId ? `${moduleId}_${actionId}` : moduleId;
            const permission = permisos[permissionKey];
            
            if (!permission) {
                return false;
            }
            
            // Verificar nivel de acceso
            const accessLevels = {
                'no_access': 0,
                'read': 1,
                'write': 2,
                'admin': 3
            };
            
            return accessLevels[permission.access] >= accessLevels[requiredLevel];
        } catch (err) {
            console.error('Error al verificar permisos:', err);
            return false;
        }
    };

    const value = {
        user,
        loading,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        hasPermission
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}