import api from './api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/clientes', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}

export const updateUser = async(id,userData) =>{
    try{
        const response = await api.put(`/clientes/${id}`, userData);
        return response.data
    } catch (error){
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor'
    }
}

export const createVehicle = async(vehicleData)=>{
    try{
        const response = await api.post('/veiculos', vehicleData);
        return response.data;
    } catch(error){
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor'
    }
}

export const getVehicles = async (userId) => {
    try {
        const response = await api.get(`/veiculos/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
}
