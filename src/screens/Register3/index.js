import React, { useState } from 'react';
import { View, ActivityIndicator, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { uploadFotoPorEmail } from '../../services/upload.js';
import styles from './styles.js';
import Button from '../../components/Button/index.js';
import PhotoPicker from '../../components/PhotoPicker/index.js';
import { registerUser } from '../../services/services.js';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import { createVehicle } from '../../services/services.js';
import Logo from '../../components/Logo/index.js';

export default function Register3({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { email, password, name, cpf: unmaskedCpf, phone: unmaskedPhone, cnh_num,anoSelecionado,modeloSelecionado,marcaSelecionada, categoria,cor, placa } = route.params;

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
        Toast.show({
          type: 'error',
          text1: 'Permissão necessária',
          text2: 'Precisamos acessar suas fotos para fazer o upload',
          position: 'bottom',
          visibilityTime: 2000,
        });
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
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível selecionar a imagem',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const handleUpload = async (imagem) => {
    return await uploadFotoPorEmail(email, imagem);
  };


const handleSignIn = async () => {
  if (!selectedImage) {
    Toast.show({
      type: 'error',
      text1: 'Atenção',
      text2: 'Selecione uma imagem antes de cadastrar!',
      position: 'bottom',
      visibilityTime: 2000,
    });
    return;
  }
  setIsLoading(true);
  
  let uploadResult = null;
  let hasUploadError = false;
  
  try {
    // Primeiro, tenta fazer o upload da foto
    uploadResult = await handleUpload(selectedImage);
    console.log('Resultado do upload:', uploadResult);
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    hasUploadError = true;
    Toast.show({
      type: 'error',
      text1: 'Erro no Upload',
      text2: error?.message || 'Não foi possível enviar a foto. Tente novamente.',
      position: 'bottom',
      visibilityTime: 2000,
    });
    setIsLoading(false);
    return;
  }
  
  try {

    // Validação rigorosa do resultado do upload
    if (!uploadResult) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Upload',
        text2: 'Não foi possível realizar o upload da foto. Tente novamente.',
        position: 'bottom',
        visibilityTime: 2000,
      });
      setIsLoading(false);
      return;
    }

    if (!uploadResult.success) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Upload',
        text2: uploadResult?.data?.message || 'Falha ao enviar a foto. Tente novamente.',
        position: 'bottom',
        visibilityTime: 2000,
      });
      setIsLoading(false);
      return;
    }

    if (!uploadResult.data || !uploadResult.data.fotoUrl) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Upload',
        text2: 'Foto não foi enviada corretamente. Por favor, tente novamente.',
        position: 'bottom',
        visibilityTime: 2000,
      });
      setIsLoading(false);
      return;
    }

    // Só continua com o cadastro se o upload foi bem-sucedido e tem fotoUrl
    const fotoUrl = uploadResult.data.fotoUrl;
    
    if (!fotoUrl || fotoUrl.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Erro no Upload',
        text2: 'URL da foto inválida. Por favor, selecione e envie a foto novamente.',
        position: 'bottom',
        visibilityTime: 2000,
      });
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
      foto_url: fotoUrl
    };
    
    const userRes = await registerUser(userData);
    console.log('Usuário cadastrado:', userRes);

    if (!userRes || !userRes.id) {
      throw new Error('Falha ao cadastrar usuário: resposta inválida');
    }

    const id = userRes.id;

    const ano = anoSelecionado.slice(0, -2)

    const vehicleData = {
      placa: placa || "1234567", 
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
      fotoUrl: fotoUrl
    });

  } catch (error) {
    console.error('Erro ao cadastrar', error);
    // Se o upload falhou ou não foi completado, não deve cadastrar
    if (!uploadResult || !uploadResult.success || !uploadResult.data?.fotoUrl) {
      Toast.show({
        type: 'error',
        text1: 'Erro no Upload',
        text2: 'Não foi possível enviar a foto. O cadastro foi cancelado.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } else {
      errorAlert();
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>
          <StatusBar barStyle={'light-content'} />
          <Logo/>
          <Image source={require('../../assets/images/register.png')} />
          <Text style={styles.texto}>Cadastro da foto de perfil</Text>
          <Text style={styles.texto2}>
          Envie as imagens solicitadas abaixo para validar sua conta GuinchAqui.          </Text>
          <PhotoPicker onPress={handleSelectImage} name={'person-outline'} label={'Foto do Rosto'} />
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 120, height: 120, alignSelf: 'center', marginVertical: 10, borderRadius: 10 }}
            />
          )}
          <View style={{ width: '100%', alignItems: 'center' }}  >
            <Button text={isLoading ? <ActivityIndicator size="small" color="#ffffff" /> : "Criar sua conta"} onPress={handleSignIn} />

          </View>
    </View>
  );
}