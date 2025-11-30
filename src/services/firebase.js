import 'react-native-get-random-values';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlJ7HmLwxSpGveRsHFHSyl-EwgTxD8sck",
  authDomain: "app-libri-mateus.firebaseapp.com",
  projectId: "app-libri-mateus",
  storageBucket: "app-libri-mateus.firebasestorage.app",
  messagingSenderId: "371304207533",
  appId: "1:371304207533:web:9d0f9527577bc84517e224",
  measurementId: "G-JD4VQLK8EQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

