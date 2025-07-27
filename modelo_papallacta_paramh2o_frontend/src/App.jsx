import { useState } from 'react';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResults from './components/PredictionResults';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useAgriculturalPrediction } from './hooks/useAgriculturalPrediction';
import { CloudSun, BarChart3, Sprout } from 'lucide-react';
function App() {
  const [lastFormData, setLastFormData] = useState(null);
  const { predict, prediction, isLoading, error, reset } = useAgriculturalPrediction();

  const handleFormSubmit = async (formData) => {
    setLastFormData(formData);
    try {
      await predict(formData);
    } catch (err) {
      console.error('Error al obtener predicción:', err);
    }
  };

  const handleRetry = () => {
    if (lastFormData) {
      handleFormSubmit(lastFormData);
    }
  };

  const handleReset = () => {
    reset();
    setLastFormData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-bg font-poppins text-text-primary">
      <Header />

      <main className="flex flex-grow container items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="animate-fade-in">
          {isLoading && (
            <LoadingSpinner message="Obteniendo predicción meteorológica y análisis agrícola..." />
          )}

          {error && !isLoading && (
            <ErrorMessage
              error={error}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          )}

          {prediction && !isLoading && !error && (
            <PredictionResults
              prediction={prediction}
              onReset={handleReset}
            />
          )}

          {!prediction && !isLoading && !error && (
            <PredictionForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      <footer className="bg-agricultural-green text-white py-6 lg:py-8">
        <div className='flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group hover-lift">
              <div className="bg-white/20 rounded-full p-4 lg:p-5 w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <CloudSun className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Datos Meteorológicos</h3>
              <p className="text-white/85 text-xs lg:text-sm leading-relaxed">
                Predicciones precisas basadas en datos meteorológicos actualizados
              </p>
            </div>

            <div className="flex flex-col items-center  text-center group hover-lift">
              <div className="bg-white/20 rounded-full p-4 lg:p-5 w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Análisis Inteligente</h3>
              <p className="text-white/85 text-xs lg:text-sm leading-relaxed">
                Recomendaciones personalizadas para cultivos, riego y manejo agrícola
              </p>
            </div>

            <div className="flex flex-col items-center  text-center group hover-lift">
              <div className="bg-white/20 rounded-full p-4 lg:p-5 w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Sprout className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Optimización Agrícola</h3>
              <p className="text-white/85 text-xs lg:text-sm leading-relaxed">
                Maximiza la productividad y sostenibilidad de tus cultivos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

}

export default App;
