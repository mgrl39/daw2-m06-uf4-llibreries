import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CombinedIpInfo } from '../types/IpInfo';
import { useEffect, useState, useRef } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración básica
const mapIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Estilos de mapa disponibles
const mapStyles = [
  { name: "Dia", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" },
  { name: "Nit", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" },
  { name: "Satèlit", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
  { name: "Carrers", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  { name: "Humanitari", url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" },
].map(s => ({...s, attribution: ''}));

// Atajos de teclado
const shortcuts = [
  ["↑↓←→", "Moure"],
  ["+/-", "Zoom"],
  ["1-5", "Mapeig"],
  ["R", "Reset"],
  ["F", "Buscar"],
];

// Controls del mapa
function Controls({ 
  pos, 
  setStyle 
}: { 
  pos: LatLngTuple, 
  setStyle: (idx: number) => void 
}) {
  const map = useMap();
  const prevPos = useRef(pos);
  
  // Animación al cambiar posición
  useEffect(() => {
    if (prevPos.current[0] !== pos[0] || prevPos.current[1] !== pos[1]) {
      map.flyTo(pos, 13, { duration: 1.5 });
      prevPos.current = pos;
    }
  }, [map, pos]);
  
  // Atajos de teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignorar si estamos en un input
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA' || 
          document.activeElement?.tagName === 'SELECT') return;
      
      // Procesamiento de teclas
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
          if (input instanceof HTMLInputElement) input.focus();
          break;
        default:
          // Números 1-5 cambian estilo de mapa
          const num = parseInt(e.key);
          if (num >= 1 && num <= 5) setStyle(num - 1);
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [map, setStyle]);
  
  return null;
}

// Componente principal
export default function Map({ ipInfo }: { ipInfo?: CombinedIpInfo }) {
  const [styleIdx, setStyleIdx] = useState(0);
  const defaultPos: LatLngTuple = [40, 0];
  const pos: LatLngTuple = ipInfo ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon] : defaultPos;

  return (
    <>
      {/* UI Controls */}
      <div className="map-style-selector">
        <select value={styleIdx} onChange={e => setStyleIdx(parseInt(e.target.value))}>
          {mapStyles.map((s, i) => (
            <option key={i} value={i}>{i+1}: {s.name}</option>
          ))}
        </select>
      </div>
      
      <div className="keyboard-help">
        <div className="keyboard-help-content">
          <h5>Atajos</h5>
          {shortcuts.map(([key, action], i) => (
            <div key={i}><span>{key}</span> {action}</div>
          ))}
        </div>
      </div>
      
      {/* Map Container */}
      <MapContainer
        center={defaultPos}
        zoom={3}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <Controls pos={pos} setStyle={setStyleIdx} />
        <TileLayer url={mapStyles[styleIdx].url} attribution={mapStyles[styleIdx].attribution} />
        
        {ipInfo && (
          <Marker position={pos} icon={mapIcon}>
            <Popup>
              <div>
                <span className="fw-bold">IP: {ipInfo.ipApi.query}</span>
                <p className="mb-1 mt-2">📍 {ipInfo.ipApi.city}, {ipInfo.ipApi.country}</p>
                <p className="mb-1">🌐 {ipInfo.ipApi.isp}</p>
                {ipInfo.shodan.ports.length > 0 && (
                  <p className="mb-0">🔌 {ipInfo.shodan.ports.join(', ')}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
} 
