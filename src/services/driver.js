// No seu arquivo de serviços, provavelmente 'src/services/driver.js'

// CORREÇÃO: Removido as chaves {} para importar o 'export default' corretamente
import api from './api'; 

export const driverSearch = async (id) => {
    // Log para confirmar qual URL estamos chamando
    console.log(`[driverSearch] Buscando dados na URL: /chamados/obter/${id}`);
    
    try {
        const response = await api.get(`/chamados/obter/${id}`);
        // Log para ver a resposta completa antes de retornar
        console.log('[driverSearch] Resposta da API recebida:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        // --- LOG DE ERRO DETALHADO ---
        // Isso vai nos mostrar o erro completo que o Axios está recebendo
        if (error.response) {
            // O servidor respondeu com um status de erro (4xx, 5xx)
            console.error('[driverSearch] Erro na resposta da API:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            console.error('[driverSearch] Nenhuma resposta recebida:', error.request);
        } else {
            // Um erro ocorreu ao configurar a requisição
            console.error('[driverSearch] Erro ao configurar a requisição:', error.message);
        }
        console.error('[driverSearch] Config do Axios:', error.config);
        
        // Retorna null para que o resto do app continue funcionando como antes
        return null;
    }
};
