# AgroMeteo Frontend

Una aplicación web moderna para predicciones meteorológicas y análisis agrícola inteligente, desarrollada con React y Tailwind CSS siguiendo principios de Clean Code.

## 🌟 Características

- **Predicciones meteorológicas precisas** basadas en coordenadas geográficas y fecha
- **Análisis agrícola inteligente** con recomendaciones personalizadas
- **Interfaz moderna y accesible** con diseño responsive
- **Componentes reutilizables** y arquitectura limpia
- **Validación de formularios** con React Hook Form
- **Manejo de estados** optimizado con hooks personalizados

## 🎨 Diseño

- **Tipografía**: Poppins (Google Fonts)
- **Paleta de colores**:
  - Verde agrícola: `#6DBF4B`
  - Tierra: `#A67C52`
  - Cielo suave: `#D3EAF2`
  - Fondo claro: `#F5FAF2`
  - Texto principal: `#1A1A1A`

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd modelo_papallacta_paramh2o_frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:3001
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📱 Uso

1. **Ingresa los datos requeridos**:
   - Fecha (YYYY-MM-DD)
   - Latitud (-90 a 90)
   - Longitud (-180 a 180)

2. **Opcional: Activa el análisis inteligente** y selecciona los tipos de análisis:
   - General
   - Cultivos
   - Riego
   - Alertas
   - Cronograma
   - Plagas
   - Suelo

3. **Obtén la predicción** con datos meteorológicos y recomendaciones agrícolas

## 🔧 API

La aplicación se conecta con el endpoint `/predict` enviando:

```json
{
  "date": "2024-06-01",
  "latitude": -0.35,
  "longitude": -78.17,
  "include_analysis": true,
  "analysis_types": ["general", "cultivos", "riego"]
}
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── Header.jsx      # Encabezado de la aplicación
│   ├── PredictionForm.jsx   # Formulario principal
│   ├── PredictionResults.jsx # Resultados de predicción
│   ├── LoadingSpinner.jsx   # Indicador de carga
│   └── ErrorMessage.jsx     # Manejo de errores
├── hooks/              # Hooks personalizados
│   └── useAgriculturalPrediction.js
├── services/           # Servicios de API
│   └── api.js
├── App.jsx            # Componente principal
└── main.jsx           # Punto de entrada
```

## 🛠️ Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **Tailwind CSS 4.1** - Framework de CSS utilitario con Vite plugin
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Vite** - Herramienta de construcción

## 🔧 Configuración de Tailwind CSS 4.1

Esta aplicación utiliza Tailwind CSS 4.1 con el plugin de Vite más reciente para una integración óptima:

- **Plugin**: `@tailwindcss/vite` integrado en `vite.config.js`
- **Configuración**: `tailwind.config.js` con colores personalizados
- **CSS personalizado**: Variables CSS definidas en `src/index.css`

### Colores personalizados:
- `agricultural-green`: #6DBF4B
- `earth-brown`: #A67C52  
- `sky-soft`: #D3EAF2
- `light-bg`: #F5FAF2
- `text-primary`: #1A1A1A

## 🎯 Principios de Clean Code

- **Componentes reutilizables** con responsabilidades específicas
- **Hooks personalizados** para lógica de negocio
- **Separación de responsabilidades** entre UI, lógica y servicios
- **Código legible y mantenible** con nomenclatura descriptiva
- **Manejo de errores** centralizado y consistente

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construcción para producción
npm run preview  # Vista previa de la construcción
npm run lint     # Análisis de código con ESLint
```

## 🌍 Variables de Entorno

- `VITE_API_URL`: URL base de la API (por defecto: http://localhost:3001)

## 📄 Licencia

Este proyecto está desarrollado para uso educativo y agrícola.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
