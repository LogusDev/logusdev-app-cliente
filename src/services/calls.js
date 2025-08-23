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
        const response = await api.get(`/chamados/${id}`); // alterado: endpoint padrão
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