'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { supabase } from '@/utils/supabase';

export default function WhatsAppTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Cargar mensajes al iniciar
  useEffect(() => {
    fetchMessages();
    
    // Suscribirse a nuevos mensajes
    const subscription = supabase
      .channel('whatsapp_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'whatsapp_messages'
      }, (payload) => {
        setMessages(prev => [payload.new, ...prev]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Cargar mensajes desde la base de datos
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError('Error al cargar mensajes: ' + err.message);
    }
  };
  
  // Enviar mensaje de prueba
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const response = await fetch('/api/whatsapp/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          message
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensaje');
      }
      
      setResult(data);
      setMessage('');
      
      // Recargar mensajes
      fetchMessages();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Prueba de WhatsApp API</h1>
      
      <Row className="mb-5">
        <Col md={6}>
          <Card>
            <Card.Header>Enviar Mensaje de Prueba</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Teléfono (con código de país)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="+573153041548"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    En modo sandbox, solo puedes enviar mensajes a números verificados.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Mensaje de prueba"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    En modo sandbox, se enviará la plantilla "hello_world" en lugar de este mensaje.
                  </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </Form>
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              
              {result && (
                <Alert variant="success" className="mt-3">
                  Mensaje enviado exitosamente. ID: {result.data?.messages?.[0]?.id}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Configuración del Webhook</Card.Header>
            <Card.Body>
              <p>Para recibir mensajes, configura el webhook en Meta for Developers:</p>
              
              <h5>URL del Webhook:</h5>
              <code className="d-block bg-light p-2 mb-3">
                {process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp
              </code>
              
              <h5>Token de Verificación:</h5>
              <code className="d-block bg-light p-2 mb-3">
                {process.env.NEXT_PUBLIC_WHATSAPP_VERIFY_TOKEN || 'Configura WHATSAPP_VERIFY_TOKEN en .env.local'}
              </code>
              
              <h5>Campos a Suscribir:</h5>
              <ul>
                <li>messages</li>
                <li>message_status_updates</li>
              </ul>
              
              <Alert variant="info">
                Para pruebas locales, puedes usar ngrok para exponer tu servidor local a Internet.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>Mensajes Recientes</Card.Header>
        <Card.Body>
          <Button variant="secondary" onClick={fetchMessages} className="mb-3">
            Actualizar Mensajes
          </Button>
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>De</th>
                <th>Para</th>
                <th>Mensaje</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No hay mensajes</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.message_id}</td>
                    <td>{msg.from_number}</td>
                    <td>{msg.to_number}</td>
                    <td>{msg.text}</td>
                    <td>{msg.type}</td>
                    <td>{msg.status}</td>
                    <td>{new Date(msg.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}