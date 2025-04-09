'use client'
import { Button } from 'react-bootstrap';
import { Check } from 'react-feather';

const Step5Confirmation = ({ handleFinish }) => {
    // Generar un número de referencia aleatorio
    const referenceNumber = `REF-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    return (
        <div className="text-center py-5">
            <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success text-white mb-4" style={{ width: '80px', height: '80px' }}>
                <Check size={40} />
            </div>
            
            <h4 className="mb-3">¡Solicitud Enviada con Éxito!</h4>
            
            <p className="text-muted mb-4">
                Su solicitud de crédito ha sido recibida y está siendo procesada. 
                Recibirá una notificación por correo electrónico con actualizaciones sobre el estado de su solicitud.
            </p>
            
            <div className="bg-light p-4 rounded mb-4 d-inline-block">
                <p className="mb-1">Número de referencia:</p>
                <h5 className="text-primary">{referenceNumber}</h5>
            </div>
            
            <div className="mt-4">
                <p className="text-muted mb-4">
                    Guarde este número de referencia para consultas futuras. 
                    Nuestro equipo revisará su solicitud y se pondrá en contacto con usted en un plazo de 24-48 horas hábiles.
                </p>
                
                <Button variant="primary" size="lg" onClick={handleFinish} className="px-5">
                    Volver a Créditos
                </Button>
            </div>
        </div>
    );
};

export default Step5Confirmation;