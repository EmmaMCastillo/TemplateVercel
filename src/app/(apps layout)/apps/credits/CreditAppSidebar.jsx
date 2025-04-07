
import { Button, Nav } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import { Archive, Edit, Plus, Star, Trash2, Users } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';

const CreditAppSidebar = () => {
    return (
        <nav className="creditapp-sidebar">
            <SimpleBar className="nicescroll-bar">
                <div className="menu-content-wrap">
                    <div className="menu-group">
                        <Button as={Link} to="create-credit" variant="primary" className="btn-rounded btn-block mb-4">
                            <span>
                                <span className="icon">
                                    <span className="feather-icon">
                                        <Plus />
                                    </span>
                                </span>
                                <span>Nuevo Crédito</span>
                            </span>
                        </Button>
                        <Nav className="nav-light navbar-nav flex-column">
                            <Nav.Item>
                                <Nav.Link active>
                                    <span className="nav-icon-wrap">
                                        <span className="feather-icon">
                                            <Users />
                                        </span>
                                    </span>
                                    <span className="nav-link-text">Todos los Créditos</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link>
                                    <span className="nav-icon-wrap">
                                        <span className="feather-icon">
                                            <Star />
                                        </span>
                                    </span>
                                    <span className="nav-link-text">Favoritos</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link>
                                    <span className="nav-icon-wrap">
                                        <span className="feather-icon">
                                            <Archive />
                                        </span>
                                    </span>
                                    <span className="nav-link-text">Archivados</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </div>
            </SimpleBar>
        </nav>
    )
}

export default CreditAppSidebar;
