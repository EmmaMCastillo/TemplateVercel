
import SimpleBar from 'simplebar-react';
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

export default CreditRequestBody
