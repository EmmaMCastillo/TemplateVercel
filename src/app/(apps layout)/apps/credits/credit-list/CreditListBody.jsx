import SimpleBar from 'simplebar-react';
import { creditData, creditColumns } from '@/data/credits/credit-table';
import HkDataTable from '@/components/@hk-data-table';
import { Card } from 'react-bootstrap';

const CreditListBody = () => {
    return (
        <div className="invoice-body">
            <SimpleBar className="nicescroll-bar">
                <div className="invoice-list-view">
                    <Card className="card-border mb-0 h-100">
                        <Card.Body>
                            <HkDataTable
                                column={creditColumns}
                                rowData={creditData}
                                rowSelection
                                rowsPerPage={4}
                                paginatorSize="sm"
                                classes="display pb-30"
                                responsive
                            />
                        </Card.Body>
                    </Card>
                </div>
            </SimpleBar>
        </div>
    )
}

export default CreditListBody