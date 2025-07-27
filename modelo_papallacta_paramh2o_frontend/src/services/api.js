    import axios from 'axios';
import { demoPredictionResponse } from '../utils/demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const agriculturalAPI = {
    predict: async (data) => {
        try {
            const response = await apiClient.post('/predict', data);
            return response.data;
        } catch (error) {
            // For development/demo purposes, return mock data if API is not available
            if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
                console.warn('API not available, using mock data for demonstration');

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Return mock response with user's input data
                return {
                    ...demoPredictionResponse,
                    weather_data: {
                        ...demoPredictionResponse.weather_data,
                        date: data.date,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    }
                };
            }

            throw new Error(error.response?.data?.message || 'Error al obtener predicción');
        }
    },
};

export default apiClient;
