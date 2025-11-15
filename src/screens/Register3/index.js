import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, StatusBar, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFotoPorEmail } from '../../services/upload.js';
import styles from './styles.js';
import Button from '../../components/Button/index.js';
import PhotoPicker from '../../components/PhotoPicker/index.js';
import { registerUser } from '../../services/services.js';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import { createVehicle } from '../../services/services.js';
import Logo from '../../components/Logo/index.js';
import Toast from 'react-native-toast-message';

export default function Register3({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { email, password, name, cpf: unmaskedCpf, phone: unmaskedPhone, cnh_num,anoSelecionado,modeloSelecionado,marcaSelecionada, categoria,cor } = route.params;

  const {login} = useContext(UserContext);

  console.log(categoria);


  const successAlert = () => {
          Toast.show({
              type:'success',
              text1:'Usuário cadastrado com sucesso',
              position:'top',
              visibilityTime:1500,
          })
      }

  const errorAlert = () => {
          Toast.show({
              type:'error',
              text1:'Erro ao cadastrar',
              text2:'Verifique suas credenciais e tente novamente',
              position:'bottom',
              visibilityTime:1500,
              bottomOffset:300
          })
      }

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
        aspect: [1, 1],
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
      cnh_num: "ABC12345671",
      foto_url: uploadResult.data.fotoUrl
    };
    const userRes = await registerUser(userData);
    console.log('Usuário cadastrado:', userRes);

    const id = userRes.id;

    const ano = anoSelecionado.slice(0, -2)

    const vehicleData = {
      placa: "1234567", 
      marca: marcaSelecionada,
      modelo: modeloSelecionado,
      ano_fabricacao: ano,
      categoria: categoria,
      cor: cor,
      cliente_id: id
    };

    console.log(id);

    const vehicleRes = await createVehicle(vehicleData);
    console.log('Veículo cadastrado:', vehicleRes);

    successAlert();
    navigation.navigate('Login', {
      fotoUrl: uploadResult.data.fotoUrl
    });

  } catch (error) {
    console.error('Erro ao cadastrar', error);
    errorAlert();
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>
          <StatusBar barStyle={'light-content'} />
          <Logo/>
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
          <Button text={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : "Cadastrar"} onPress={handleSignIn} />
    </View>
  );
}