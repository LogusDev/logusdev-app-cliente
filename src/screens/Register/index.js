import {
  ScrollView, // Importe o ScrollView
  Text,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native';
import { useState } from 'react';
// ... outras importações
import styles from './styles.js';
import TextInputComponent from '../../components/TextInput/index.js';
import Button from '../../components/Button/index.js';
import Logo from '../../components/Logo';

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  function handleRegister() {
    // ... sua lógica de validação continua a mesma
    if (email === "" || password === "" || passwordRepeat === "") {
      alert("Preencha todos os campos!");
      return;
    }
    if (password !== passwordRepeat) {
      alert("As senhas não coincidem!");
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('E-mail inválido!');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    navigation.navigate('Register1', { email, password });
  }

  return (
    <KeyboardAvoidingView
      // É uma boa prática usar 'padding' para iOS e 'height' para Android
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container} // style={ {flex: 1} } é essencial aqui
    >
      <StatusBar barStyle={'light-content'} backgroundColor={'#ffffff'} />
      
      {/* Envolva todo o conteúdo rolável em um ScrollView */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} // Estilo para o conteúdo interno
        keyboardShouldPersistTaps="handled" // Ajuda a fechar o teclado ao tocar fora
      >
        <Logo />
        <Image source={require('../../assets/images/register.png')} />
        <Text style={styles.texto}>Criar minha conta</Text>
        <TextInputComponent placeholder="Email..." name="mail-outline" value={email} onChangeText={setEmail} />
        <TextInputComponent placeholder="Senha..." name="lock-closed-outline" secureTextEntry={true} value={password} onChangeText={setPassword} />
        <TextInputComponent placeholder="Repita sua senha..." name="lock-closed-outline" secureTextEntry={true} onChangeText={setPasswordRepeat} value={passwordRepeat} />
        <Button text={'Próximo'} onPress={handleRegister} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}