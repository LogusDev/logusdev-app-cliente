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
}
