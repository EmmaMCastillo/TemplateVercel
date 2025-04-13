import { DM_Sans } from 'next/font/google'
import { GlobalStateProvider } from '@/context/GolobalStateProvider';
import { AuthProvider } from '@/context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Agregar Bootstrap Icons
import 'react-perfect-scrollbar/dist/css/styles.css';
import '@/styles/scss/style.scss';
import '@/styles/css/custom-sidebar.css'; // Estilos personalizados para el menú lateral

// Font Family
const dm_sans = DM_Sans({
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: '--font-jampack'
})

// metadata
export const metadata = {
  title: 'TDXCORE - DEMO',
  description: 'NextJs based admin dashboard template by hencework',
  keywords: ['NextJs', 'React NextJs', 'Next.js', 'React template', 'react admin', 'react node', 'react bootstrap', 'responsive web application', 'react webapp', 'multi app demos'],
}


export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${dm_sans.variable}`}>
      <head>
        {/* Agregar enlace a Bootstrap Icons CDN como alternativa */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body>
        <GlobalStateProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GlobalStateProvider>
      </body>
    </html>
  )
}
