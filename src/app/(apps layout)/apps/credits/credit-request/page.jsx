'use client'
import { useState } from 'react';
import { Button, Card, ProgressBar } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Info, X, Check } from 'react-feather';
import classNames from 'classnames';

// Importar componentes de layout
import CreditAppSidebar from '../credit-list/CreditAppSidebar';
import CreditRequestHeader from './CreditRequestHeader';

// Importar componentes de cada paso
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2CreditDetails from './Step2CreditDetails';
import Step3Documentation from './Step3Documentation';
import Step4Review from './Step4Review';
import Step5Confirmation from './Step5Confirmation';

// Componente principal para el flujo de solicitud de crédito
const CreditRequest = () => {
    const router = useRouter();
    const [showSidebar, setShowSidebar] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Datos personales
        nombre: '',
        apellido: '',
        documento: '',
        numero_documento: '',
        fecha_nacimiento: '',
        nacionalidad: '',
        
        // Información de contacto
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigo_postal: '',
        provincia: '',
        pais: '',
        
        // Información del crédito
        monto: 15000,
        plazo: 24,
        proposito: '',
        otro_proposito: '',
        
        // Información financiera
        ingresos: '',
        gastos: '',
        empleo: '',
        antiguedad: '',
        
        // Documentos
        documento_identidad: null,
        comprobante_ingresos: null,
        extractos_bancarios: null,
        
        // Términos y condiciones
        acepto_terminos: false
    });

    // Función para manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else if (type === 'range') {
            setFormData({ ...formData, [name]: parseInt(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        // Mostrar/ocultar campo de otro propósito
        if (name === 'proposito' && value === 'otro') {
            const element = document.getElementById('otro-proposito-container');
            if (element) element.style.display = 'block';
        } else if (name === 'proposito' && value !== 'otro') {
            const element = document.getElementById('otro-proposito-container');
            if (element) element.style.display = 'none';
        }
    };

    // Función para formatear valores de moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Función para actualizar el valor del slider
    const updateSliderValue = (value, elementId, suffix = '') => {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId === 'monto-value') {
                element.textContent = formatCurrency(value);
            } else {
                element.textContent = value + suffix;
            }
        }
    };

    // Función para ir al paso anterior
    const goToPreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            // Scroll al inicio del formulario
            window.scrollTo(0, 0);
        }
    };

    // Función para ir al paso siguiente
    const goToNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
            // Scroll al inicio del formulario
            window.scrollTo(0, 0);
        }
    };

    // Función para cancelar la solicitud
    const handleCancel = () => {
        if (confirm('¿Está seguro que desea cancelar la solicitud? Se perderán todos los datos ingresados.')) {
            router.push('/apps/credits/credit-list');
        }
    };

    // Función para enviar la solicitud
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        // Aquí se implementaría la lógica para enviar los datos al servidor
        // Por ahora, simplemente avanzamos al paso de confirmación
        setCurrentStep(5);
        // Scroll al inicio del formulario
        window.scrollTo(0, 0);
    };

    // Función para finalizar y volver a la lista de créditos
    const handleFinish = () => {
        router.push('/apps/credits/credit-list');
    };

    // Función para cambiar directamente a un paso específico
    const goToStep = (step) => {
        if (step >= 1 && step <= 5) {
            setCurrentStep(step);
            // Scroll al inicio del formulario
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("invoiceapp-wrap", { "invoiceapp-sidebar-toggle": !showSidebar })} >
                <CreditAppSidebar />
                <div className="invoiceapp-content">
                    <div className="invoiceapp-detail-wrap">
                        <CreditRequestHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        
                        <div className="invoice-body">
                            <div className="container-fluid">
                                <div className="row justify-content-center">
                                    <div className="col-xl-10">
                                        <Card className="card-border mb-0 h-100">
                                            <Card.Body className="p-md-5 p-3">
                                                {/* Barra de progreso */}
                                                <div className="mb-5">
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div 
                                                            className={`text-center ${currentStep >= 1 ? 'text-primary fw-bold' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => currentStep > 1 && goToStep(1)}
                                                        >
                                                            <div className={`d-inline-flex justify-content-center align-items-center rounded-circle ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                                                                {currentStep > 1 ? <Check size={16} /> : 1}
                                                            </div>
                                                            <div className="mt-1">Información del Cliente</div>
                                                        </div>
                                                        <div 
                                                            className={`text-center ${currentStep >= 2 ? 'text-primary fw-bold' : ''}`}
                                                            style={{ cursor: currentStep > 1 ? 'pointer' : 'default' }}
                                                            onClick={() => currentStep > 2 && goToStep(2)}
                                                        >
                                                            <div className={`d-inline-flex justify-content-center align-items-center rounded-circle ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                                                                {currentStep > 2 ? <Check size={16} /> : 2}
                                                            </div>
                                                            <div className="mt-1">Detalles del Crédito</div>
                                                        </div>
                                                        <div 
                                                            className={`text-center ${currentStep >= 3 ? 'text-primary fw-bold' : ''}`}
                                                            style={{ cursor: currentStep > 2 ? 'pointer' : 'default' }}
                                                            onClick={() => currentStep > 3 && goToStep(3)}
                                                        >
                                                            <div className={`d-inline-flex justify-content-center align-items-center rounded-circle ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                                                                {currentStep > 3 ? <Check size={16} /> : 3}
                                                            </div>
                                                            <div className="mt-1">Documentación</div>
                                                        </div>
                                                        <div 
                                                            className={`text-center ${currentStep >= 4 ? 'text-primary fw-bold' : ''}`}
                                                            style={{ cursor: currentStep > 3 ? 'pointer' : 'default' }}
                                                            onClick={() => currentStep > 4 && goToStep(4)}
                                                        >
                                                            <div className={`d-inline-flex justify-content-center align-items-center rounded-circle ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                                                                {currentStep > 4 ? <Check size={16} /> : 4}
                                                            </div>
                                                            <div className="mt-1">Revisión</div>
                                                        </div>
                                                    </div>
                                                    <ProgressBar now={(currentStep - 1) * 25} className="mb-3" />
                                                </div>

                                                {/* Alerta informativa */}
                                                {currentStep < 5 && (
                                                    <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                                                        <Info size={20} className="me-2" />
                                                        <div>
                                                            {currentStep === 1 && 'Complete la información personal del solicitante. Todos los campos marcados con * son obligatorios.'}
                                                            {currentStep === 2 && 'Especifique los detalles del crédito solicitado, incluyendo el monto, plazo y propósito.'}
                                                            {currentStep === 3 && 'Por favor, adjunte los documentos requeridos para procesar su solicitud de crédito. Formatos aceptados: PDF, JPG, PNG (máximo 5MB por archivo).'}
                                                            {currentStep === 4 && 'Revise cuidadosamente la información proporcionada antes de enviar la solicitud.'}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="form-content" style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto', marginBottom: '20px' }}>
                                                    {/* Renderizar el paso actual */}
                                                    {currentStep === 1 && (
                                                        <Step1PersonalInfo 
                                                            formData={formData} 
                                                            handleChange={handleChange} 
                                                        />
                                                    )}

                                                    {currentStep === 2 && (
                                                        <Step2CreditDetails 
                                                            formData={formData} 
                                                            handleChange={handleChange} 
                                                            formatCurrency={formatCurrency}
                                                            updateSliderValue={updateSliderValue}
                                                        />
                                                    )}

                                                    {currentStep === 3 && (
                                                        <Step3Documentation 
                                                            formData={formData} 
                                                            handleChange={handleChange} 
                                                        />
                                                    )}

                                                    {currentStep === 4 && (
                                                        <Step4Review 
                                                            formData={formData} 
                                                            handleChange={handleChange}
                                                            handleSubmit={handleSubmit} 
                                                            formatCurrency={formatCurrency}
                                                        />
                                                    )}

                                                    {currentStep === 5 && (
                                                        <Step5Confirmation 
                                                            handleFinish={handleFinish} 
                                                        />
                                                    )}
                                                </div>

                                                {/* Botones de navegación - Siempre visibles */}
                                                {currentStep < 5 && (
                                                    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                                        {currentStep > 1 ? (
                                                            <Button variant="outline-secondary" onClick={goToPreviousStep}>
                                                                <ChevronLeft size={16} className="me-1" />
                                                                Anterior
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outline-danger" onClick={handleCancel}>
                                                                <X size={16} className="me-1" />
                                                                Cancelar
                                                            </Button>
                                                        )}
                                                        
                                                        {currentStep < 4 ? (
                                                            <Button variant="primary" onClick={goToNextStep}>
                                                                Siguiente
                                                                <ChevronRight size={16} className="ms-1" />
                                                            </Button>
                                                        ) : currentStep === 4 && (
                                                            <Button 
                                                                variant="success" 
                                                                onClick={handleSubmit}
                                                                disabled={!formData.acepto_terminos}
                                                            >
                                                                Enviar Solicitud
                                                                <Check size={16} className="ms-1" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditRequest;
