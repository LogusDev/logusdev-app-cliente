import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { UserContext } from '../../contexts/UserContext';
import { saveMessage, subscribeToMessages } from '../../services/chatService';
import styles from './styles';
import fotoPerfilGuincheiro from '../../assets/images/driverImage.png';

export default function Chat({ route, navigation }) {
  const { callId, guincheiroInfo } = route.params;
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollViewRef = useRef(null);

  // Carregar mensagens do Firebase e escutar mudanças em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToMessages(callId, (firebaseMessages) => {
      setMessages(firebaseMessages);
      scrollToBottom();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [callId]);

  // Socket para mensagens em tempo real
  useEffect(() => {
    const newSocket = io(api.defaults.baseURL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket conectado no chat:', newSocket.id);
      newSocket.emit('join-call-room', callId);
    });

    newSocket.on('new-message', (messageData) => {
      // As mensagens já são atualizadas pelo Firebase subscription
      // Mas podemos manter isso como backup
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [callId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const messageData = {
      callId: callId,
      message: messageText.trim(),
      senderId: user.id,
      senderName: user.nome || 'Cliente',
      senderType: 'cliente'
    };

    try {
      // Salva no Firebase
      await saveMessage(callId, messageData);
      
      // Também envia via socket para notificação em tempo real
      if (socket) {
        socket.emit('send-message', {
          ...messageData,
          timestamp: new Date().toISOString()
        });
      }
      
      setMessageText('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    return `${dayName}, ${day}`;
  };

  const groupedMessages = messages.reduce((acc, msg, index) => {
    const msgDate = formatDate(msg.timestamp);
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const prevDate = prevMsg ? formatDate(prevMsg.timestamp) : null;

    if (msgDate !== prevDate) {
      acc.push({ type: 'date', date: msgDate });
    }

    acc.push(msg);
    return acc;
  }, []);

  const guincheiroNome = guincheiroInfo?.nome || 'Guincheiro';
  const guincheiroFoto = guincheiroInfo?.foto_url;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#E53935" />
        </TouchableOpacity>
        
        <Image
          source={guincheiroFoto ? { uri: guincheiroFoto } : fotoPerfilGuincheiro}
          style={styles.avatar}
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{guincheiroNome}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      {/* Messages e Input com KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <View key={`date-${index}`} style={styles.dateSeparator}>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              );
            }

            const isMe = item.senderType === 'cliente';
            return (
              <View
                key={`msg-${index}`}
                style={[styles.messageWrapper, isMe ? styles.messageWrapperRight : styles.messageWrapperLeft]}
              >
                <View style={[styles.messageBubble, isMe ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
                  <Text style={[styles.messageText, isMe ? styles.messageTextRight : styles.messageTextLeft]}>
                    {item.message}
                  </Text>
                </View>
                <Text style={[styles.messageTime, isMe ? styles.messageTimeRight : styles.messageTimeLeft]}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input fixo na parte inferior */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color="#1F284E" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#999"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

