import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, StatusBar, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFotoPorEmail } from '../../services/upload.js';
import styles from './styles.js';
import Button from '../../components/Button/index.js';
import PhotoPicker from '../../components/PhotoPicker/index.js';
import { registerUser } from '../../services/registerUser.js';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import { createVehicle } from '../../services/registerUser.js';

export default function Register3({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { email, password, name, cpf: unmaskedCpf, phone: unmaskedPhone, cnh_num,anoSelecionado,modeloSelecionado,marcaSelecionada,categoria } = route.params;

  const {login} = useContext(UserContext);

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos acessar suas fotos para fazer o upload');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleUpload = async (imagem) => {
    return await uploadFotoPorEmail(email, imagem);
  };

  // ...existing code...

const handleSignIn = async () => {
  if (!selectedImage) {
    Alert.alert('Selecione uma imagem antes de cadastrar!');
    return;
  }
  setIsLoading(true);
  try {
    const uploadResult = await handleUpload(selectedImage);
    console.log('Resultado do upload:', uploadResult);

    if (!uploadResult || !uploadResult.success || !uploadResult.data?.fotoUrl) {
      Alert.alert('Erro no Upload', uploadResult?.data?.message || 'Falha ao enviar a foto. Tente novamente.');
      setIsLoading(false);
      return;
    }

    const userData = {
      nome: name,
      cpf: unmaskedCpf,
      telefone: unmaskedPhone,
      email,
      senha: password,
      cnh_num,
      foto_url: uploadResult.data.fotoUrl
    };
    const userRes = await registerUser(userData);
    console.log('Usuário cadastrado:', userRes);

    const id = userRes.id;

    /*const loginResult = await login({ email, senha: password });
    console.log('Login result:', loginResult);

    const id = loginResult.id;
    console.log('ID do usuário:', id);*/

    const ano = anoSelecionado.slice(0, -2)

    const vehicleData = {

      placa: "1234567", 
      marca: marcaSelecionada,
      modelo: modeloSelecionado,
      ano_fabricacao: ano,
      cliente_id: id
    };

    const vehicleRes = await createVehicle(vehicleData);
    console.log('Veículo cadastrado:', vehicleRes);

    alert('Cadastro realizado com sucesso!');
    navigation.navigate('Login', {
      fotoUrl: uploadResult.data.fotoUrl
    });

  } catch (error) {
    console.error('Erro ao cadastrar', error);
    Alert.alert('Erro', error.message || 'Erro ao cadastrar');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <StatusBar barStyle={'light-content'} />
          <Image style={styles.logo} source={require('../../assets/images/logoG.png')} />
          <Image source={require('../../assets/images/register.png')} />
          <Text style={styles.texto}>Verificação de documentos</Text>
          <Text style={styles.texto2}>
            Envie as imagens solicitadas abaixo para validar sua conta GuinchAqui.
          </Text>
          <PhotoPicker onPress={handleSelectImage} name={'albums-outline'} />
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 120, height: 120, alignSelf: 'center', marginVertical: 10, borderRadius: 10 }}
            />
          )}
          <Button text={'Cadastrar'} onPress={handleSignIn} />
        </>
      )}
    </View>
  );
}