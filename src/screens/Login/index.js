import { View,Text,Image,StatusBar,Alert, TouchableOpacity,KeyboardAvoidingView,Platform } from "react-native";
import {useState} from "react";
import styles from "./styles.js";
import TextInputComponent from "../../components/TextInput/index.js";
import Button from "../../components/Button/index.js";
import Logo from "../../components/Logo"
import { useNavigation } from "@react-navigation/native";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import socket, { connectSocket } from "../../services/socket.js";


export default function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigation = useNavigation();

    const {login} = useContext(UserContext);

    function setupSocketListeners() {
        if (!socket) return;

        socket.on('connect', () => {
            console.log("Socket conectado!");
        });

        socket.on("rideStatusUpdate", (data) => {
            console.log("Atualização de status da corrida:", data);
        })

        socket.on("notification", (data) => {
            console.log("Nova notificação recebida:", data);
        })

        socket.on("chatMessage", (msg) => {
            console.log("Nova mensagem de chat recebida:", msg);
        });

        socket.on("newRide", (ride) => {
            console.log("Nova corrida recebida:", ride)
        })

        socket.on('disconnect', () => {
            console.log("Socket desconectado!");
        })
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Credenciais inválidas', 'Por favor, preencha todos os campos.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
                { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ]);
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

        try {
            console.log('Tentando fazer login com:', {email, password});
            const response = await login({email,senha:password});
            alert('Login efetuado com sucesso!');
            connectSocket(response.token);
            setupSocketListeners();
            navigation.navigate('MainHome');
        } catch (error) {
            alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');}
    }
    
    return(
        <KeyboardAvoidingView behavior="padding"
         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
         style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={'#FFFFFF'}/>
            {/*<Image source={require("../../assets/images/logoG.png")} style={styles.logo}/>*/}
            <Logo />
            <Image source={require("../../assets/images/businessdeal.png")} />
            <Text style={styles.texto}>Acessar minha conta</Text>
            <TextInputComponent
             label={"Email"}
             placeholder={"Digite seu email..."}
             value={email}
             onChangeText={setEmail}
             keyboardType={"email-address"}
             secureTextEntry={false}
             name={"mail-outline"}
            />
            <TextInputComponent
             
             placeholder={"Digite sua senha..."}
             value={password}
             onChangeText={setPassword}
             secureTextEntry={true}
             name={"lock-closed-outline"}
            />
            <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
                <Text style={{color:"#929292",fontSize:13}}>Não tem uma conta? <Text style={{color:'#1F284E', fontWeight:'bold',fontFamily:'Poppins-Regular'}}>Crie uma</Text></Text>
            </TouchableOpacity>
            <Button text={"Login"} onPress={handleLogin}/>
        </KeyboardAvoidingView>
    )  
}