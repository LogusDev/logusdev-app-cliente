import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button/index.js';
import { UserContext } from '../../contexts/UserContext.js';
import {updateUser} from '../../services/services.js';
import {mask} from 'react-native-mask-text';
import unmaskFunc from '../../utils/mask.js';

export default function EditProfile() {
    const { user } = useContext(UserContext);
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    

    function maskPhone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length > 10) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    const handleCelChange = (text) => {
        const masked = mask(text, '(99) 99999-9999');
        setTelefone(masked);
    }

    const handleUpdate = async () =>{

        const unmaskedPhone = unmaskFunc(telefone);

        const id = user.id

        if(!telefone || !email){
            Alert.alert('Erro','Credenciais Invalidas, preencha os campos')
            return
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('E-mail inválido!');
            return;
        }

        try{
            const userData = {
                telefone: unmaskedPhone,
                email
            }
            await updateUser(id,userData)
            alert('Credenciais Atualizadas com sucesso')
        } catch (error){
            console.error('Erro ao atualizar', error);
            Alert.alert('Erro', error.message || 'Erro ao atualizar');
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <StatusBar barStyle='light-content' backgroundColor="#FFFFFF" />
                    <View style={styles.viewTitle}>
                        <Text style={styles.title}>Editar Perfil</Text>
                    </View>
                    <Image
                        source={{ uri: user.foto_url }}
                        style={styles.avatar}
                    />
                    <TextInput
                        size={25}
                        style={styles.textInput}
                        value={user.nome}
                        name={'person-circle-outline'}
                        keyboardType={'none'}
                        readOnly={true}
                    />
                    <TextInput
                        size={25}
                        style={styles.textInputMail}
                        placeholder={user.email}
                        value={email}
                        onChangeText={setEmail}
                        name={'mail-outline'}
                        keyboardType={'none'}
                        readOnly={false}
                    />
                    <TextInput
                        size={25}
                        style={styles.textInputPhone}
                        placeholder={maskPhone(user.telefone)}
                        value={telefone}
                        name={'call-outline'}
                        keyboardType={'numeric'}
                        readOnly={false}
                        onChangeText={handleCelChange}
                    />
                    <Button
                        text={'Confirmar'}
                        onPress={handleUpdate}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}