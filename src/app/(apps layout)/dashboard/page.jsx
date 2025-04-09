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
import VistaGeneral from './VistaGeneral';
import ReporteProspectos from './ReporteProspectos';
import ReporteSolicitudes from './ReporteSolicitudes';
import TasaConversion from './TasaConversion';

const Dashboard = () => {

    return (
        <>
            <ChatBotInterface show={false} />
            <Container fluid="xxl" >
                <Tab.Container activeKey="vista_general">
                    {/* Page Header */}
                    <div className="hk-pg-header pg-header-wth-tab pt-7">
                        <div className="d-flex">
                            <div className="d-flex flex-wrap justify-content-between flex-1">
                                <div className="mb-lg-0 mb-2 me-8">
                                    <h1 className="pg-title">Dashboard</h1>
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
                                                <Form.Control type="text" name="datetimes" value="4/09 11:00 AM - 4/10 07:00 PM" readOnly />
                                            </DateRangePicker>
                                        </span>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <Nav variant="tabs" className="nav-light nav-line">
                            <Nav.Item>
                                <Nav.Link eventKey="vista_general">
                                    <span className="nav-link-text">Vista General</span>
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
                                <Nav.Link eventKey="desempeno">
                                    <span className="nav-link-text">Desempeño</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    {/* /Page Header */}
                    {/* Page Body */}
                    <div className="hk-pg-body">
                        <Tab.Content>
                            <Tab.Pane eventKey="vista_general">
                                <VistaGeneral />
                            </Tab.Pane>
                            <Tab.Pane eventKey="prospectos">
                                <ReporteProspectos />
                            </Tab.Pane>
                            <Tab.Pane eventKey="solicitudes">
                                <ReporteSolicitudes />
                            </Tab.Pane>
                            <Tab.Pane eventKey="desempeno">
                                <TasaConversion />
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
