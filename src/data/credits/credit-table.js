
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
        cellFormatter: (cell) => <span>{cell[0].title}</span>,
        sortValue: (cell) => cell[0].title,
    },
    {
        accessor: "estado",
        title: "Estado",
        sort: true,
        cellFormatter: (cell) => (
            <span className={`badge bg-${cell[0].bg}`}>
                {cell[0].title}
                {cell[0].text && <small className="d-block">{cell[0].text}</small>}
            </span>
        ),
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
        cellFormatter: (cell) => <Button variant="link">{cell.actionLink}</Button>,
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
