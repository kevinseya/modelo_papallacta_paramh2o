"""
Rutas para endpoints de predicciones meteorológicas.
"""

from flask import Blueprint, request, jsonify
from typing import Dict, Any

from ..models.data_models import WeatherDataRequest, APIResponse
from ..service_manager import service_manager
from ..utils.validators import RequestValidator, ValidationError
from ..utils.logging import app_logger, error_handler, PerformanceTimer

# Crear blueprint
prediction_bp = Blueprint('prediction', __name__)


@prediction_bp.route('/predict', methods=['POST'])
def predict():
    """Endpoint principal para predicciones meteorológicas con análisis agrícola"""
    try:
        # Validar datos de entrada
        data = request.get_json()
        RequestValidator.validate_json_data(data)
        RequestValidator.validate_required_fields(data, ['date', 'latitude', 'longitude'])

        # Validar que la fecha no exceda los 30 días posteriores a la fecha actual
        from datetime import datetime, timedelta
        input_date = datetime.strptime(data['date'], '%Y-%m-%d')
        today = datetime.now()
        max_allowed_date = today + timedelta(days=30)
        if input_date > max_allowed_date:
            return jsonify(APIResponse(success=False, error="La fecha no puede exceder los 30 días posteriores a la fecha actual").to_dict()), 400

        # Leer parámetro opcional para predicción a futuro
        steps_a_futuro = int(data.get('steps_a_futuro', 1))  # Por defecto 1 (siguiente hora)

        # Crear request model
        weather_request = WeatherDataRequest(
            date=data['date'],
            latitude=float(data['latitude']),
            longitude=float(data['longitude']),
            include_analysis=data.get('include_analysis', True),
            analysis_types=data.get('analysis_types')
        )

        app_logger.info(f"Petición de predicción: {weather_request.date}, "
                       f"({weather_request.latitude}, {weather_request.longitude})")

        with PerformanceTimer(app_logger, "Predicción completa"):
            # 1. Encontrar estación más cercana
            nearest_station, distance = service_manager.station_service.find_nearest_station(
                weather_request.latitude, weather_request.longitude
            )

            # 2. Verificar disponibilidad del modelo
            if not service_manager.station_service.is_model_available(nearest_station):
                available_stations = service_manager.station_service.get_available_stations()
                return jsonify(APIResponse(
                    success=False,
                    error=f'Modelo para la estación más cercana ({nearest_station}) no está disponible',
                    details={
                        'nearest_station': nearest_station,
                        'distance': round(distance, 6),
                        'available_stations': available_stations
                    }
                ).to_dict()), 503

            app_logger.info(f"Usando modelo de estación: {nearest_station} (distancia: {distance:.6f})")

            # 3. Obtener modelo y scaler
            model, scaler = service_manager.station_service.get_model_and_scaler(nearest_station)

            # 4. Obtener datos históricos (rango: hoy y 30 días antes)
            end_date = today
            start_date = today - timedelta(days=30)
            end_date_str = end_date.strftime('%Y-%m-%d')
            start_date_str = start_date.strftime('%Y-%m-%d')
            historical_data = service_manager.weather_service.get_historical_data(
                end_date_str, weather_request.latitude, weather_request.longitude
            )


            # 5. Preprocesar datos
            app_logger.info(f"Timestamps recibidos de Open-Meteo: {historical_data.timestamps}")
            X_test = service_manager.prediction_service.preprocess_data(historical_data, scaler)

            # 6. Realizar predicción
            predictions = service_manager.prediction_service.predict(model, X_test, scaler)
            app_logger.info(f"Cantidad de predicciones generadas: {len(predictions)}")

            # 7. Buscar la predicción para la fecha enviada
            selected_indices = [idx for idx, ts in enumerate(historical_data.timestamps) if ts[:10] == weather_request.date]
            app_logger.info(f"Índices seleccionados para la fecha {weather_request.date}: {selected_indices}")
            # Filtrar solo los índices válidos para predictions
            valid_indices = [i for i in selected_indices if i < len(predictions)]
            app_logger.info(f"Índices válidos para predicción: {valid_indices}")

            # --- NUEVO: predicción multi-step (a futuro) ---
            def predict_multistep(model, last_sequence, scaler, steps):
                """
                Realiza predicción recursiva multi-step usando el modelo LSTM.
                last_sequence: np.array shape (1, time_steps, n_features)
                steps: cantidad de pasos a futuro
                Devuelve lista de predicciones desnormalizadas
                """
                preds = []
                seq = last_sequence.copy()
                for _ in range(steps):
                    pred_norm = model.predict(seq)
                    pred = scaler.inverse_transform(pred_norm)[0]
                    preds.append(pred.tolist())
                    # Actualizar secuencia: quitar el primer paso y agregar la predicción al final
                    seq = np.concatenate([seq[:, 1:, :], pred_norm.reshape(1, 1, -1)], axis=1)
                return preds

            if steps_a_futuro > 1:
                # Usar la última secuencia de X_test para predecir varios pasos
                import numpy as np
                last_seq = X_test[-1:]
                selected_prediction = predict_multistep(model, last_seq, scaler, steps_a_futuro)
                app_logger.info(f"Predicción multi-step generada para {steps_a_futuro} pasos a futuro")
            else:
                if valid_indices:
                    selected_prediction = predictions[valid_indices]
                else:
                    selected_prediction = []

            # 8. Validar predicción seleccionada
            import numpy as np
            pred_to_validate = np.array(selected_prediction) if isinstance(selected_prediction, list) else selected_prediction
            if pred_to_validate.size == 0 or not service_manager.prediction_service.validate_predictions(pred_to_validate):
                return jsonify(APIResponse(
                    success=False,
                    error="No se encontró predicción válida para la fecha seleccionada"
                ).to_dict()), 500

            # 9. Análisis con Gemini (opcional)
            analysis = None
            analysis_error = None

            if weather_request.include_analysis:
                # Asegurar que se envía una lista válida al análisis
                if hasattr(selected_prediction, 'tolist'):
                    pred_for_analysis = selected_prediction.tolist()
                else:
                    pred_for_analysis = selected_prediction
                analysis, analysis_error = service_manager.analysis_service.analyze_predictions(
                    pred_for_analysis, data
                )
                if analysis_error:
                    app_logger.warning(f"Error en análisis: {analysis_error}")

            # 10. Preparar respuesta
            station_info = service_manager.station_service.get_station_info(
                nearest_station, weather_request.latitude, weather_request.longitude
            )


            # Asegurar que la predicción sea una lista
            if hasattr(selected_prediction, 'tolist'):
                prediction_list = selected_prediction.tolist()
            else:
                prediction_list = selected_prediction


            # Construir objeto weather_data para el frontend
            # Usar la última predicción generada (multi-step: la última; single-step: la única)
            pred_values = prediction_list[-1] if isinstance(prediction_list, list) and len(prediction_list) > 0 else None
            weather_data = None
            if pred_values:
                # Asume orden: [Precipitación, Temperatura, Humedad]
                weather_data = {
                    'date': weather_request.date,
                    'latitude': weather_request.latitude,
                    'longitude': weather_request.longitude,
                    'precipitation': round(pred_values[0], 2) if len(pred_values) > 0 else None,
                    'temperature': round(pred_values[1], 2) if len(pred_values) > 1 else None,
                    'humidity': round(pred_values[2], 2) if len(pred_values) > 2 else None
                }
            response_data = {
                'prediction': prediction_list,
                'weather_data': weather_data,
                'model_info': {
                    'selected_station': nearest_station,
                    'station_coordinates': {
                        'lat': station_info.latitude,
                        'lon': station_info.longitude
                    },
                    'distance_to_station': round(distance, 6),
                    'distance_unit': 'grados (lat/lon)'
                },
                'historical_data': historical_data.to_dict(),
                'input_coordinates': {
                    'latitude': weather_request.latitude,
                    'longitude': weather_request.longitude
                },
                'requested_date': weather_request.date,
                'analysis_included': analysis is not None
            }


            # Agregar análisis si está disponible
            if analysis:
                response_data['agricultural_analysis'] = analysis
            elif analysis_error:
                response_data['analysis_error'] = analysis_error

            return jsonify(APIResponse(success=True, data=response_data).to_dict())
            
    except ValidationError as e:
        app_logger.warning(f"Error de validación: {str(e)}")
        return jsonify(APIResponse(success=False, error=str(e)).to_dict()), 400
        
    except Exception as e:
        error_msg = error_handler.log_error(e, {'endpoint': 'predict'})
        return jsonify(APIResponse(success=False, error=error_msg).to_dict()), 500


@prediction_bp.route('/analysis-options', methods=['GET'])
def get_analysis_options():
    """Endpoint para obtener opciones de análisis disponibles"""
    try:
        options = service_manager.analysis_service.get_analysis_options()
        return jsonify(options)
        
    except Exception as e:
        error_msg = error_handler.log_error(e, {'endpoint': 'analysis_options'})
        return jsonify(APIResponse(success=False, error=error_msg).to_dict()), 500
