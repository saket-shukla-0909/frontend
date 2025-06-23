// src/components/ChatBox.jsx
import React, { useState, useEffect } from 'react';
import socket from '../socket/socket';

const ChatBox = ({ userId, receiverId }) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId) {
      socket.emit("add-user", userId);
    }

    socket.on("msg-receive", (msg) => {
      setMessages(prev => [...prev, { fromSelf: false, message: msg }]);
    });

    return () => socket.off("msg-receive");
  }, [userId]);

  const sendMessage = () => {
    socket.emit("send-msg", {
      to: receiverId,
      message: messageText,
    });

    setMessages(prev => [...prev, { fromSelf: true, message: messageText }]);
    setMessageText("");
  };

  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} style={{ textAlign: msg.fromSelf ? 'right' : 'left' }}>
          <span>{msg.message}</span>
        </div>
      ))}
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
