
'use client';
import { Container } from 'react-bootstrap';
import CreditList from './CreditList';
import SimpleBar from 'simplebar-react';

const CreditRequestBody = () => {
    return (
        <div className="creditapp-wrap">
            <div className="creditapp-content">
                <div className="creditapp-detail-wrap">
                    <SimpleBar className="nicescroll-bar">
                        <Container fluid>
                            <CreditList />
                        </Container>
                    </SimpleBar>
                </div>
            </div>
        </div>
    );
};

export default CreditRequestBody;
