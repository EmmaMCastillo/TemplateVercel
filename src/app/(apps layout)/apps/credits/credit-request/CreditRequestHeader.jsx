import classNames from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';
import { ChevronDown, ChevronUp, MoreVertical, RefreshCw, Settings, ArrowLeft } from 'react-feather';
import HkTooltip from '@/components/@hk-tooltip/HkTooltip';
import { useGlobalStateContext } from '@/context/GolobalStateProvider';
import { useRouter } from 'next/navigation';

const CreditRequestHeader = ({ toggleSidebar, show }) => {
    const { states, dispatch } = useGlobalStateContext();
    const router = useRouter();

    return (
        <header className="invoice-header">
            <div className="d-flex align-items-center">
                <Dropdown>
                    <Dropdown.Toggle as="a" href="#" className="invoiceapp-title link-dark">
                        <h1>Nueva Solicitud de Crédito</h1>
                    </Dropdown.Toggle>
                </Dropdown>
            </div>
            <div className="invoice-options-wrap">
                <Button as="a" variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret flex-shrink-0 d-lg-inline-block d-none" href="#">
                    <HkTooltip placement={states.layoutState.topNavCollapse ? "bottom" : "top"} title="Refresh">
                        <span className="icon">
                            <span className="feather-icon">
                                <RefreshCw />
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
                <div className="v-separator d-lg-inline-block d-none" />
                <Dropdown>
                    <Dropdown.Toggle as="a" className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret ms-0  d-sm-inline-block d-none">
                        <span className="icon">
                            <span className="feather-icon">
                                <Settings />
                            </span>
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item>Administrar Contacto</Dropdown.Item>
                        <Dropdown.Item>Importar</Dropdown.Item>
                        <Dropdown.Item>Exportar</Dropdown.Item>
                        <div className="dropdown-divider" />
                        <Dropdown.Item>Enviar Mensajes</Dropdown.Item>
                        <Dropdown.Item>Delegar Acceso</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="a" >
                    <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret">
                        <span className="icon" data-bs-toggle="tooltip" data-placement="top" data-bs-original-title="More">
                            <span className="feather-icon">
                                <MoreVertical />
                            </span>
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                    </Dropdown.Menu>
                </Dropdown>
                <Button as="a" variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover hk-navbar-togglable d-sm-inline-block d-none" onClick={() => dispatch({ type: "top_nav_toggle" })} >
                    <HkTooltip placement={states.layoutState.topNavCollapse ? "bottom" : "top"} title="Collapse" >
                        <span className="icon">
                            <span className="feather-icon">
                                {
                                    states.layoutState.topNavCollapse ? <ChevronDown /> : <ChevronUp />
                                }
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
            </div>
            <div className={classNames("hk-sidebar-togglable", { "active": !show })} onClick={toggleSidebar} />
            <Button variant="outline-secondary" onClick={() => router.push('/apps/credits/credit-list')}>
                <ArrowLeft size={16} className="me-2" />
                Volver a Créditos
            </Button>
        </header>
    )
}

export default CreditRequestHeader;