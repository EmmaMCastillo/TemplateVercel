'use client'
import { Form, Alert } from 'react-bootstrap';
import { Upload, FileText, DollarSign, CreditCard } from 'react-feather';

const Step3Documentation = ({ formData, handleChange }) => {
    // Función para manejar el arrastre y soltar archivos
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-primary', 'bg-primary-light');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-primary', 'bg-primary-light');
    };

    const handleDrop = (e, fieldName) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-primary', 'bg-primary-light');
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Crear un evento sintético para pasar a handleChange
            const event = {
                target: {
                    name: fieldName,
                    type: 'file',
                    files: e.dataTransfer.files
                }
            };
            handleChange(event);
        }
    };

    return (
        <Form>
            <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center">
                    <FileText size={18} className="me-2 text-primary" />
                    Documentos de Identidad
                </h6>
                <div 
                    className="border border-dashed rounded p-4 text-center mb-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'documento_identidad')}
                >
                    <Upload size={48} className="text-primary mb-3" />
                    <p className="mb-2">Arrastre y suelte su documento de identidad aquí, o</p>
                    <Form.Group>
                        <Form.Label className="btn btn-outline-primary">
                            Seleccionar archivo
                            <Form.Control 
                                type="file" 
                                name="documento_identidad" 
                                onChange={handleChange} 
                                className="d-none" 
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </Form.Label>
                    </Form.Group>
                    {formData.documento_identidad && (
                        <Alert variant="success" className="mt-2 d-flex align-items-center">
                            <FileText size={18} className="me-2" />
                            <div>
                                <strong>Archivo seleccionado:</strong> {formData.documento_identidad.name}
                            </div>
                        </Alert>
                    )}
                    <small className="d-block text-muted mt-2">Formatos aceptados: PDF, JPG, PNG (máximo 5MB)</small>
                </div>
            </div>
            
            <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center">
                    <DollarSign size={18} className="me-2 text-primary" />
                    Comprobante de Ingresos
                </h6>
                <div 
                    className="border border-dashed rounded p-4 text-center mb-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'comprobante_ingresos')}
                >
                    <Upload size={48} className="text-primary mb-3" />
                    <p className="mb-2">Arrastre y suelte su comprobante de ingresos aquí, o</p>
                    <Form.Group>
                        <Form.Label className="btn btn-outline-primary">
                            Seleccionar archivo
                            <Form.Control 
                                type="file" 
                                name="comprobante_ingresos" 
                                onChange={handleChange} 
                                className="d-none" 
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </Form.Label>
                    </Form.Group>
                    {formData.comprobante_ingresos && (
                        <Alert variant="success" className="mt-2 d-flex align-items-center">
                            <FileText size={18} className="me-2" />
                            <div>
                                <strong>Archivo seleccionado:</strong> {formData.comprobante_ingresos.name}
                            </div>
                        </Alert>
                    )}
                    <small className="d-block text-muted mt-2">Formatos aceptados: PDF, JPG, PNG (máximo 5MB)</small>
                </div>
            </div>
            
            <div className="mb-4">
                <h6 className="mb-3 d-flex align-items-center">
                    <CreditCard size={18} className="me-2 text-primary" />
                    Extractos Bancarios (últimos 3 meses)
                </h6>
                <div 
                    className="border border-dashed rounded p-4 text-center mb-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'extractos_bancarios')}
                >
                    <Upload size={48} className="text-primary mb-3" />
                    <p className="mb-2">Arrastre y suelte sus extractos bancarios aquí, o</p>
                    <Form.Group>
                        <Form.Label className="btn btn-outline-primary">
                            Seleccionar archivo
                            <Form.Control 
                                type="file" 
                                name="extractos_bancarios" 
                                onChange={handleChange} 
                                className="d-none" 
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </Form.Label>
                    </Form.Group>
                    {formData.extractos_bancarios && (
                        <Alert variant="success" className="mt-2 d-flex align-items-center">
                            <FileText size={18} className="me-2" />
                            <div>
                                <strong>Archivo seleccionado:</strong> {formData.extractos_bancarios.name}
                            </div>
                        </Alert>
                    )}
                    <small className="d-block text-muted mt-2">Formatos aceptados: PDF, JPG, PNG (máximo 5MB)</small>
                </div>
            </div>
        </Form>
    );
};

export default Step3Documentation;