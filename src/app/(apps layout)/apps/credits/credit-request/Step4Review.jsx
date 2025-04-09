'use client'
import { Form, Card, Row, Col } from 'react-bootstrap';

const Step4Review = ({ formData, handleChange, handleSubmit, formatCurrency }) => {
    return (
        <Form onSubmit={handleSubmit}>
            <div className="mb-4">
                <h6 className="mb-3">Resumen de la Solicitud</h6>
                <Card className="mb-4">
                    <Card.Header className="bg-light">
                        <h6 className="mb-0 text-primary">Datos Personales</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Nombre completo</div>
                                <div className="fw-medium">{formData.nombre} {formData.apellido}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Documento</div>
                                <div className="fw-medium">
                                    {formData.documento === 'dni' && 'DNI'}
                                    {formData.documento === 'nie' && 'NIE'}
                                    {formData.documento === 'pasaporte' && 'Pasaporte'}: {formData.numero_documento}
                                </div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Fecha de nacimiento</div>
                                <div className="fw-medium">{formData.fecha_nacimiento}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Nacionalidad</div>
                                <div className="fw-medium">{formData.nacionalidad}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header className="bg-light">
                        <h6 className="mb-0 text-primary">Información de Contacto</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Correo electrónico</div>
                                <div className="fw-medium">{formData.email}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Teléfono</div>
                                <div className="fw-medium">{formData.telefono}</div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <div className="text-muted">Dirección</div>
                                <div className="fw-medium">{formData.direccion}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Ciudad</div>
                                <div className="fw-medium">{formData.ciudad}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Código Postal</div>
                                <div className="fw-medium">{formData.codigo_postal}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Provincia</div>
                                <div className="fw-medium">{formData.provincia}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">País</div>
                                <div className="fw-medium">
                                    {formData.pais === 'es' && 'España'}
                                    {formData.pais === 'mx' && 'México'}
                                    {formData.pais === 'co' && 'Colombia'}
                                    {formData.pais === 'ar' && 'Argentina'}
                                    {formData.pais === 'cl' && 'Chile'}
                                    {formData.pais === 'pe' && 'Perú'}
                                    {formData.pais === 'otro' && 'Otro'}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header className="bg-light">
                        <h6 className="mb-0 text-primary">Detalles del Crédito</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Monto solicitado</div>
                                <div className="fw-medium">{formatCurrency(formData.monto)}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Plazo</div>
                                <div className="fw-medium">{formData.plazo} meses</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Propósito</div>
                                <div className="fw-medium">
                                    {formData.proposito === 'personal' && 'Personal'}
                                    {formData.proposito === 'negocio' && 'Negocio'}
                                    {formData.proposito === 'vivienda' && 'Vivienda'}
                                    {formData.proposito === 'vehiculo' && 'Vehículo'}
                                    {formData.proposito === 'educacion' && 'Educación'}
                                    {formData.proposito === 'otro' && `Otro: ${formData.otro_proposito}`}
                                </div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Situación laboral</div>
                                <div className="fw-medium">
                                    {formData.empleo === 'empleado' && 'Empleado tiempo completo'}
                                    {formData.empleo === 'autonomo' && 'Autónomo/Independiente'}
                                    {formData.empleo === 'temporal' && 'Empleado temporal'}
                                    {formData.empleo === 'pensionado' && 'Pensionado/Jubilado'}
                                    {formData.empleo === 'otro' && 'Otro'}
                                </div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Ingresos mensuales</div>
                                <div className="fw-medium">{formData.ingresos ? formatCurrency(formData.ingresos) : '-'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="text-muted">Gastos mensuales</div>
                                <div className="fw-medium">{formData.gastos ? formatCurrency(formData.gastos) : '-'}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header className="bg-light">
                        <h6 className="mb-0 text-primary">Documentación</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={12} className="mb-3">
                                <div className="text-muted">Documento de identidad</div>
                                <div className="fw-medium">
                                    {formData.documento_identidad ? formData.documento_identidad.name : 'No adjuntado'}
                                </div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <div className="text-muted">Comprobante de ingresos</div>
                                <div className="fw-medium">
                                    {formData.comprobante_ingresos ? formData.comprobante_ingresos.name : 'No adjuntado'}
                                </div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <div className="text-muted">Extractos bancarios</div>
                                <div className="fw-medium">
                                    {formData.extractos_bancarios ? formData.extractos_bancarios.name : 'No adjuntado'}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <div className="mb-4 p-3 border rounded bg-light">
                    <Form.Check 
                        type="checkbox"
                        id="acepto_terminos"
                        name="acepto_terminos"
                        label="Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales para la evaluación de esta solicitud de crédito."
                        checked={formData.acepto_terminos}
                        onChange={handleChange}
                        required
                        className="mb-0"
                    />
                </div>
            </div>
        </Form>
    );
};

export default Step4Review;