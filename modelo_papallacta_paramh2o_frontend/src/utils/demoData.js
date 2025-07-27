// Demo data for testing the agricultural application

export const demoFormData = {
    date: new Date().toISOString().split('T')[0], // Today's date
    latitude: -0.35,
    longitude: -78.17,
    include_analysis: true,
    analysis_types: ['general', 'cultivos', 'riego', 'alertas']
};

export const demoPredictionResponse = {
    weather_data: {
        date: new Date().toISOString().split('T')[0],
        latitude: -0.35,
        longitude: -78.17,
        temperature: 18.5,
        humidity: 75,
        wind_speed: 12.3,
        pressure: 1013.2,
        precipitation: 2.5,
        visibility: 10,
    },
    analysis: {
        general: [
            "Condiciones meteorológicas favorables para actividades agrícolas",
            "Temperatura moderada ideal para la mayoría de cultivos",
            "Humedad relativa adecuada para el crecimiento vegetal"
        ],
        cultivos: [
            "Excelente momento para la siembra de cultivos de clima templado",
            "Se recomienda protección contra heladas nocturnas",
            "Condiciones óptimas para el desarrollo de tubérculos"
        ],
        riego: [
            "Reducir la frecuencia de riego debido a la alta humedad",
            "Monitorear el drenaje del suelo para evitar encharcamientos",
            "Programar riego temprano en la mañana"
        ],
        alertas: [
            "Posible formación de niebla en horas de la madrugada",
            "Vigilar cambios bruscos de temperatura",
            "Alertas menores de viento - sin riesgo significativo"
        ]
    }
};

export const getDemoData = () => ({
    formData: demoFormData,
    response: demoPredictionResponse
});
