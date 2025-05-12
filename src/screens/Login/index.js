import { View,Text,Image,StatusBar,Alert, TouchableOpacity } from "react-native";
import {useState} from "react";
import styles from "./styles.js";
import TextInputComponent from "../../components/TextInput/index.js";
import Button from "../../components/Button/index.js";
import { useNavigation } from "@react-navigation/native";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';


export default function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigation = useNavigation();

    const {login} = useContext(UserContext);

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
            navigation.navigate('MainHome');
        } catch (error) {
            alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');}
    }
    
    return(
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={'black'}/>
            <Image source={require("../../assets/images/logoG.png")} style={styles.logo}/>
            <Image source={require("../../assets/images/businessdeal.png")} />
            <Text style={styles.texto}>Acessar minha conta</Text>
            <TextInputComponent
             label={"Email"}
             placeholder={"Digite seu email"}
             value={email}
             onChangeText={setEmail}
             secureTextEntry={false}
             name={"mail-outline"}
            />
            <TextInputComponent
             label={"Senha"}
             placeholder={"Digite sua senha"}
             value={password}
             onChangeText={setPassword}
             secureTextEntry={true}
             name={"lock-closed-outline"}
            />
            <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
                <Text style={{color:"#929292",fontSize:13}}>Não tem uma conta? <Text style={{color:'#1F284E', fontWeight:'bold',fontFamily:'Poppins-Regular'}}>Crie uma</Text></Text>
            </TouchableOpacity>
            <Button text={"Login"} onPress={handleLogin}/>
        </View>
    )    
}