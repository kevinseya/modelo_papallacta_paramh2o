import React from 'react';
import { Loader2, CloudSun, Sprout } from 'lucide-react';

const LoadingSpinner = ({ message = 'Procesando predicción...' }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-agricultural-green/10">
                        <Loader2 className="h-10 w-10 text-agricultural-green animate-spin" />
                    </div>

                    {/* Floating icons animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CloudSun className="h-6 w-6 text-sky-soft absolute animate-bounce" style={{ animationDelay: '0s' }} />
                        <Sprout className="h-5 w-5 text-agricultural-green absolute animate-bounce" style={{ animationDelay: '0.5s' }} />
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Analizando datos meteorológicos
                </h3>

                <p className="text-gray-600 mb-4">
                    {message}
                </p>

                <div className="bg-light-bg rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-agricultural-green rounded-full animate-pulse"></div>
                        <span>Procesando ubicación y fecha</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                        <div className="w-2 h-2 bg-agricultural-green rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span>Obteniendo datos meteorológicos</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
                        <div className="w-2 h-2 bg-agricultural-green rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <span>Generando análisis agrícola</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
