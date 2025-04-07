
export const creditRequestData = {
    documentTypes: [
        { id: 1, name: 'Identificación oficial' },
        { id: 2, name: 'Comprobante de domicilio' },
        { id: 3, name: 'Comprobante de ingresos' }
    ],
    creditTypes: [
        { id: 1, name: 'Personal', minAmount: 1000, maxAmount: 50000 },
        { id: 2, name: 'Hipotecario', minAmount: 100000, maxAmount: 5000000 },
        { id: 3, name: 'Automotriz', minAmount: 50000, maxAmount: 500000 }
    ]
};
