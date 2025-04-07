import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import HkDropZone from '@/components/@hk-drop-zone/HkDropZone';
import CreditList from './CreditList';

const CreditRequestBody = () => {
    return (
        <div className="credit-body">
            <SimpleBar className="nicescroll-bar">
                <div className="credit-list-view">
                    <CreditList />
                </div>
            </SimpleBar>
        </div>
    )
}

export default CreditRequestBody;