import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CombinedIpInfo } from '../types/IpInfo';
import { useEffect, useState, useRef } from 'react';

// Fix for the marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Opciones de mapas disponibles
const mapStyles = [
  {
    name: "Claro",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    name: "Oscuro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    name: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    name: "Calles",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    name: "Ciclovía",
    url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
  },
  {
    name: "Transporte",
    url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors'
  }
];

// Componente para controlar el movimiento del mapa
function MapController({ position }: { position: [number, number] }) {
  const map = useMap();
  const prevPositionRef = useRef<[number, number]>(position);
  
  useEffect(() => {
    // Solo animar si la posición ha cambiado realmente
    if (
      prevPositionRef.current[0] !== position[0] || 
      prevPositionRef.current[1] !== position[1]
    ) {
      // Animar el desplazamiento hacia la nueva posición
      map.flyTo(position, 13, {
        duration: 1.5, // duración de la animación en segundos
        easeLinearity: 0.8
      });
      
      // Actualizar la posición previa
      prevPositionRef.current = position;
    }
  }, [map, position]);
  
  return null;
}

// Componente para el estilo del mapa sin causar reanimación
function MapStyleLayer({ mapStyle }: { mapStyle: typeof mapStyles[0] }) {
  return (
    <TileLayer
      url={mapStyle.url}
      attribution={mapStyle.attribution}
    />
  );
}

interface MapProps {
  ipInfo?: CombinedIpInfo;
}

const Map = ({ ipInfo }: MapProps) => {
  const [selectedMapStyle, setSelectedMapStyle] = useState(0); // Índice del estilo de mapa seleccionado
  const defaultPosition: [number, number] = [40, 0];
  const position: [number, number] = ipInfo ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon] : defaultPosition;

  return (
    <>
      {/* Selector de estilos de mapa */}
      <div className="map-style-selector">
        <select 
          className="form-select form-select-sm"
          value={selectedMapStyle}
          onChange={(e) => setSelectedMapStyle(parseInt(e.target.value))}
        >
          {mapStyles.map((style, index) => (
            <option key={index} value={index}>{index + 1}: {style.name}</option>
          ))}
        </select>
      </div>
      
      <MapContainer
        center={defaultPosition}
        zoom={3}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        {/* Controlador para el desplazamiento animado */}
        <MapController position={position} />

        
        {/* Capa del mapa seleccionado */}
        <MapStyleLayer mapStyle={mapStyles[selectedMapStyle]} />
        
        {ipInfo && (
          <Marker position={position} icon={DefaultIcon}>
            <Popup>
              <div>
                <span className="fw-bold">IP: {ipInfo.ipApi.query}</span>
                <p className="mb-1 mt-2">📍 {ipInfo.ipApi.city}, {ipInfo.ipApi.country}</p>
                <p className="mb-1">🌐 {ipInfo.ipApi.isp}</p>
                {ipInfo.shodan.ports.length > 0 && (
                  <p className="mb-0">🔌 Puertos: {ipInfo.shodan.ports.join(', ')}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default Map; 
