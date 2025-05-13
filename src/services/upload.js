import api from './api'; 

export const uploadFotoPorEmail = async (email, imagem) => {
  const formData = new FormData();
  
  
  formData.append('foto', {
    uri: imagem.uri,
    name: `foto_${Date.now()}.jpg`, 
    type: 'image/jpeg', 
  });

  
  formData.append('email', email);

  try {
    const response = await api.post(
      `/clientes/${email}/upload-foto`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Erro ao enviar foto');
  }
};