// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.34.36:3000/api'
});

// Interceptor para adicionar token automaticamente nas requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Serviço de Autenticação
export const authService = {
    login: async (email, password) => {
        try {
            console.log('Dados de login enviados:', { email });
            const response = await api.post('/auth/login', { email, password });
            console.log('Resposta do login:', response.data);
            // No authService após o login bem sucedido
            await AsyncStorage.setItem('userToken', response.data.token);
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

            if (!response.data || !response.data.user) {
                throw new Error('Resposta inválida do servidor');
            }

            // Guardar o token no AsyncStorage
            await AsyncStorage.setItem('userToken', response.data.token);

            return response.data;
        } catch (error) {
            console.log('Erro no login:', error);
            if (error.response) {
                console.log('Erro do servidor:', error.response.data);
            }
            throw error.response?.data || { message: error.message || 'Erro ao fazer login' };
        }
    },

    register: async (userData) => {
        try {
            console.log('Dados enviados para API:', userData);
            const response = await api.post('/auth/register', userData);

            if (!response.data || !response.data.user) {
                throw new Error('Resposta inválida do servidor');
            }

            // Guardar o token caso retorne no registro
            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
            }

            console.log('Resposta do servidor:', response.data);
            return response.data;
        } catch (error) {
            console.log('Erro completo:', error);
            if (error.response) {
                console.log('Dados do erro:', error.response.data);
                console.log('Status:', error.response.status);
            }
            throw error.response?.data || { message: error.message };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await api.post('/auth/logout'); // Logout no backend
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }
};

// Serviço de gerenciamento de serviços
export const serviceService = {

    getServices: async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const user = userData ? JSON.parse(userData) : null;

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            console.log('Enviando requisição com hairdresserId:', user.id);
            const response = await api.get(`/services?hairdresserId=${user.id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            throw error.response?.data || error;
        }
    },

    getServicesActive: async () => {
        try {
            // Buscar o token
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.get('/services', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Resposta dos serviços:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);

            if (error.response?.status === 403) {
                throw new Error('Acesso não autorizado');
            }
            throw error.response?.data || error;
        }
    },

    // No serviceService.js, atualize o método createService:
    createService: async (serviceData) => {
        try {
            // Buscar dados do usuário
            const userData = await AsyncStorage.getItem('userData');
            const user = JSON.parse(userData);

            // Adicionar o ID do cabeleireiro aos dados do serviço
            const serviceWithHairdrессerId = {
                ...serviceData,
                hairdresser_id: user.id // Adiciona o ID do cabeleireiro
            };

            const response = await api.post('/services', serviceWithHairdrессerId);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            throw error.response?.data || error;
        }
    },

    updateService: async (id, serviceData) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.put(`/services/${id}`, serviceData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            throw error.response?.data || error;
        }
    },

    updateServiceStatus: async (id, active) => {
        try {
            const response = await api.patch(`/services/${id}/status`, { active });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            throw error.response?.data || error;
        }
    },

    deleteService: async (id) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await api.delete(`/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            throw error.response?.data || error.message;
        }
    },

    getHairdressers: async () => {
        try {
            const response = await api.get('/users?role=hairdresser');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar cabeleireiros:', error);
            throw error.response?.data || error;
        }
    },

    getHairdresserDetails: async (id) => {
        try {
            const [hairdresser, services] = await Promise.all([
                api.get(`/users/${id}`),
                api.get(`/services/by-hairdresser?hairdresserId=${id}`)

            ]);

            return {
                ...hairdresser.data,
                services: services.data
            };
        } catch (error) {
            console.error('Erro ao buscar detalhes do cabeleireiro:', error);
            throw error.response?.data || error;
        }
    }
};

export const appointmentService = {
    createAppointment: async (appointmentData) => {
        try {
            // Buscar dados do usuário logado
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                throw new Error('Usuário não autenticado');
            }
            
            const user = JSON.parse(userData);
            
            // Adicionar o client_id aos dados do agendamento
            const completeAppointmentData = {
                ...appointmentData,
                client_id: user.id
            };

            console.log('Dados do agendamento:', completeAppointmentData);
            
            const response = await api.post('/appointments', completeAppointmentData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            throw error.response?.data || error;
        }
    },

    updateStatus: async (appointmentId, status) => {
        try {
          const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
          return response.data;
        } catch (error) {
          console.error('Erro ao atualizar status:', error);
          throw error.response?.data || error;
        }
      }
};

// Adicionar ao arquivo src/services/api.js
export const hairdresserService = {
    getAllHairdressers: async () => {
      try {
        const response = await api.get('/users?role=hairdresser');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar cabeleireiros:', error);
        throw error;
      }
    },

    getHairdresserDetails: async (id) => {
        try {
            // Buscar dados do cabeleireiro e seus serviços separadamente
            const [hairdresserResponse, servicesResponse] = await Promise.all([
                api.get(`/users/${id}`),
                api.get(`/services/by-hairdresser?hairdresserId=${id}`)
            ]);

            // Log para debug
            console.log('Dados do cabeleireiro:', hairdresserResponse.data);
            console.log('Serviços do cabeleireiro:', servicesResponse.data);

            return {
                ...hairdresserResponse.data,
                services: servicesResponse.data
            };
        } catch (error) {
            console.error('Erro ao buscar detalhes:', error);
            if (error.response) {
                console.error('Resposta do erro:', error.response.data);
            }
            throw error;
        }
    }

  };


export default api;
