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

  const hasValidCoordinates =
    ipInfo &&
    ipInfo.ipApi.status === "success" &&
    typeof ipInfo.ipApi.lat === "number" &&
    typeof ipInfo.ipApi.lon === "number";

  const pos: LatLngTuple = hasValidCoordinates
    ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon]
    : defaultPos;

  return (
    <MapContainer
      center={pos}
      zoom={hasValidCoordinates ? 13 : 3}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer url={mapUrls[styleIdx]} attribution="" />

      {hasValidCoordinates && (
        <Marker position={pos} icon={mapIcon}>
          <Popup>
            <div className="py-1">
              <div className="fw-bold mb-2 border-bottom pb-1">
                {ipInfo.ipApi.query}
              </div>
              <div className="mb-1 small">
                <i className="bi bi-geo-alt me-1"></i>
                {ipInfo.ipApi.city}, {ipInfo.ipApi.country}
              </div>
              <div className="mb-1 small">
                <i className="bi bi-globe me-1"></i>
                {ipInfo.ipApi.isp}
              </div>
              {ipInfo.ipApi.org && (
                <div className="mb-1 small">
                  <i className="bi bi-building me-1"></i>
                  {ipInfo.ipApi.org}
                </div>
              )}
              {ipInfo.ipApi.as && (
                <div className="small">
                  <i className="bi bi-hdd-network me-1"></i>
                  {ipInfo.ipApi.as}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
