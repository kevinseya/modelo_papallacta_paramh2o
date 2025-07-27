import {
    CloudSun,
    Thermometer,
    Droplets,
    Wind,
    Eye,
    Gauge,
    Calendar,
    MapPin,
    CheckCircle,
    AlertTriangle,
    Info,
    Sprout,
    CloudRain,
} from 'lucide-react';
import { formatCoordinate, formatDate, formatTemperature, formatPercentage, formatSpeed, formatPressure } from '../utils/validation';

const PredictionResults = ({ prediction, onReset }) => {
if (!prediction) return null;

const { weather_data, agricultural_analysis, analysis } = prediction;
// Usar agricultural_analysis si existe, sino analysis (compatibilidad)
const analysisData = agricultural_analysis || analysis || {};

    const WeatherCard = ({ icon: Icon, title, value, unit, description }) => (
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-8 h-8 text-agricultural-green" />
                <span className="text-2xl font-bold text-text-primary">
                    {value}
                    <span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>
                </span>
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600">{description}</p>
            )}
        </div>
    );

    const AnalysisSection = ({ title, content, icon: Icon, type = 'info' }) => {
        const bgColor = type === 'warning' ? 'bg-yellow-50' : type === 'success' ? 'bg-green-50' : 'bg-blue-50';
        const borderColor = type === 'warning' ? 'border-yellow-200' : type === 'success' ? 'border-green-200' : 'border-blue-200';
        const iconColor = type === 'warning' ? 'text-yellow-600' : type === 'success' ? 'text-green-600' : 'text-blue-600';

        return (
            <div className={`${bgColor} ${borderColor} border rounded-xl p-6 mb-4`}>
                <div className="flex items-start space-x-3">
                    <Icon className={`w-6 h-6 ${iconColor} mt-1 flex-shrink-0`} />
                    <div>
                        <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                        <div className="text-gray-700 space-y-2">
                            {Array.isArray(content) ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {content.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{content}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            Predicción Meteorológica
                        </h2>
                        <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(weather_data?.date || prediction.date)}
                            </span>
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {formatCoordinate(weather_data?.latitude)}, {formatCoordinate(weather_data?.longitude)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onReset}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Nueva Consulta
                    </button>
                </div>

                {/* Weather Overview */}
                {weather_data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <WeatherCard
                            icon={Thermometer}
                            title="Temperatura"
                            value={weather_data.temperature?.toFixed(1) || 'N/A'}
                            unit="°C"
                            description="Temperatura promedio del día"
                        />
                        <WeatherCard
                            icon={Droplets}
                            title="Humedad"
                            value={weather_data.humidity?.toFixed(0) || 'N/A'}
                            unit="%"
                            description="Humedad relativa del aire"
                        />
                        <WeatherCard
                            icon={CloudRain}
                            title="Precipitación"
                            value={weather_data.precipitation?.toFixed(1) || 'N/A'}
                            unit="l/m²"
                            description="Precipitación"
                        />
                        {/*<WeatherCard
                            icon={Gauge}
                            title="Presión"
                            value={weather_data.pressure?.toFixed(0) || 'N/A'}
                            unit="hPa"
                            description="Presión atmosférica"
                        />*/}
                    </div>
                )}
            </div>

            {/* Analysis Results */}
            {analysisData && Object.keys(analysisData).length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                        <Sprout className="w-6 h-6 mr-3 text-agricultural-green" />
                        Análisis Agrícola Inteligente
                    </h3>

                    <div className="space-y-6">
                        {/* Mostrar resumen_climatico si existe */}
                        {analysisData.resumen_climatico && (
                            <AnalysisSection
                                title="Resumen Climático"
                                content={analysisData.resumen_climatico}
                                icon={Info}
                                type="info"
                            />
                        )}
                        {analysisData.recomendaciones_cultivos && (
                            <AnalysisSection
                                title="Recomendaciones para Cultivos"
                                content={analysisData.recomendaciones_cultivos}
                                icon={Sprout}
                                type="success"
                            />
                        )}
                        {analysisData.manejo_riego && (
                            <AnalysisSection
                                title="Optimización del Riego"
                                content={analysisData.manejo_riego}
                                icon={Droplets}
                                type="info"
                            />
                        )}
                        {analysisData.alertas && (
                            <AnalysisSection
                                title="Alertas Meteorológicas"
                                content={analysisData.alertas}
                                icon={AlertTriangle}
                                type="warning"
                            />
                        )}
                        {analysisData.cronograma_agricola && (
                            <AnalysisSection
                                title="Planificación Agrícola"
                                content={analysisData.cronograma_agricola}
                                icon={Calendar}
                                type="info"
                            />
                        )}
                        {analysisData.manejo_plagas && (
                            <AnalysisSection
                                title="Control de Plagas"
                                content={analysisData.manejo_plagas}
                                icon={Eye}
                                type="warning"
                            />
                        )}
                        {analysisData.conservacion_suelo && (
                            <AnalysisSection
                                title="Análisis del Suelo"
                                content={analysisData.conservacion_suelo}
                                icon={Gauge}
                                type="info"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Data Quality Indicator */}
            <div className="bg-sky-soft rounded-xl p-6">
                <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-agricultural-green" />
                    <div>
                        <h4 className="font-semibold text-text-primary">Datos Verificados</h4>
                        <p className="text-gray-600">
                            Los datos meteorológicos han sido procesados y verificados para brindar
                            recomendaciones agrícolas precisas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionResults;
