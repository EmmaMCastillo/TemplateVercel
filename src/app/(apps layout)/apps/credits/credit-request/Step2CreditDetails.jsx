'use client'
import { Form, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';

const Step2CreditDetails = ({ formData, handleChange, formatCurrency, updateSliderValue }) => {
    // Actualizar los valores de los sliders al cargar el componente
    useEffect(() => {
        updateSliderValue(formData.monto, 'monto-value');
        updateSliderValue(formData.plazo, 'plazo-value', ' meses');
    }, []);

    return (
        <Form>
            <div className="mb-4">
                <h6 className="mb-3">Información del Crédito</h6>
                <Form.Group className="mb-4">
                    <Form.Label>Monto del Crédito (USD) *</Form.Label>
                    <div className="mb-3">
                        <div className="text-center mb-2">
                            <span id="monto-value" className="fs-3 fw-bold text-primary">{formatCurrency(formData.monto)}</span>
                        </div>
                        <Form.Range 
                            name="monto" 
                            min="5000" 
                            max="50000" 
                            step="1000"
                            value={formData.monto} 
                            onChange={(e) => {
                                handleChange(e);
                                updateSliderValue(e.target.value, 'monto-value');
                            }} 
                        />
                        <div className="d-flex justify-content-between">
                            <small>$5,000</small>
                            <small>$50,000</small>
                        </div>
                    </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                    <Form.Label>Plazo (meses) *</Form.Label>
                    <div className="mb-3">
                        <div className="text-center mb-2">
                            <span id="plazo-value" className="fs-3 fw-bold text-primary">{formData.plazo} meses</span>
                        </div>
                        <Form.Range 
                            name="plazo" 
                            min="6" 
                            max="60" 
                            step="6"
                            value={formData.plazo} 
                            onChange={(e) => {
                                handleChange(e);
                                updateSliderValue(e.target.value, 'plazo-value', ' meses');
                            }} 
                        />
                        <div className="d-flex justify-content-between">
                            <small>6 meses</small>
                            <small>60 meses</small>
                        </div>
                    </div>
                </Form.Group>
                
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Propósito del Crédito *</Form.Label>
                            <Form.Select 
                                name="proposito" 
                                value={formData.proposito} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="personal">Personal</option>
                                <option value="negocio">Negocio</option>
                                <option value="vivienda">Vivienda</option>
                                <option value="vehiculo">Vehículo</option>
                                <option value="educacion">Educación</option>
                                <option value="otro">Otro</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group id="otro-proposito-container" style={{ display: formData.proposito === 'otro' ? 'block' : 'none' }}>
                            <Form.Label>Especifique el propósito *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="otro_proposito" 
                                value={formData.otro_proposito} 
                                onChange={handleChange} 
                                placeholder="Describa el propósito del crédito" 
                                required={formData.proposito === 'otro'}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            
            <div className="mb-4">
                <h6 className="mb-3">Información Financiera</h6>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Ingresos Mensuales (USD) *</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="ingresos" 
                                value={formData.ingresos} 
                                onChange={handleChange} 
                                placeholder="Ingrese monto" 
                                required 
                                min="0"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Gastos Mensuales (USD) *</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="gastos" 
                                value={formData.gastos} 
                                onChange={handleChange} 
                                placeholder="Ingrese monto" 
                                required 
                                min="0"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Situación Laboral *</Form.Label>
                            <Form.Select 
                                name="empleo" 
                                value={formData.empleo} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="empleado">Empleado tiempo completo</option>
                                <option value="autonomo">Autónomo/Independiente</option>
                                <option value="temporal">Empleado temporal</option>
                                <option value="pensionado">Pensionado/Jubilado</option>
                                <option value="otro">Otro</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Antigüedad Laboral (años) *</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="antiguedad" 
                                value={formData.antiguedad} 
                                onChange={handleChange} 
                                placeholder="Ejemplo: 3" 
                                required 
                                min="0"
                                step="0.5"
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </div>

            {/* Información de cuota estimada */}
            {formData.monto > 0 && formData.plazo > 0 && (
                <div className="bg-light p-3 rounded mb-4">
                    <h6 className="mb-3">Cuota Mensual Estimada</h6>
                    <div className="text-center">
                        <span className="fs-3 fw-bold text-primary">
                            {formatCurrency(formData.monto / formData.plazo * 1.1)}
                        </span>
                        <p className="text-muted mb-0 mt-2">
                            *Esta es una estimación basada en una tasa de interés del 10%. 
                            La tasa final puede variar según la evaluación crediticia.
                        </p>
                    </div>
                </div>
            )}
        </Form>
    );
};

export default Step2CreditDetails;