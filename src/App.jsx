import React, { useState, useRef, useEffect } from 'react';
import './assets/Chat.css';
import './assets/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons';

function Chatbot() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const messageBoxRef = useRef(null);
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        send();
      }
    };

    const messageInput = document.getElementById('message');
    messageInput.addEventListener('keyup', handleKeyUp);

    return () => messageInput.removeEventListener('keyup', handleKeyUp);
  }, []);

  const send = async () => {
    if (running) return;
    if (!message) return;
    setRunning(true);

    // Add the message to the chat area
    addMsg(message);
    console.log("Message added: " + message);
    // Post the message to the API
    try {
      const response = await fetch('https://scripter-node-js-v.onrender.com/createscripter', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Response from API:', responseData);

      // Add a response message to the chat area, if needed
      addResponseMsg(responseData.answer);

    } catch (error) {
      console.error('Error posting message to API:', error);
      // Optionally handle the error, e.g., display an error message in the UI
    }

    setMessage('');
    setRunning(false);
  };

  const addMsg = (msg) => {
    const div = document.createElement('div');
    div.innerHTML = `<span style='flex-grow:1'></span><div class='chat-message-sent'>${msg}</div>`;
    div.className = 'chat-message-div';
    messageBoxRef.current.appendChild(div);
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  };

  const addResponseMsg = (msg) => {
    const div = document.createElement('div');
    div.innerHTML = `<div class='chat-message-received'>${msg}</div>`;
    div.className = 'chat-message-div';
    messageBoxRef.current.appendChild(div);
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  };

  const toggleChatbot = () => {
    setIsChatbotExpanded(!isChatbotExpanded);
    const chatbot = document.getElementById('chatbot');

    if (isChatbotExpanded) {
      chatbot.classList.add('collapsed');
    } else {
      chatbot.classList.remove('collapsed');
      setTimeout(() => addResponseMsg('Hi'), 1000);
    }
  };

  return (
    <div id="chatbot" className={`main-card ${isChatbotExpanded ? '' : 'collapsed'}`}>
      <button id="chatbot_toggle" onClick={toggleChatbot}>
        <FontAwesomeIcon icon={isChatbotExpanded ? faTimes : faCommentDots} />
      </button>
      <div className="main-title icon-container">
        <p>Your Company</p>
      </div>
      <div className="chat-area" ref={messageBoxRef}></div>
      
      <div className="line"></div>
      <div className="input-div">
        <input
          className="input-message"
          type="text"
          id="message"
          placeholder="Type your message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="input-send icon-container" onClick={send}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
