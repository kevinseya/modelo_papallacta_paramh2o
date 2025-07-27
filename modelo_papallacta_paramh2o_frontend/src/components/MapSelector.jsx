import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas actualizadas de Papallacta según tus datos
// (-0.39768 -78.16089 -0.35768 -78.12089)
const PAPALLACTA_BOUNDS = {
  north: -0.35768,
  south: -0.39768,
  west: -78.16089,
  east: -78.12089,
};

// Bounds para el ImageOverlay (esquina suroeste y esquina noreste)
const IMAGE_BOUNDS = [
  [PAPALLACTA_BOUNDS.south, PAPALLACTA_BOUNDS.west], // esquina suroeste
  [PAPALLACTA_BOUNDS.north, PAPALLACTA_BOUNDS.east]  // esquina noreste
];

const DEFAULT_POSITION = [-0.37768, -78.14089]; // Centro aproximado de tu área

function isWithinPapallacta(lat, lon) {
  return (
    lat <= PAPALLACTA_BOUNDS.north &&
    lat >= PAPALLACTA_BOUNDS.south &&
    lon >= PAPALLACTA_BOUNDS.west &&
    lon <= PAPALLACTA_BOUNDS.east
  );
}

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (isWithinPapallacta(lat, lng)) {
        setPosition([lat, lng]);
      } else {
        alert('Selecciona un punto dentro del rango de Papallacta');
      }
    },
  });
  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ value, onChange, mapImageUrl }) => {
  const [position, setPosition] = useState(value || DEFAULT_POSITION);

  React.useEffect(() => {
    if (position) {
      onChange({ latitude: position[0], longitude: position[1] });
    }
  }, [position, onChange]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text-primary mb-2">
        Selecciona la ubicación en el mapa (solo Papallacta)
      </label>
      <MapContainer
        center={DEFAULT_POSITION}
        zoom={14}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* ImageOverlay para mostrar tu mapa PNG */}
        {mapImageUrl && (
          <ImageOverlay
            url={mapImageUrl}
            bounds={IMAGE_BOUNDS}
            opacity={0.7}
            interactive={false}
          />
        )}
        
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="mt-2 text-sm text-gray-700">
        Latitud: {position[0].toFixed(5)}, Longitud: {position[1].toFixed(5)}
      </div>
    </div>
  );
};

export default MapSelector;