import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CombinedIpInfo } from '../types/IpInfo';

// Fix for the marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapProps {
  ipInfo?: CombinedIpInfo;
}

const Map = ({ ipInfo }: MapProps) => {
  const defaultPosition: [number, number] = [40, 0];
  const position: [number, number] = ipInfo ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon] : defaultPosition;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {ipInfo && (
        <Marker position={position} icon={DefaultIcon}>
          <Popup className="custom-popup">
            <div className="text-center">
              <span className="badge bg-primary mb-2 px-3 py-2">IP: {ipInfo.ipApi.query}</span>
              <div className="info-item mb-2">
                <p className="mb-1 fw-bold">
                  <i className="bi bi-geo-alt me-1"></i>
                  Ubicación:
                </p>
                <p className="text-secondary mb-0">{ipInfo.ipApi.city}, {ipInfo.ipApi.country}</p>
              </div>
              <div className="info-item mb-2">
                <p className="mb-1 fw-bold">
                  <i className="bi bi-globe me-1"></i>
                  ISP:
                </p>
                <p className="text-secondary mb-0">{ipInfo.ipApi.isp}</p>
              </div>
              {ipInfo.shodan.ports.length > 0 && (
                <div className="info-item">
                  <p className="mb-1 fw-bold">
                    <i className="bi bi-hdd-network me-1"></i>
                    Puertos abiertos:
                  </p>
                  <p className="text-secondary mb-0">{ipInfo.shodan.ports.join(', ')}</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map; 
