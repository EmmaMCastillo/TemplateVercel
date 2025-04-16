import HkAlert from '@/components/@hk-alert/@hk-alert';
import { useGlobalStateContext } from '@/context/GolobalStateProvider';
import { useState, useEffect } from 'react';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { ArrowRight, Share, Smile } from 'react-feather';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';

const ChatFooter = () => {
    const [message, setMessage] = useState('');
    const { states, dispatch } = useGlobalStateContext();
    const { isWhatsAppContact, sendMessageToWhatsApp } = useWhatsAppIntegration();
    const [isWhatsApp, setIsWhatsApp] = useState(false);
    
    // Verificar si el usuario actual es un contacto de WhatsApp
    useEffect(() => {
        if (states.chatState.userId) {
            setIsWhatsApp(isWhatsAppContact(states.chatState.userId));
        }
    }, [states.chatState.userId, isWhatsAppContact]);

    //Get current system time
    const current = new Date();
    const msgTitme = current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    //Send a new messages
    const sendMessage = async () => {
        if (message.length > 0) {
            // Actualizar la UI inmediatamente
            dispatch({ type: "send_msg", msg: { text: message, time: msgTitme, types: "sent" } });
            
            // Si es un contacto de WhatsApp, enviar a través de WhatsApp
            if (isWhatsApp) {
                console.log(`Enviando mensaje de WhatsApp a ${states.chatState.userId}: ${message}`);
                const success = await sendMessageToWhatsApp(message);
                if (!success) {
                    // Mostrar error si falla el envío
                    console.error('Error al enviar mensaje de WhatsApp');
                    // Podríamos mostrar una alerta aquí si queremos
                }
            } else {
                // Comportamiento normal para chats que no son de WhatsApp
                setTimeout(() => {
                    dispatch({ type: "send_msg", msg: { text: "What are you saying?", time: msgTitme, types: "received" } });
                }, 800);
            }
        }
        else {
            alert("Please type something!");
        }
    }
    const handleClick = () => {
        sendMessage();
        setMessage("");
    }
    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            sendMessage();
            setMessage("");
        }
    }


    return (
        <footer className="chat-footer">
            <Dropdown>
                <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret flex-shrink-0">
                    <span className="icon">
                        <span className="feather-icon">
                            <Share />
                        </span>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <div className="d-flex align-items-center">
                            <div className="avatar avatar-icon avatar-xs avatar-soft-primary avatar-rounded me-3">
                                <span className="initial-wrap">
                                    <i className="ri-image-line" />
                                </span>
                            </div>
                            <div>
                                <span className="h6 mb-0">Photo or Video Library</span>
                            </div>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="d-flex align-items-center">
                            <div className="avatar avatar-icon avatar-xs avatar-soft-info avatar-rounded me-3">
                                <span className="initial-wrap">
                                    <i className="ri-file-4-line" />
                                </span>
                            </div>
                            <div>
                                <span className="h6 mb-0">Documents</span>
                            </div>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="d-flex align-items-center">
                            <div className="avatar avatar-icon avatar-xs avatar-soft-success avatar-rounded me-3">
                                <span className="initial-wrap">
                                    <i className="ri-map-pin-line" />
                                </span>
                            </div>
                            <div>
                                <span className="h6 mb-0">Location</span>
                            </div>
                        </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="d-flex align-items-center">
                            <div className="avatar avatar-icon avatar-xs avatar-soft-blue avatar-rounded me-3">
                                <span className="initial-wrap">
                                    <i className="ri-contacts-line" />
                                </span>
                            </div>
                            <div>
                                <span className="h6 mb-0">Contact</span>
                            </div>
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <InputGroup>
                <span className="input-affix-wrapper">
                    <Form.Control type="text" id="input_msg_send_chatapp" name="send-msg" className="input-msg-send rounded-input" placeholder="Type your message..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={onKeyDown} /> {/*onKeyDown={onKeyDown} */}
                    <span className="input-suffix">
                        <Button variant="flush-primary" className="btn-icon btn-rounded btn-send">
                            <span className="icon" onClick={handleClick} >  {/* onClick={handleClick} */}
                                <span className="feather-icon">
                                    <ArrowRight />
                                </span>
                            </span>
                        </Button>
                    </span>
                </span>
            </InputGroup>
            <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover">
                <span className="icon">
                    <span className="feather-icon">
                        <Smile />
                    </span>
                </span>
            </Button>
        </footer>
    )
}

export default ChatFooter;