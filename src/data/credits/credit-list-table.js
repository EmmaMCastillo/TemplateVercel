
import React from 'react';
import { Archive, Edit, Trash2 } from 'react-feather';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import HkBadge from '@/components/@hk-badge/@hk-badge';

const applicantFormatter = (cell) => {
    return (
        cell.map((data, indx) => (
            <React.Fragment key={indx}>
                <div className="text-dark">{data.title}</div>
                <div className="fs-7">{data.id}</div>
            </React.Fragment>
        ))
    )
}

const statusFormatter = (cell) => {
    return (
        cell.map((data, indx) => (
            <React.Fragment key={indx}>
                <HkBadge bg={data.bg} text={data.color} className="my-1 me-2">{data.title}</HkBadge>
                <div className="fs-8 mt-1">{data.text}</div>
            </React.Fragment>
        ))
    )
}

const actionFormatter = (cell) => {
    return (
        cell.map((data, indx) => (
            <div className="d-flex align-items-center" key={indx}>
                <Dropdown as={ButtonGroup} className="btn-group selectable-split-dropdown">
                    <Button variant="outline-light" type="button" className="btn-dyn-text w-100p">Editar</Button>
                    <Dropdown.Toggle variant="outline-light" split className="me-3">
                        <span className="sr-only">Toggle Dropdown</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item>Revisar</Dropdown.Item>
                        <Dropdown.Item>Aprobar</Dropdown.Item>
                        <Dropdown.Item>Rechazar</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className="d-flex">
                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                        <span className="btn-icon-wrap">
                            <span className="feather-icon">
                                <Archive />
                            </span>
                        </span>
                    </Button>
                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" href={data.actionLink}>
                        <span className="btn-icon-wrap">
                            <span className="feather-icon">
                                <Edit />
                            </span>
                        </span>
                    </Button>
                </div>
            </div>
        ))
    )
}

export const columns = [
    {
        accessor: "id",
        title: "ID",
        hidden: true,
    },
    {
        accessor: "credito",
        title: "Crédito #",
        sort: false,
        cellFormatter: (cell) => <a href="#" className="table-link-text link-high-em">{cell}</a>,
    },
    {
        accessor: "fecha",
        title: "Fecha",
        sort: true,
    },
    {
        accessor: "solicitante",
        title: "Solicitante",
        sort: true,
        cellFormatter: applicantFormatter,
    },
    {
        accessor: "estado",
        title: "Estado",
        sort: true,
        cellFormatter: statusFormatter,
    },
    {
        accessor: "actividad",
        title: "Actividad",
        sort: true,
    },
    {
        accessor: "monto",
        title: "Monto",
        sort: true,
    },
    {
        accessor: "acciones",
        title: "Acciones",
        cellFormatter: actionFormatter,
    },
];

export const data = [
    {
        id: 1,
        credito: "CR001",
        fecha: "13 Ene, 2024",
        solicitante: [{ title: "Juan Pérez", id: "juan@email.com" }],
        estado: [{ title: "Pendiente", bg: "warning", text: "En revisión" }],
        actividad: "Enviado",
        monto: "$ 25,000.00 USD",
        acciones: [{ actionLink: "#" }]
    },
    {
        id: 2,
        credito: "CR002",
        fecha: "14 Ene, 2024",
        solicitante: [{ title: "María García", id: "maria@email.com" }],
        estado: [{ title: "Aprobado", bg: "primary" }],
        actividad: "Completado",
        monto: "$ 15,000.00 USD",
        acciones: [{ actionLink: "#" }]
    }
];
