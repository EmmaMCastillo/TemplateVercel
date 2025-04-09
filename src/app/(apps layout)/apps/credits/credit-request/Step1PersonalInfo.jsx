'use client'
import { Form, Row, Col } from 'react-bootstrap';

const Step1PersonalInfo = ({ formData, handleChange }) => {
    return (
        <Form>
            <div className="mb-4">
                <h6 className="mb-3">Datos Personales</h6>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                placeholder="Ingrese nombre" 
                                required 
                                isInvalid={formData.nombre === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                El nombre es obligatorio
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Apellidos *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="apellido" 
                                value={formData.apellido} 
                                onChange={handleChange} 
                                placeholder="Ingrese apellidos" 
                                required 
                                isInvalid={formData.apellido === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                Los apellidos son obligatorios
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Tipo de Documento *</Form.Label>
                            <Form.Select 
                                name="documento" 
                                value={formData.documento} 
                                onChange={handleChange} 
                                required
                                isInvalid={formData.documento === ''}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="dni">DNI</option>
                                <option value="nie">NIE</option>
                                <option value="pasaporte">Pasaporte</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Seleccione un tipo de documento
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Número de Documento *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="numero_documento" 
                                value={formData.numero_documento} 
                                onChange={handleChange} 
                                placeholder="Ingrese número de documento" 
                                required 
                                isInvalid={formData.numero_documento === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                El número de documento es obligatorio
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Fecha de Nacimiento *</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="fecha_nacimiento" 
                                value={formData.fecha_nacimiento} 
                                onChange={handleChange} 
                                required 
                                isInvalid={formData.fecha_nacimiento === ''}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                La fecha de nacimiento es obligatoria
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Nacionalidad *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nacionalidad" 
                                value={formData.nacionalidad} 
                                onChange={handleChange} 
                                placeholder="Ingrese nacionalidad" 
                                required 
                                isInvalid={formData.nacionalidad === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                La nacionalidad es obligatoria
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
            
            <div className="mb-4">
                <h6 className="mb-3">Información de Contacto</h6>
                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Correo Electrónico *</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="ejemplo@correo.com" 
                                required 
                                isInvalid={formData.email === ''}
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            />
                            <Form.Control.Feedback type="invalid">
                                Ingrese un correo electrónico válido
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Teléfono de Contacto *</Form.Label>
                            <Form.Control 
                                type="tel" 
                                name="telefono" 
                                value={formData.telefono} 
                                onChange={handleChange} 
                                placeholder="+XX XXX XXX XXX" 
                                required 
                                isInvalid={formData.telefono === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                El teléfono de contacto es obligatorio
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                        <Form.Group>
                            <Form.Label>Dirección *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="direccion" 
                                value={formData.direccion} 
                                onChange={handleChange} 
                                placeholder="Calle, número, piso, etc." 
                                required 
                                isInvalid={formData.direccion === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                La dirección es obligatoria
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Ciudad *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="ciudad" 
                                value={formData.ciudad} 
                                onChange={handleChange} 
                                placeholder="Ingrese ciudad" 
                                required 
                                isInvalid={formData.ciudad === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                La ciudad es obligatoria
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Código Postal *</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="codigo_postal" 
                                value={formData.codigo_postal} 
                                onChange={handleChange} 
                                placeholder="Ingrese código postal" 
                                required 
                                isInvalid={formData.codigo_postal === ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                El código postal es obligatorio
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="provincia" 
                                value={formData.provincia} 
                                onChange={handleChange} 
                                placeholder="Ingrese provincia" 
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>País *</Form.Label>
                            <Form.Select 
                                name="pais" 
                                value={formData.pais} 
                                onChange={handleChange} 
                                required
                                isInvalid={formData.pais === ''}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="es">España</option>
                                <option value="mx">México</option>
                                <option value="co">Colombia</option>
                                <option value="ar">Argentina</option>
                                <option value="cl">Chile</option>
                                <option value="pe">Perú</option>
                                <option value="otro">Otro</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Seleccione un país
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};

export default Step1PersonalInfo;