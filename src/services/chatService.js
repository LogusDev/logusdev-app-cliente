import db from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';

export const saveMessage = async (callId, messageData) => {
  try {
    const chatDocRef = doc(db, 'chats', callId.toString());
    const messagesRef = collection(chatDocRef, 'messages');
    await addDoc(messagesRef, {
      ...messageData,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao salvar mensagem no Firebase:', error);
    throw error;
  }
};

export const subscribeToMessages = (callId, callback) => {
  try {
    const chatDocRef = doc(db, 'chats', callId.toString());
    const messagesRef = collection(chatDocRef, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate?.();
        return {
          id: doc.id,
          ...data,
          timestamp: timestamp ? timestamp.toISOString() : (data.timestamp || new Date().toISOString())
        };
      });
      callback(messages);
    }, (error) => {
      console.error('Erro ao escutar mensagens:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao criar subscription de mensagens:', error);
    return () => {};
  }
};

