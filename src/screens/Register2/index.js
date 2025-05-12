import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFotoPorEmail } from '../../services/upload';
import styles from './styles';
import Button from '../../components/Button';

const Register2 = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { email } = route.params;

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
        await handleUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleUpload = async (imagem) => {
    setIsLoading(true);
    try {
      const uploadResult = await uploadFotoPorEmail(email, imagem);
      
      if (uploadResult.success) {
        Alert.alert('Sucesso', uploadResult.data.message || 'Foto enviada com sucesso!', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login', {
              fotoUrl: uploadResult.data.fotoUrl
            })
          }
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Erro no Upload', 
        error.message || 'Falha ao enviar a foto. Tente novamente.'
      );
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
        <TouchableOpacity
        />
        <Button 
          title="Selecionar Foto" 
          onPress={handleSelectImage} 
          disabled={isLoading}
        />
      </>
    )}
  </View>
  );
};

export default Register2;