
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { Archive, Edit, FileText, MoreVertical, Printer, Share, Trash2 } from 'react-feather';
import { nanoid } from 'nanoid';
import HkTooltip from '@/components/@hk-tooltip/HkTooltip';

const CreditRequestHeader = () => {
    return (
        <div className="credit-header mt-3">
            <div className="d-flex flex-wrap justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <h3>Solicitud de Crédito</h3>
                </div>
                <ButtonGroup>
                    <Button variant="outline-light" className="btn-icon">
                        <span className="icon">
                            <span className="feather-icon">
                                <Share />
                            </span>
                        </span>
                    </Button>
                    <Button variant="outline-light" className="btn-icon">
                        <span className="icon">
                            <span className="feather-icon">
                                <Printer />
                            </span>
                        </span>
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default CreditRequestHeader;
