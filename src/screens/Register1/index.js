import {View,Text,Image, StatusBar} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styles from './styles.js';
import TextInputComponent from '../../components/TextInput/index.js';
import Button from '../../components/Button/index.js';
import {mask} from 'react-native-mask-text';
import unmaskFunc from '../../utils/mask.js';


export default function Register1({route}){

    const [name ,setName] = useState("");
    const [cpf ,setCpf] = useState("");
    const [phone ,setPhone] = useState("");

    const navigation = useNavigation();

    const {email,password} = route.params;

    const handleCpfChange = (text) => {
        const masked = mask(text, '999.999.999-99');
        setCpf(masked);
    }
    const handleCelChange = (text) => {
        const masked = mask(text, '(99) 99999-9999');
        setPhone(masked);
    }

    const handleSignIn = async () => {

        if (!name || !cpf || !phone) {
            alert('Preencha todos os campos!');
            return;
        }

        const unmaskedCpf = unmaskFunc(cpf);
        const unmaskedPhone = unmaskFunc(phone);

        const cnh_num = "ABC1234567"
        

        navigation.navigate('Register2', {email,password,name,cpf: unmaskedCpf,phone: unmaskedPhone,cnh_num})
    }


    return(
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            <Image source={require('../../assets/images/logoG.png')} />
            <Image source={require('../../assets/images/register.png')} />
            <Text style={styles.texto}>Dados Pessoais</Text>
            <TextInputComponent placeholder="Nome completo..." name="person-outline" value={name} onChangeText={setName} />
            <TextInputComponent placeholder="CPF..." name="document-text-outline" secureTextEntry={false}  value={cpf} onChangeText={handleCpfChange} keyboardType='numeric' />
            <TextInputComponent placeholder="Número do Celular..." name="call-outline" secureTextEntry={false} onChangeText={handleCelChange} value={phone} keyboardType='numeric' />
            
            <Button text={'Proximo'} onPress={handleSignIn}  />
        </View>
    )
}