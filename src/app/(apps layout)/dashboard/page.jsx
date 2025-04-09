"use client"
import { Col, Container, Form, InputGroup, Nav, Row, Tab } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import { Calendar } from 'react-feather';
// Importar componentes antiguos (comentados temporalmente)
// import ActiveUserCard from './ActiveUserCard';
// import ActiveUserCardDuplicate from './ActiveUserCardDuplicate';
// import AudienceReviewCard from './AudienceReviewCard';
// import ReturningCustomersCard from './ReturningCustomersCard';
// import CustomerTable from './CustomerTable';
import ChatBotInterface from '../apps/chat-popup/chat-bot/ChatBotInterface';

// Importar nuevos componentes
import ReporteProspectos from './ReporteProspectos';
import ReporteSolicitudes from './ReporteSolicitudes';
import ReporteAsesores from './ReporteAsesores';

const Dashboard = () => {

    return (
        <>
            <ChatBotInterface show={false} />
            <Container fluid="xxl" >
                <Tab.Container activeKey="prospectos">
                    {/* Page Header */}
                    <div className="hk-pg-header pg-header-wth-tab pt-7">
                        <div className="d-flex">
                            <div className="d-flex flex-wrap justify-content-between flex-1">
                                <div className="mb-lg-0 mb-2 me-8">
                                    <h1 className="pg-title">Welcome back</h1>
                                    <p>Create pages using a variety of features that leverage jampack components</p>
                                </div>
                                <div className="pg-header-action-wrap">
                                    <InputGroup className="w-300p">
                                        <span className="input-affix-wrapper">
                                            <span className="input-prefix">
                                                <span className="feather-icon">
                                                    <Calendar />
                                                </span>
                                            </span>
                                            <DateRangePicker
                                                initialSettings={{
                                                    timePicker: true,
                                                    startDate: moment().startOf('hour').toDate(),
                                                    endDate: moment().startOf('hour').add(32, 'hour').toDate(),
                                                    locale: {
                                                        format: 'M/DD hh:mm A',
                                                    },
                                                }}
                                            >
                                                <Form.Control type="text" name="datetimes" />
                                            </DateRangePicker>
                                        </span>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <Nav variant="tabs" className="nav-light nav-line">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" >
                                    <span className="nav-link-text">Overview</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="prospectos">
                                    <span className="nav-link-text">Prospectos</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="solicitudes">
                                    <span className="nav-link-text">Solicitudes</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="asesores">
                                    <span className="nav-link-text">Asesores</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    {/* /Page Header */}
                    {/* Page Body */}
                    <div className="hk-pg-body">
                        <Tab.Content>
                            <Tab.Pane eventKey="overview" >
                                {/* Contenido comentado temporalmente */}
                                {/* <Row>
                                    <Col xxl={9} lg={8} md={7} className="mb-md-4 mb-3">
                                        <AudienceReviewCard />
                                    </Col>
                                    <Col xxl={3} lg={4} md={5} className="mb-md-4 mb-3">
                                        <ReturningCustomersCard />
                                    </Col>
                                </Row> */}
                                {/* Primary Active Users Visualization */}
                                {/* <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <ActiveUserCard />
                                    </Col>
                                </Row> */}
                                {/* Secondary Active Users Visualization - Alternative View */}
                                {/* <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <ActiveUserCardDuplicate />
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <CustomerTable />
                                    </Col>
                                </Row> */}
                                <div className="text-center py-5">
                                    <h3>Bienvenido al Dashboard</h3>
                                    <p>Por favor, seleccione una de las pestañas para ver los reportes.</p>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="prospectos">
                                <ReporteProspectos />
                            </Tab.Pane>
                            <Tab.Pane eventKey="solicitudes">
                                <ReporteSolicitudes />
                            </Tab.Pane>
                            <Tab.Pane eventKey="asesores">
                                <ReporteAsesores />
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                    {/* /Page Body */}
                </Tab.Container>
            </Container>
        </>
    )
}

export default Dashboard
