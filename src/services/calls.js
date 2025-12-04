import api from './api';


export const getUserCalls = async (id, token) => { // 1. Recebe o 'id' e o 'token'
  try {
    if (!token) { // 2. Agora esta verificação funciona
        throw new Error("Token não encontrado!")
    }

    const response = await api.get(`/chamados/cliente/meus/${id}`, 
        { userId: id }, // 3. O 'body' da requisição
        {
            headers: { // 4. O 'config' com os headers de autenticação
                Authorization: `Bearer ${token}`
            }
        }
    );
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
        const response = await api.post(`/chamados/avaliar`, body);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
    }
};


// export async function updateExistingAddresses(token) {
//   try {
//     console.log("Chamando atualização de endereços...");
//     const response = await api.put(
//       "/chamados/atualizar-enderecos",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );


//     console.log("Endereços atualizados:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Erro ao atualizar endereços:", error);
//     throw error;
//   }
// }


export const CallSearch = async (id) => {
    console.log(`[callSearch] Buscando dados na URL: /chamados/${id}`);
    try {
        const response = await api.get(`/chamados/${id}`);
        console.log('[callSearch] Resposta da API recebida:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('[callSearch] Erro na resposta da API:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else if (error.request) {
            console.error('[callSearch] Nenhuma resposta recebida:', error.request);
        } else {
            console.error('[callSearch] Erro ao configurar a requisição:', error.message);
        }
        console.error('[callSearch] Config do Axios:', error.config);
    
        return null;
    }
};

export const getMessages = async (callId) => {
    try {
        const response = await api.get(`/mensagens/${callId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return [];
    }
};

export async function priceCalc(origem, destino) {
  const response = await api.post("/chamados/calcularPreco", {
    latitude_inicial: origem.lat,
    longitude_inicial: origem.lng,
    latitude_final: destino.lat,
    longitude_final: destino.lng,
  });

  return response.data.preco;
}

// Buscar guincheiros disponíveis para um chamado
export const getAvailableDrivers = async (chamadoId) => {
  try {
    const response = await api.get(`/chamados/${chamadoId}/guincheiros-disponiveis`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
  }
};

// Escolher um guincheiro para o chamado
export const chooseDriver = async (chamadoId, guincheiroId) => {
  try {
    const response = await api.post(`/chamados/${chamadoId}/escolher-guincheiro`, {
      guincheiro_id: guincheiroId
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Erro ao conectar com o servidor';
  }
};