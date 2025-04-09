export const creditColumns = [
  { title: 'ID', accessor: 'creditId' },
  { title: 'Fecha', accessor: 'fecha' },
  { title: 'Cliente', accessor: 'nombreSolicitante' },
  { title: 'Estado', accessor: 'estado' },
  { title: 'Progreso', accessor: 'actividad' },
  { title: 'Monto', accessor: 'monto' },
  { title: 'Acciones', accessor: 'acciones' }
];

export const creditData = [
  {
    creditId: 'CR001',
    fecha: '2024-01-13',
    nombreSolicitante: 'Juan Pérez',
    estado: 'Pendiente',
    actividad: 'Enviado',
    monto: '$25,000.00 USD',
    actionsLink: "#"
  },
  {
    creditId: 'CR002',
    fecha: '2024-01-14',
    nombreSolicitante: 'María García',
    estado: 'Aprobado',
    actividad: 'Completado',
    monto: '$15,000.00 USD',
    actionsLink: "#"
  }
];
