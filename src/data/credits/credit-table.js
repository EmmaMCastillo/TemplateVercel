export const creditColumns = [
  { header: 'ID', accessor: 'creditId' },
  { header: 'Fecha', accessor: 'fecha' },
  { header: 'Cliente', accessor: 'nombreSolicitante' },
  { header: 'Estado', accessor: 'estado' },
  { header: 'Progreso', accessor: 'actividad' },
  { header: 'Monto', accessor: 'monto' },
  { header: 'Acciones', accessor: 'acciones' }
];

export const creditData = [
  {
    creditId: 'CR001',
    fecha: '2024-01-13',
    nombreSolicitante: 'Juan Pérez',
    estado: 'Pendiente',
    actividad: 'Enviado',
    monto: '$25,000.00 USD',
    acciones: (
      <>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><Edit /></i></a>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><ExternalLink /></i></a>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><Trash2 /></i></a>
      </>
    )
  },
  {
    creditId: 'CR002',
    fecha: '2024-01-14',
    nombreSolicitante: 'María García',
    estado: 'Aprobado',
    actividad: 'Completado',
    monto: '$15,000.00 USD',
    acciones: (
      <>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><Edit /></i></a>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><ExternalLink /></i></a>
        <a href="#" className="invoice-action-icon"><i className="feather-icon"><Trash2 /></i></a>
      </>
    )
  }
];

import { Edit, ExternalLink, Trash2 } from 'react-feather';