
import Image from 'next/image';
import { Button, Card, Col, Row } from 'react-bootstrap';
import HkProgressBar from '@/components/@hk-progressbar/@hk-progressbar';
import ActiveUserMap from './ChartData/ActiveUserMap';

//Images
import UsFlag from '@/styles/fonts/flags/4x3/us.svg';
import IndianFlag from '@/styles/fonts/flags/4x3/in.svg';
import UkFlag from '@/styles/fonts/flags/4x3/gb.svg';
import AustralianFlag from '@/styles/fonts/flags/4x3/au.svg';
import CanadianFlag from '@/styles/fonts/flags/4x3/ca.svg';

const ActiveUserCardDuplicate = () => {
    return (
        <Card className="card-border mb-0 h-100">
            <Card.Header className="card-header-action">
                <h6>Active users (Alternative View)</h6>
                <div className="card-action-wrap">
                    <Button variant="outline-light">Real time chart</Button>
                </div>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={8} >
                        <ActiveUserMap chartId="chartdiv2" />
                    </Col>
                    <Col md={4}>
                        <div className="media align-items-center mb-3">
                            <div className="media-head me-3">
                                <div className="avatar avatar-xxs avatar-rounded">
                                    <Image src={UsFlag} alt="user" className="avatar-img" />
                                </div>
                            </div>
                            <div className="media-body">
                                <HkProgressBar.Wrapper>
                                    <HkProgressBar.Label className="mb-0">United States</HkProgressBar.Label>
                                    <div className="d-flex align-items-center">
                                        <HkProgressBar now={80} variant="blue-dark-3" rounded size="xs" className="flex-1" />
                                        <div className="fs-8 mnw-30p ms-3">80%</div>
                                    </div>
                                </HkProgressBar.Wrapper>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ActiveUserCardDuplicate;
