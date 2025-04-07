
'use client'
import { useState } from 'react';
import classNames from 'classnames';
import CreditAppHeader from './CreditAppHeader';
import CreditAppSidebar from '../CreditAppSidebar';
import CreditListBody from './CreditListBody';

const CreditList = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("creditapp-wrap", { "creditapp-sidebar-toggle": !showSidebar })} >
                <CreditAppSidebar />
                <div className="creditapp-content">
                    <div className="creditapp-detail-wrap">
                        <CreditAppHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <CreditListBody />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditList
