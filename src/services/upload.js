import api from './api'; // Ajuste o caminho conforme necessário

export const uploadFotoPorEmail = async (email, imagem) => {
  const formData = new FormData();
  
  // Adiciona a imagem (obrigatório)
  formData.append('foto', {
    uri: imagem.uri,
    name: `foto_${Date.now()}.jpg`, // Nome do arquivo
    type: 'image/jpeg', // Tipo MIME
  });

  // Adiciona o email no body (como parâmetro adicional)
  formData.append('email', email);

  try {
    const response = await api.post(
      `/clientes/${email}/upload-foto`, // Usa email na URL
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