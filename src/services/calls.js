import api from './api';


export const getUserCalls = async (token) => {
  try {
    if (!token) {
        throw new Error("Token não encontrado!")
    }
    const response = await api.get(`/chamados/cliente/meus`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
  }
};

export const createCall = async (payload) => {
    try {
        const response = await api.post('/chamados', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const getCallStatus = async (id) => {
    try {
        const response = await api.get(`/chamados/${id}`); 
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const cancelCall = async (id) => {
    try {
        const response = await api.patch(`/chamados/${id}/cancelar`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


export const updateCall = async (id, body) => {
    try {
        const response = await api.patch(`/chamados/${id}`, body);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};

export const ratingCall = async (body) => {
    try {
        // CORREÇÃO: A URL não precisa mais do parâmetro 'id'
        // e agora aponta para o endpoint correto.
        const response = await api.post(`/chamados/avaliar`, body);
        return response.data;
    } catch (error) {
        // Lança o erro para que o componente possa tratá-lo no bloco catch.
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


export async function updateExistingAddresses(token) {
  try {
    console.log("Chamando atualização de endereços...");
    const response = await api.put(
      "/chamados/atualizar-enderecos",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    console.log("Endereços atualizados:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar endereços:", error);
    throw error;
  }
}


