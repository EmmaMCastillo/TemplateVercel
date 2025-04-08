export const creditColumns = [
  { header: 'Crédito #', accessor: 'id' },
  { header: 'Fecha', accessor: 'fecha' },
  { header: 'Solicitante', accessor: 'nombre' },
  { header: 'Estatus', accessor: 'estado' },
  { header: 'Actividad', accessor: 'actividad' },
  { header: 'Monto', accessor: 'monto' },
  { header: 'Acciones', accessor: 'acciones' }
];

export const creditData = [
  {
    id: 'CR001',
    fecha: '2024-01-13',
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    estado: 'Pendiente',
    actividad: 'Enviado',
    monto: '$25,000.00 USD'
  },
  {
    id: 'CR002',
    fecha: '2024-01-14',
    nombre: 'María García',
    email: 'maria@email.com',
    estado: 'Aprobado',
    actividad: 'Completado',
    monto: '$15,000.00 USD'
  }
];