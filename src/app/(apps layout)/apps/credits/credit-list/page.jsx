'use client'
import { useState } from 'react';
import classNames from 'classnames';
import CreditAppHeader from './CreditAppHeader';
import CreditAppSidebar from './CreditAppSidebar';
import CreditListBody from './CreditListBody';

const CreditList = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("invoiceapp-wrap", { "invoiceapp-sidebar-toggle": !showSidebar })} >
                <CreditAppSidebar />
                <div className="invoiceapp-content">
                    <div className="invoiceapp-detail-wrap">
                        <CreditAppHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <CreditListBody />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreditList