import * as Icons from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';

export const SidebarMenu = [
    {
        group: '',
        contents: [
            {
                name: 'Dashboard',
                icon: <Icons.Dashboard size={24} />,
                path: '/dashboard'
            },
            {
                name: 'Prospectos',
                icon: <Icons.Users size={18} />,
                path: '/apps/prospectos'
            },
            {
                name: 'Bancos',
                icon: <Icons.CreditCard size={18} />,
                path: '/apps/bancos'
            },
            {
                name: 'Solicitudes',
                icon: <Icons.FileInvoice size={18} />,
                path: '/apps/solicitudes'
            },
            {
                name: 'Usuarios',
                icon: <Icons.User size={18} />,
                path: '/apps/usuarios'
            }, // Coma añadida aquí
        ]
    }
]