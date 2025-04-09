import * as Icons from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';

export const SidebarMenu = [
    {
        group: '',
        contents: [
            {
                name: 'Dashboard',
                icon: <Icons.Dashboard size={18} />,
                path: '/dashboard'
            },
            {
                name: 'Prospectos',
                icon: <Icons.Users size={18} />,
                path: '/apps/prospectos'
            },
            {
                name: 'Solicitudes',
                icon: <Icons.FileInvoice size={18} />,
                path: '/apps/solicitudes'
            }
        ]
    }
]