import api from './api';

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
        const response = await api.post(`/chamados/avaliar`, body);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}

export async function priceCalc(origem, destino) {
  const response = await api.post("/chamados/calcularPreco", {
    latitude_inicial: origem.lat,
    longitude_inicial: origem.lng,
    latitude_final: destino.lat,
    longitude_final: destino.lng,
  });

  return response.data.preco;
}