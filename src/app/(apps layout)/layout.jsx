'use client';
import MainLayout from '@/layout/apps-layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from 'react-bootstrap';

const AppsLayout = ({ children }) => {
    const { loading } = useAuth();

    // Mostrar spinner mientras se carga el estado de autenticación
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <MainLayout>
                {children}
            </MainLayout>
        </ProtectedRoute>
    );
};

export default AppsLayout;
