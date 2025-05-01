import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngTuple, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CombinedIpInfo, IpApiResponse } from "../types/IpInfo";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Configuració dels marcadors al mapa
 */
const currentMarkerIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "current-marker",
});

const historyMarkerIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "history-marker",
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
 * Component per centrar el mapa en una posició
 */
function FlyToMarker({ position }: { position: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 12, {
      animate: true,
      duration: 1.5,
    });
  }, [map, position]);

  return null;
}

/**
 * Interfície per emmagatzemar els punts anteriors
 */
interface SavedPoint {
  id: string;
  position: LatLngTuple;
  info: IpApiResponse;
  timestamp: number;
}

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
  const [savedPoints, setSavedPoints] = useState<SavedPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<SavedPoint | null>(null);

  const hasValidCoordinates =
    ipInfo &&
    ipInfo.ipApi.status === "success" &&
    typeof ipInfo.ipApi.lat === "number" &&
    typeof ipInfo.ipApi.lon === "number";

  const pos: LatLngTuple = hasValidCoordinates
    ? [ipInfo.ipApi.lat, ipInfo.ipApi.lon]
    : defaultPos;

  // Afegeix el nou punt a l'historial quan canvia la IP
  useEffect(() => {
    if (hasValidCoordinates && ipInfo) {
      const newPoint: SavedPoint = {
        id: ipInfo.ipApi.query,
        position: [ipInfo.ipApi.lat, ipInfo.ipApi.lon] as LatLngTuple,
        info: ipInfo.ipApi,
        timestamp: Date.now(),
      };

      // Comprova si el punt ja existeix a l'historial
      const pointExists = savedPoints.some(
        (point) => point.id === ipInfo.ipApi.query
      );

      if (!pointExists) {
        setSavedPoints((prev) => [...prev, newPoint]);
      }

      // Actualitza el punt actual
      setCurrentPoint(newPoint);
    }
  }, [ipInfo, hasValidCoordinates]);

  // Neteja tots els punts
  const handleClearAllPoints = () => {
    setSavedPoints([]);
    if (currentPoint) {
      setSavedPoints([currentPoint]);
    }
  };

  return (
    <div className="h-100 w-100 position-relative">
      <MapContainer
        center={pos}
        zoom={hasValidCoordinates ? 12 : 3}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
        zoomControl={true}
      >
        <TileLayer url={mapUrls[styleIdx]} attribution="" />

        {/* Component per situar el mapa automàticament */}
        {hasValidCoordinates && <FlyToMarker position={pos} />}

        {/* Mostrar tots els punts guardats excepte l'actual */}
        {savedPoints.map((point) => {
          const isCurrent = currentPoint && point.id === currentPoint.id;
          return (
            <Marker
              key={point.id}
              position={point.position}
              icon={isCurrent ? currentMarkerIcon : historyMarkerIcon}
              zIndexOffset={isCurrent ? 1000 : 0}
            >
              <Popup>
                <div className="py-2">
                  <div className="fw-bold mb-2">{point.info.query}</div>
                  <div>
                    {point.info.city}, {point.info.country}
                  </div>

                  {point.info.org && (
                    <div className="mt-2 small">{point.info.org}</div>
                  )}

                  <div className="mt-2 small text-muted">
                    Lat: {point.position[0].toFixed(4)}, Lon:{" "}
                    {point.position[1].toFixed(4)}
                  </div>

                  <div className="mt-2 small text-muted">
                    {new Date(point.timestamp).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Botó per netejar tots els punts */}
      {savedPoints.length > 1 && (
        <button
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
          onClick={handleClearAllPoints}
          style={{ zIndex: 1000 }}
        >
          <i className="bi bi-trash"></i> Netejar historial
        </button>
      )}

      {/* Comptador de marcadors */}
      {savedPoints.length > 0 && (
        <div
          className="position-absolute bottom-0 start-0 m-2 bg-dark text-white p-1 rounded"
          style={{ zIndex: 1000 }}
        >
          <small>
            {savedPoints.length} {savedPoints.length === 1 ? "punt" : "punts"}{" "}
            marcats
          </small>
        </div>
      )}
    </div>
  );
}
