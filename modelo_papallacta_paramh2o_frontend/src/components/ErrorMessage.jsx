import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ error, onRetry, onReset }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>

                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Error al obtener la predicción
                </h3>

                <p className="text-gray-600 mb-6">
                    {error || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
                </p>

                <div className="flex justify-center space-x-4">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center px-6 py-3 bg-agricultural-green text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                        </button>
                    )}

                    {onReset && (
                        <button
                            onClick={onReset}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Nueva Consulta
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
