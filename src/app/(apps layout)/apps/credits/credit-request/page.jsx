
'use client'
import { useState } from 'react';
import classNames from 'classnames';
import CreditRequestBody from './CreditRequestBody';
import Header from './Header';

const CreditRequestPage = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    
    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("creditapp-wrap", { "creditapp-sidebar-toggle": !showSidebar })}>
                <div className="creditapp-content">
                    <div className="creditapp-detail-wrap">
                        <Header toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <CreditRequestBody />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditRequestPage
