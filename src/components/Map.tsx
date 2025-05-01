import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CombinedIpInfo } from "../types/IpInfo";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Configuració bàsica del marcador al mapa
 */
const mapIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * URLs dels estils de mapa disponibles
 */
const mapUrls = [
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
];

/**
 * Component principal del mapa
 */
export default function Map({
  ipInfo,
  styleIdx,
}: {
  ipInfo?: CombinedIpInfo;
  styleIdx: number;
}) {
  const defaultPos: LatLngTuple = [40, 0];
  let pos: LatLngTuple = defaultPos;

  /**
   * Verifica que les coordenades són vàlides abans d'assignar-les
   */
  const hasValidCoordinates =
    ipInfo &&
    ipInfo.ipApi.status === "success" &&
    typeof ipInfo.ipApi.lat === "number" &&
    typeof ipInfo.ipApi.lon === "number";

  if (hasValidCoordinates) {
    pos = [ipInfo.ipApi.lat, ipInfo.ipApi.lon];
  }

  return (
    <MapContainer
      center={hasValidCoordinates ? pos : defaultPos}
      zoom={hasValidCoordinates ? 13 : 3}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer url={mapUrls[styleIdx]} attribution="" />

      {hasValidCoordinates && (
        <Marker position={pos} icon={mapIcon}>
          <Popup>
            <div>
              <div className="fw-bold mb-2">IP: {ipInfo.ipApi.query}</div>
              <p className="mb-1">
                📍 {ipInfo.ipApi.city}, {ipInfo.ipApi.country}
              </p>
              <p className="mb-1">🌐 {ipInfo.ipApi.isp}</p>
              {ipInfo.ipApi.org && (
                <p className="mb-1">🏢 {ipInfo.ipApi.org}</p>
              )}
              {ipInfo.ipApi.as && <p className="mb-0">🔌 {ipInfo.ipApi.as}</p>}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
