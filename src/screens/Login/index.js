import { View,Text,Image,StatusBar,Alert, TouchableOpacity,KeyboardAvoidingView,Platform, ActivityIndicator } from "react-native";
import {useState, useTransition} from "react";
import styles from "./styles.js";
import TextInputComponent from "../../components/TextInput/index.js";
import Button from "../../components/Button/index.js";
import Logo from "../../components/Logo"
import { useNavigation } from "@react-navigation/native";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import Toast from 'react-native-toast-message'


export default function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)

    const {login} = useContext(UserContext);

    const errorAlert = () => {
        Toast.show({
            type:'error',
            text1:'Erro ao efetuar login',
            text2:'Verifique suas credenciais e tente novamente',
            position:'bottom',
            visibilityTime:1500,
            bottomOffset:300
        })
    }

    const successAlert = () => {
        Toast.show({
            type:'success',
            text1:'Login efetuado com sucesso',
            text2:'Navegando para a próxima tela',
            position:'top',
            visibilityTime:1500,
        })
    }

    const handleLogin = async () => {
        if (!email || !password) {
            errorAlert();
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
        if (isLoading) return;
        setIsLoading(true);
        try {
            console.log('Tentando fazer login com:', {email, password});
            const response = await login({email,senha:password});
            successAlert();
            setTimeout(()=>{
                navigation.navigate('MainHome');
            },1500)

        } catch (error) {
            errorAlert();
        } finally{
            setIsLoading(false)
        }
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
            <Button text={isLoading ? <ActivityIndicator color="#fff" /> : 'Login'} onPress={handleLogin}/>
        </KeyboardAvoidingView>
    )  
}