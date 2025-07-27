import React from 'react';
import { Sprout } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-gradient-to-br from-agricultural-green via-agricultural-green to-agricultural-green/90 text-white py-8 lg:py-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/5 opacity-30"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <div className="flex justify-center items-center space-x-3 mb-6 animate-slide-up">
                        <div className="bg-white/20 rounded-full p-3 lg:p-4 hover-lift">
                            <Sprout className="w-8 h-8 lg:w-10 lg:h-10" />
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">AgroMeteo</h1>
                    </div>

                    <p className="text-lg lg:text-xl text-white/95 lg:mb-4 mx-auto leading-relaxed text-balance">
                        Predicciones meteorológicas inteligentes para optimizar tu actividad agrícola
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
