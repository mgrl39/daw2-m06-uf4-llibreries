import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { IpInfo, ComponentProps } from "../types/IpInfo";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Icones pels marcadors
 */
const markerIcons = {
  current: new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "current-marker",
  }),
  history: new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "history-marker",
  }),
};

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
 * Component per volar al punt seleccionat
 */
const FlyToMarker = ({ position }: { position: LatLngTuple }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 12, {
      animate: true,
      duration: 1.5,
    });
  }, [map, position]);

  return null;
};

/**
 * Interfície per emmagatzemar els punts anteriors
 */
interface SavedPoint {
  id: string;
  position: LatLngTuple;
  info: IpInfo;
  timestamp: number;
}

/**
 * Component principal del mapa
 */
export default function Map({ ipInfo, styleIdx = 0 }: ComponentProps) {
  const defaultPos: LatLngTuple = [40, 0];
  const [savedPoints, setSavedPoints] = useState<SavedPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<SavedPoint | null>(null);

  const hasValidCoords =
    ipInfo &&
    ipInfo.status === "success" &&
    typeof ipInfo.lat === "number" &&
    typeof ipInfo.lon === "number";

  const pos: LatLngTuple = hasValidCoords
    ? [ipInfo.lat, ipInfo.lon]
    : defaultPos;

  // Afegeix el nou punt a l'historial quan canvia la IP
  useEffect(() => {
    if (!hasValidCoords || !ipInfo) return;

    const newPoint: SavedPoint = {
      id: ipInfo.query,
      position: [ipInfo.lat, ipInfo.lon] as LatLngTuple,
      info: ipInfo,
      timestamp: Date.now(),
    };

    if (!savedPoints.some((p) => p.id === ipInfo.query)) {
      setSavedPoints((prev) => [...prev, newPoint]);
    }

    setCurrentPoint(newPoint);
  }, [ipInfo, hasValidCoords]);

  return (
    <div className="h-100 w-100 position-relative">
      <MapContainer
        center={pos}
        zoom={hasValidCoords ? 12 : 3}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
        zoomControl={true}
      >
        <TileLayer url={mapUrls[styleIdx || 0]} attribution="" />

        {/* Component per situar el mapa automàticament */}
        {hasValidCoords && <FlyToMarker position={pos} />}

        {/* Mostrar tots els punts guardats excepte l'actual */}
        {savedPoints.map((point) => {
          const isCurrent = currentPoint && point.id === currentPoint.id;
          return (
            <Marker
              key={point.id}
              position={point.position}
              icon={isCurrent ? markerIcons.current : markerIcons.history}
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
          onClick={() => setSavedPoints(currentPoint ? [currentPoint] : [])}
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
