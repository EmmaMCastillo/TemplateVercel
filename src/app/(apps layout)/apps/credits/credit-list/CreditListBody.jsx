import SimpleBar from 'simplebar-react';
import CreditList from './CreditList';

const CreditListBody = () => {
    return (
        <div className="invoice-body">
            <SimpleBar className="nicescroll-bar">
                <div className="invoice-list-view">
                    <CreditList />
                </div>
            </SimpleBar>
        </div>
    )
}

export default CreditListBody