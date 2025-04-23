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
                            <p><strong>Location:</strong> {ipInfo.ipApi.city}, {ipInfo.ipApi.country}</p>
                            <p><strong>Region:</strong> {ipInfo.ipApi.regionName}</p>
                            <p><strong>ISP:</strong> {ipInfo.ipApi.isp}</p>
                            <p><strong>Organization:</strong> {ipInfo.ipApi.org}</p>
                            <p><strong>Timezone:</strong> {ipInfo.ipApi.timezone}</p>
                            
                            <h4>Security Information:</h4>
                            {ipInfo.shodan.ports.length > 0 && (
                                <p><strong>Open Ports:</strong> {ipInfo.shodan.ports.join(', ')}</p>
                            )}
                            {ipInfo.shodan.vulns.length > 0 && (
                                <div className="vulnerabilities">
                                    <p><strong>Vulnerabilities:</strong></p>
                                    <ul>
                                        {ipInfo.shodan.vulns.map((vuln, index) => (
                                            <li key={index}>{vuln}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {ipInfo.ipQualityScore && (
                                <div className="ip-quality">
                                    <h4>IP Quality Score:</h4>
                                    <p><strong>Fraud Score:</strong> {ipInfo.ipQualityScore.fraud_score}/100</p>
                                    {ipInfo.ipQualityScore.proxy && <p className="warning">⚠️ Proxy Detected</p>}
                                    {ipInfo.ipQualityScore.vpn && <p className="warning">⚠️ VPN Detected</p>}
                                    {ipInfo.ipQualityScore.tor && <p className="warning">⚠️ TOR Node Detected</p>}
                                    {ipInfo.ipQualityScore.is_crawler && <p>🤖 Web Crawler</p>}
                                    {ipInfo.ipQualityScore.recent_abuse && <p className="warning">⚠️ Recent Abuse Reported</p>}
                                </div>
                            )}

                            {ipInfo.abuseIPDB && (
                                <div className="abuse-info">
                                    <h4>Abuse Information:</h4>
                                    <p><strong>Confidence Score:</strong> {ipInfo.abuseIPDB.data.abuseConfidenceScore}%</p>
                                    {ipInfo.abuseIPDB.data.totalReports && (
                                        <p><strong>Total Reports:</strong> {ipInfo.abuseIPDB.data.totalReports}</p>
                                    )}
                                    {ipInfo.abuseIPDB.data.lastReportedAt && (
                                        <p><strong>Last Reported:</strong> {new Date(ipInfo.abuseIPDB.data.lastReportedAt).toLocaleDateString()}</p>
                                    )}
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