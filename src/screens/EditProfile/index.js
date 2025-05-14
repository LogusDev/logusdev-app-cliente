import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './styles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button/index.js';
import { UserContext } from '../../contexts/UserContext.js';

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
                        value={user.email}
                        name={'mail-outline'}
                        keyboardType={'none'}
                        readOnly={true}
                    />
                    <TextInput
                        size={25}
                        style={styles.textInputPhone}
                        value={maskPhone(user.telefone)}
                        name={'call-outline'}
                        keyboardType={'none'}
                        readOnly={false}
                        onChangeText={setTelefone}
                    />
                    <Button
                        text={'Confirmar'}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}