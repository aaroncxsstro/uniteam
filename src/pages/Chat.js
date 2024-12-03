import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import './Chat.css';
import Nav from '../components/Nav';

function Chat() {
  const [contacts] = useState([
    { name: 'Joao Pedro Dias', id: 1 },
    { name: 'Antonio Manuel Amaro Calheiros', id: 2 },
    { name: 'Ana Paula do Canto Lopes', id: 3 },
    { name: 'Anabela Maria Bello', id: 4 },
    { name: 'Sara Rute Monteiro', id: 5 },
  ]);
  
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  
  const [messages, setMessages] = useState(() => {
    const savedMessages = Cookies.get('messages');
    console.log('Saved Messages:', savedMessages); // Verifica el contenido de las cookies
    try {
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Error al parsear los mensajes:', error);
      return [];
    }
  });
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);  // Referencia al contenedor de los mensajes

  useEffect(() => {
    Cookies.set('messages', JSON.stringify(messages), { expires: 7 });
  }, [messages]);

  useEffect(() => {
    // Hace scroll hacia el final del contenedor de mensajes cuando cambian
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      sender: 'Tú',
      recipient: selectedContact.name,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessages = () => {
    return messages
      .filter((msg) => msg.recipient === selectedContact?.name || msg.sender === selectedContact?.name)
      .map((msg, index) => (
        <div key={index} className={`message ${msg.sender === 'Tú' ? 'sent' : 'received'}`}>
          <p><strong>{msg.sender}</strong>: {msg.message}</p>
          <span className="timestamp">{msg.timestamp}</span>
        </div>
      ));
  };

  return (
    <div>
      <Nav />
    
      <div className="chat-container">
        <div className="contact-list">
          <h3>Contactos</h3>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} onClick={() => handleContactClick(contact)}>
                {contact.name}
              </li>
            ))}
          </ul>
        </div>

        {selectedContact && (
          <div className="chat-window">
            <h3>Chat con {selectedContact.name}</h3>
            <div className="messages">
              {renderMessages()}
              <div ref={messagesEndRef} /> {/* Este es el punto de referencia para el scroll */}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
