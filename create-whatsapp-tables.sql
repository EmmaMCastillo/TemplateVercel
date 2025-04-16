-- Tabla para almacenar mensajes de WhatsApp
CREATE TABLE whatsapp_messages (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) UNIQUE,
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20),
  text TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'text',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  media_url TEXT,
  sender_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar actualizaciones de estado de mensajes
CREATE TABLE whatsapp_message_status (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) REFERENCES whatsapp_messages(message_id),
  status VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  error_code VARCHAR(50),
  error_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda eficiente
CREATE INDEX idx_whatsapp_messages_from ON whatsapp_messages(from_number);
CREATE INDEX idx_whatsapp_messages_to ON whatsapp_messages(to_number);
CREATE INDEX idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp);
CREATE INDEX idx_whatsapp_message_status_message_id ON whatsapp_message_status(message_id);