'use client';
import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { LogOut } from 'react-feather';
import { useAuth } from '@/context/AuthContext';

const LogoutButton = ({ variant = "outline-danger", className = "", showIcon = true, showText = true }) => {
    const [loading, setLoading] = useState(false);
    const { signOut } = useAuth();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            className={className}
            onClick={handleLogout}
            disabled={loading}
        >
            {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
                <span className="d-flex align-items-center">
                    {showIcon && (
                        <span className="feather-icon me-2">
                            <LogOut size={16} />
                        </span>
                    )}
                    {showText && <span>Cerrar sesión</span>}
                </span>
            )}
        </Button>
    );
};

export default LogoutButton;