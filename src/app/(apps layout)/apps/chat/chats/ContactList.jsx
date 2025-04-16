import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';
import * as Icons from 'react-feather';
import { Dropdown, Form, ListGroup } from 'react-bootstrap';
import { useWindowWidth } from '@react-hook/window-size';
import { useGlobalStateContext } from '@/context/GolobalStateProvider';
import { supabase } from '@/utils/supabase';

//Images
import avatar1 from '@/assets/img/avatar1.jpg';
import avatar8 from '@/assets/img/avatar8.jpg';
import avatar15 from '@/assets/img/avatar15.jpg';


const ContactList = ({ invitePeople }) => {
    const { states, dispatch } = useGlobalStateContext();
    const [list, setList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true);
    const width = useWindowWidth();

    // Cargar contactos de WhatsApp desde la base de datos
    useEffect(() => {
        const fetchWhatsAppContacts = async () => {
            try {
                setLoading(true);
                
                // Obtener mensajes únicos agrupados por número de teléfono
                const { data, error } = await supabase
                    .from('whatsapp_messages')
                    .select('from_number, sender_name, created_at')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                // Procesar los datos para crear una lista de contactos única
                const uniqueContacts = {};
                
                data.forEach(msg => {
                    // Solo procesar mensajes recibidos (no los enviados por nosotros)
                    if (!uniqueContacts[msg.from_number]) {
                        uniqueContacts[msg.from_number] = {
                            id: msg.from_number,
                            name: msg.sender_name || `WhatsApp (${msg.from_number})`,
                            initAvatar: { 
                                type: 'init', 
                                title: (msg.sender_name || 'W').charAt(0), 
                                variant: 'success' 
                            },
                            time: new Date(msg.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            lastChat: "WhatsApp Contact",
                            status: "WhatsApp",
                            unread: 0
                        };
                    }
                });
                
                // Convertir el objeto a un array
                const contactsList = Object.values(uniqueContacts);
                
                setList(contactsList);
            } catch (err) {
                console.error('Error al cargar contactos de WhatsApp:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWhatsAppContacts();
    }, []);

    const Conversation = (index, id) => {
        (list[index].avatar) 
            ? dispatch({ 
                type: "set_user", 
                userId: list[index].id, 
                avatar: list[index].avatar, 
                userName: list[index].name, 
                status: list[index].status 
              }) 
            : dispatch({ 
                type: "set_user", 
                userId: list[index].id, 
                avatar: list[index].initAvatar, 
                userName: list[index].name, 
                status: list[index].status 
              });

        const updatedContacts = list.map((contactList) =>
            contactList.id === id ? { ...contactList, unread: 0 } : contactList
        );
        setList(updatedContacts);

        if (width <= 991) {
            dispatch({ type: "start_chat" });
            dispatch({ type: "top_nav_toggle" });
        }
    }

    const searchOnChange = (event) => {
        setSearchValue(event.target.value);
        
        if (searchValue.length <= 1) {
            // Si se borra la búsqueda, mostrar todos los contactos
            return;
        }
        
        // Filtrar la lista actual
        const filteredList = list.filter(item => 
            item.name.toString().toLowerCase().includes(searchValue.toLowerCase())
        );
        
        setList(filteredList);
    }

    return (
        <>
            <div className="chatapp-aside">
                <header className="aside-header">
                    <Dropdown>
                        <Dropdown.Toggle as="a" className="chatapp-title link-dark" href="#" >
                            <h1>Chat</h1>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} href="chats">
                                <span className="feather-icon dropdown-icon">
                                    <Icons.MessageSquare />
                                </span>
                                <span>Chats</span>
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} href="contact">
                                <span className="feather-icon dropdown-icon">
                                    <Icons.Book />
                                </span>
                                <span>Contacts</span>
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} href="groups">
                                <span className="feather-icon dropdown-icon">
                                    <Icons.User />
                                </span>
                                <span>Groups</span>
                            </Dropdown.Item>
                            <Dropdown.Item href="#">
                                <span className="feather-icon dropdown-icon">
                                    <Icons.Archive />
                                </span>
                                <span>Archived</span>
                            </Dropdown.Item>
                            <Dropdown.Item href="#">
                                <span className="feather-icon dropdown-icon">
                                    <Icons.Star />
                                </span>
                                <span>Favorites</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="d-flex">
                        <Dropdown>
                            <Dropdown.Toggle as="a" href="#" className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret me-1">
                                <span className="icon">
                                    <span className="feather-icon">
                                        <Icons.Settings />
                                    </span>
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" >
                                <Dropdown.Item href="#">
                                    <span className="feather-icon dropdown-icon">
                                        <Icons.UserCheck />
                                    </span>
                                    <span>Active Contacts</span>
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <span className="feather-icon dropdown-icon">
                                        <Icons.MessageSquare />
                                    </span>
                                    <span>Chat Requests</span>
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <span className="feather-icon dropdown-icon">
                                        <Icons.Archive />
                                    </span>
                                    <span>Archived Chats</span>
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <span className="feather-icon dropdown-icon">
                                        <Icons.ToggleRight />
                                    </span>
                                    <span>Unread Chats</span>
                                </Dropdown.Item>
                                <Dropdown.Divider as="div" />
                                <Dropdown.Item href="#">Settings</Dropdown.Item>
                                <Dropdown.Item href="#">Help</Dropdown.Item>
                                <Dropdown.Item href="#">Report a problem	</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <a className="btn btn-icon btn-rounded btn-primary" onClick={invitePeople} >
                            <span className="icon">
                                <span className="feather-icon">
                                    <Icons.Plus />
                                </span>
                            </span>
                        </a>
                    </div>
                </header>
                <SimpleBar style={{ height: "100%" }} className="aside-body" >
                    <Form className="aside-search" role="search">
                        <Form.Control type="text" placeholder="Search Chats" value={searchValue} onChange={searchOnChange} />
                    </Form>
                    <div className="frequent-contact">
                        <div className="title-sm text-primary"><span>WhatsApp Contacts</span></div>
                        <ul className="hk-list">
                            <li>
                                <div className="avatar avatar-sm avatar-soft-success avatar-rounded position-relative">
                                    <span className="initial-wrap">W</span>
                                    <span className="badge badge-success badge-indicator badge-indicator-lg position-bottom-end-overflow-1" />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <ListGroup variant="flush" className="chat-contacts-list">
                        {loading ? (
                            <div className="d-flex justify-content-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : list.length === 0 ? (
                            <div className="text-center my-5 text-muted">
                                No WhatsApp contacts found
                            </div>
                        ) : (
                            list.map((elem, index) => (
                                <ListGroup.Item onClick={() => Conversation(index, elem.id)} key={index} >
                                    <div className={classNames("media", { "active-user": elem.id === states.chatState.userId }, { "read-chat": !elem.unread })}>
                                        <div className="media-head">
                                            {elem.avatar && <div className="avatar avatar-sm avatar-rounded position-relative">
                                                <Image src={elem.avatar.src} alt="user" className="avatar-img" />
                                                {elem.status === "online" && <span className="badge badge-success badge-indicator badge-indicator-lg position-bottom-end-overflow-1" />}
                                            </div>}
                                            {elem.initAvatar && <div className={`avatar avatar-sm avatar-${elem.initAvatar.variant} avatar-rounded`}>
                                                <span className="initial-wrap">{elem.initAvatar.title}</span>
                                            </div>}
                                        </div>
                                        <div className="media-body">
                                            <div>
                                                <div className="user-name">{elem.name}</div>
                                                <div className="user-last-chat">{elem.lastChat}</div>
                                            </div>
                                            <div>
                                                <div className="last-chat-time">{elem.time}</div>
                                                {elem.unread > 0 && <div className="badge badge-primary badge-sm badge-pill">{elem.unread}</div>}
                                                <div className="dropdown action-drp">
                                                    <a href="#" className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span className="icon"><span className="feather-icon"><i data-feather="more-horizontal" /></span></span></a>
                                                    <div className="dropdown-menu dropdown-menu-end">
                                                        <a className="dropdown-item" href="#">Mute Chat</a>
                                                        <a className="dropdown-item" href="#">Archive Chat</a>
                                                        <a className="dropdown-item" href="#">Delete Chat</a>
                                                        <a className="dropdown-item link-danger" href="#">Block</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </SimpleBar>
            </div>
        </>
    )
}

export default ContactList;