import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CombinedIpInfo } from '../types/IpInfo';
import { useEffect, useState, useRef } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración básica de marcador
const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Estilos de mapa simplificados
const mapStyles = [
  { name: "Claro", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" },
  { name: "Oscuro", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" },
  { name: "Satélite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
  { name: "Calles", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  { name: "Ciclovía", url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38" },
  { name: "Transporte", url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38" }
].map(style => ({ 
  ...style, 
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
}));

// Atajos de teclado
const keyboardShortcuts = [
  { key: "↑↓←→", action: "Mover" },
  { key: "+/-", action: "Zoom" },
  { key: "1-6", action: "Mapa" },
  { key: "R", action: "Reset" },
  { key: "F", action: "Buscar" }
];

// Componente de controles internos simplificado
function MapControls({ position, setMapStyle }: { position: [number, number], setMapStyle: (idx: number) => void }) {
  const map = useMap();
  const prevPos = useRef(position);
  
  // Actualizar posición
  useEffect(() => {
    if (prevPos.current[0] !== position[0] || prevPos.current[1] !== position[1]) {
      map.flyTo(position, 13, { duration: 1.5 });
      prevPos.current = position;
    }
  }, [map, position]);
  
  // Controles de teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // No procesar si el foco está en un input
      if (document.activeElement instanceof HTMLInputElement || 
          document.activeElement instanceof HTMLTextAreaElement ||
          document.activeElement instanceof HTMLSelectElement) return;
      
      // Procesar teclas
      switch (e.key) {
        case 'ArrowUp': map.panBy([0, -50]); break;
        case 'ArrowDown': map.panBy([0, 50]); break;
        case 'ArrowLeft': map.panBy([-50, 0]); break;
        case 'ArrowRight': map.panBy([50, 0]); break;
        case '+': case '=': map.zoomIn(); break;
        case '-': map.zoomOut(); break;
        case 'r': case 'R': map.setView([40, 0], 3); break;
        case 'f': case 'F':
          const input = document.querySelector('.search-container input');
          if (input) (input as HTMLElement).focus();
          break;
        default:
          // Mapas con teclas 1-6
          const num = parseInt(e.key);
          if (num >= 1 && num <= 6) setMapStyle(num - 1);
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [map, setMapStyle]);
  
  return null;
}

// Componente principal
const Map = ({ ipInfo }: { ipInfo?: CombinedIpInfo }) => {
  const [styleIdx, setStyleIdx] = useState(0);
  const defaultPos: [number, number] = [40, 0];
  const position: [number, number] = ipInfo ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon] : defaultPos;

  return (
    <>
      {/* Selector de estilos */}
      <div className="map-style-selector">
        <select value={styleIdx} onChange={e => setStyleIdx(parseInt(e.target.value))}>
          {mapStyles.map((s, i) => (
            <option key={i} value={i}>{i+1}: {s.name}</option>
          ))}
        </select>
      </div>
      
      {/* Ayuda de teclado */}
      <div className="keyboard-help">
        <div className="keyboard-help-content">
          <h5>Atajos de teclado</h5>
          {keyboardShortcuts.map((sc, i) => (
            <div key={i}><span>{sc.key}</span> {sc.action}</div>
          ))}
        </div>
      </div>
      
      <MapContainer
        center={defaultPos}
        zoom={3}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <MapControls position={position} setMapStyle={setStyleIdx} />
        <TileLayer 
          url={mapStyles[styleIdx].url} 
          attribution={mapStyles[styleIdx].attribution}
        />
        
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
