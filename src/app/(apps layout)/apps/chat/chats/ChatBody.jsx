import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button, Dropdown } from 'react-bootstrap';
import { ArrowDown, CornerUpRight, MoreHorizontal } from 'react-feather';
import SimpleBar from 'simplebar-react';
import { useGlobalStateContext } from '@/context/GolobalStateProvider';
import { supabase } from '@/utils/supabase';

const ChatBody = () => {
    const { states } = useGlobalStateContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);

    // Cargar mensajes del estado global
    useEffect(() => {
        setMessages(states.chatState.msg);
    }, [states.chatState.msg]);

    // Cargar historial de chat desde la base de datos cuando cambia el usuario seleccionado
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!states.chatState.userId) return;
            
            try {
                setLoading(true);
                
                // Obtener mensajes enviados y recibidos para este contacto
                const { data, error } = await supabase
                    .from('whatsapp_messages')
                    .select('*')
                    .or(`from_number.eq.${states.chatState.userId},to_number.eq.${states.chatState.userId}`)
                    .order('timestamp', { ascending: true });
                
                if (error) throw error;
                
                // Formatear los mensajes para el chat
                const formattedMessages = data.map(msg => {
                    const isSent = msg.to_number === states.chatState.userId;
                    return {
                        id: msg.id,
                        text: msg.text || "Media message",
                        time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        types: isSent ? "sent" : "received",
                        date: new Date(msg.timestamp).toLocaleDateString()
                    };
                });
                
                setChatHistory(formattedMessages);
            } catch (err) {
                console.error('Error al cargar historial de chat:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChatHistory();
    }, [states.chatState.userId]);

    // Agrupar mensajes por fecha
    const groupedMessages = () => {
        const groups = {};
        
        // Agrupar mensajes por fecha
        chatHistory.forEach(msg => {
            if (!groups[msg.date]) {
                groups[msg.date] = [];
            }
            groups[msg.date].push(msg);
        });
        
        // Convertir a array para renderizar
        return Object.entries(groups).map(([date, msgs]) => ({
            date,
            messages: msgs
        }));
    };

    // 👇️ scroll to bottom every time messages change
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, chatHistory]);

    return (
        <SimpleBar style={{ height: "100%" }} id="chat_body" className="chat-body">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <ul id="chat_history" className="list-unstyled chat-single-list">
                    {groupedMessages().map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <li className="day-sep">
                                <span>{group.date}</span>
                            </li>
                            {group.messages.map((msg, msgIndex) => (
                                <li className={classNames("media", msg.types)} key={`${groupIndex}-${msgIndex}`}>
                                    {msg.types === "received" && (
                                        <div className="avatar avatar-xs avatar-rounded">
                                            {states.chatState.avatar.type === "img" && (
                                                <Image src={states.chatState.avatar.src} alt="user" className="avatar-img" />
                                            )}
                                            {states.chatState.avatar.type === "init" && (
                                                <div className={`avatar avatar-xs avatar-${states.chatState.avatar.variant} avatar-rounded`}>
                                                    <span className="initial-wrap">{states.chatState.avatar.title}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="media-body">
                                        <div className="msg-box">
                                            <div>
                                                <p>{msg.text}</p>
                                                <span className="chat-time">{msg.time}</span>
                                            </div>
                                            <div className="msg-action">
                                                <Button className="btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret">
                                                    <span className="icon">
                                                        <span className="feather-icon">
                                                            <CornerUpRight />
                                                        </span>
                                                    </span>
                                                </Button>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret">
                                                        <span className="icon">
                                                            <span className="feather-icon">
                                                                <MoreHorizontal />
                                                            </span>
                                                        </span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item href="#forward">Forward</Dropdown.Item>
                                                        <Dropdown.Item href="#copy">Copy</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                    ))}
                    
                    {/* Mensajes nuevos del estado global */}
                    {messages.map((elem, index) => (
                        <li className={classNames("media", (elem.types))} key={`new-${index}`}>
                            {elem.types === "received" && (
                                <div className="avatar avatar-xs avatar-rounded">
                                    {states.chatState.avatar.type === "img" && (
                                        <Image src={states.chatState.avatar.src} alt="user" className="avatar-img" />
                                    )}
                                    {states.chatState.avatar.type === "init" && (
                                        <div className={`avatar avatar-xs avatar-${states.chatState.avatar.variant} avatar-rounded`}>
                                            <span className="initial-wrap">{states.chatState.avatar.title}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="media-body">
                                <div className="msg-box">
                                    <div>
                                        <p>{elem.text}</p>
                                        <span className="chat-time">{elem.time}</span>
                                    </div>
                                    <div className="msg-action">
                                        <Button className="btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret">
                                            <span className="icon">
                                                <span className="feather-icon">
                                                    <CornerUpRight />
                                                </span>
                                            </span>
                                        </Button>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover dropdown-toggle no-caret">
                                                <span className="icon">
                                                    <span className="feather-icon">
                                                        <MoreHorizontal />
                                                    </span>
                                                </span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu align="end">
                                                <Dropdown.Item href="#forward">Forward</Dropdown.Item>
                                                <Dropdown.Item href="#copy">Copy</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div ref={bottomRef} />
        </SimpleBar>
    );
};

export default ChatBody;