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
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {ipInfo && (
        <Marker position={position} icon={DefaultIcon}>
          <Popup>
            <div className="ip-popup">
              <h3>IP: {ipInfo.ipApi.query}</h3>
              <p><strong>Ubicación:</strong> {ipInfo.ipApi.city}, {ipInfo.ipApi.country}</p>
              <p><strong>ISP:</strong> {ipInfo.ipApi.isp}</p>
              {ipInfo.shodan.ports.length > 0 && (
                <p><strong>Puertos abiertos:</strong> {ipInfo.shodan.ports.join(', ')}</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map; 
