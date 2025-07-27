import { useState } from 'react';
import { agriculturalAPI } from '../services/api';

export const useAgriculturalPrediction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const predict = async (formData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await agriculturalAPI.predict(formData);
            setPrediction(response);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setPrediction(null);
        setError(null);
    };

    return {
        predict,
        prediction,
        isLoading,
        error,
        reset,
    };
};
