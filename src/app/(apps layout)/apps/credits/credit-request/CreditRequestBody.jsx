
import SimpleBar from 'simplebar-react';
import CreditList from './CreditList';

const CreditRequestBody = () => {
    return (
        <div className="credit-body">
            <SimpleBar className="nicescroll-bar">
                <div className="credit-list-view p-4">
                    <CreditList />
                </div>
            </SimpleBar>
        </div>
    )
}

export default CreditRequestBody
