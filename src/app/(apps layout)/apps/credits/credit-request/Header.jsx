
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { RefreshCw, Settings } from 'react-feather';
import HkTooltip from '@/components/@hk-tooltip/HkTooltip';

const Header = () => {
    return (
        <div className="credit-header mt-3">
            <div className="d-flex flex-wrap justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <h3>Solicitudes de Crédito</h3>
                </div>
                <ButtonGroup>
                    <Button variant="primary" className="btn-icon">
                        <span className="icon">
                            <span>Nueva Solicitud</span>
                        </span>
                    </Button>
                </ButtonGroup>
            </div>
            <div className="credit-options-wrap">
                <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret">
                    <HkTooltip placement="top" title="Actualizar">
                        <span className="icon">
                            <span className="feather-icon">
                                <RefreshCw />
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
                <div className="v-separator d-lg-inline-block d-none" />
                <Dropdown>
                    <Dropdown.Toggle as="a" className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret ms-0">
                        <span className="icon">
                            <span className="feather-icon">
                                <Settings />
                            </span>
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item>Configuración</Dropdown.Item>
                        <Dropdown.Item>Acciones</Dropdown.Item>
                        <Dropdown.Item>Reportes</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default Header;
