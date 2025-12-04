import React, { createContext, useState, useContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Armazena mensagens por callId: { [callId]: [mensagens] }
  const [messagesByCall, setMessagesByCall] = useState({});

  const addMessage = (callId, message) => {
    setMessagesByCall(prev => {
      const existingMessages = prev[callId] || [];
      // Verificar se a mensagem já existe (evitar duplicatas)
      const exists = existingMessages.some(msg => 
        msg.message === message.message && 
        msg.timestamp === message.timestamp &&
        msg.senderId === message.senderId
      );
      if (exists) return prev;
      
      return {
        ...prev,
        [callId]: [...existingMessages, message]
      };
    });
  };

  const getMessages = (callId) => {
    return messagesByCall[callId] || [];
  };

  const clearMessages = (callId) => {
    setMessagesByCall(prev => {
      const newState = { ...prev };
      delete newState[callId];
      return newState;
    });
  };

  return (
    <ChatContext.Provider value={{ messagesByCall, addMessage, getMessages, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

