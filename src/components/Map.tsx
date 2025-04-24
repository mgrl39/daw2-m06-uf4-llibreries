import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CombinedIpInfo } from '../types/IpInfo';
import { useEffect, useState, useRef } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración y datos estáticos
const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const mapStyles = [
  { name: "Claro", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" },
  { name: "Oscuro", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" },
  { name: "Satélite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
  { name: "Calles", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  { name: "Ciclovía", url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38" },
  { name: "Transporte", url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38" }
].map(s => ({ ...s, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }));

const shortcuts = [
  { key: "↑↓←→", action: "Mover" },
  { key: "+/-", action: "Zoom" },
  { key: "1-6", action: "Mapa" },
  { key: "R", action: "Reset" },
  { key: "F", action: "Buscar" }
];

// Control del mapa con teclado y animación
function MapControls({ position, setStyle }: { position: [number, number], setStyle: (idx: number) => void }) {
  const map = useMap();
  const prevPos = useRef(position);
  
  // Actualizar posición con animación
  useEffect(() => {
    if (prevPos.current[0] !== position[0] || prevPos.current[1] !== position[1]) {
      map.flyTo(position, 13, { duration: 1.5 });
      prevPos.current = position;
    }
  }, [map, position]);
  
  // Control de teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // No procesar si estamos en un input
      if (document.activeElement instanceof HTMLInputElement || 
          document.activeElement instanceof HTMLTextAreaElement ||
          document.activeElement instanceof HTMLSelectElement) return;
      
      // Acciones de teclas
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
          if (input && input instanceof HTMLInputElement) input.focus();
          break;
        default:
          const num = parseInt(e.key);
          if (num >= 1 && num <= 6) setStyle(num - 1);
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [map, setStyle]);
  
  return null;
}

// Componente principal del mapa
const Map = ({ ipInfo }: { ipInfo?: CombinedIpInfo }) => {
  const [styleIdx, setStyleIdx] = useState(0);
  const defaultPos: [number, number] = [40, 0];
  const position = ipInfo ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon] as [number, number] : defaultPos;

  return (
    <>
      {/* Controles de UI */}
      <div className="map-style-selector">
        <select value={styleIdx} onChange={e => setStyleIdx(parseInt(e.target.value))}>
          {mapStyles.map((s, i) => (
            <option key={i} value={i}>{i+1}: {s.name}</option>
          ))}
        </select>
      </div>
      
      <div className="keyboard-help">
        <div className="keyboard-help-content">
          <h5>Atajos de teclado</h5>
          {shortcuts.map((sc, i) => (
            <div key={i}><span>{sc.key}</span> {sc.action}</div>
          ))}
        </div>
      </div>
      
      {/* Mapa */}
      <MapContainer
        center={defaultPos}
        zoom={3}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <MapControls position={position} setStyle={setStyleIdx} />
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
