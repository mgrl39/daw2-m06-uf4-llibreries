import { useState, useEffect } from "react";
import Map from "./components/Map";
import IpSearch from "./components/IpSearch";
import { getIpInfo } from "./services/ipService";
import { CombinedIpInfo } from "./types/IpInfo";

// Component principal de l'aplicació
export default function App() {
  const [ip, setIp] = useState<CombinedIpInfo>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showErr, setShowErr] = useState(false);

  // Mostrar y ocultar errores automáticamente
  // Mostra i oculta errors automaticament
  useEffect(() => {
    if (!error) return;
    setShowErr(true);
    const timer = setTimeout(() => setShowErr(false), 3500);
    return () => clearTimeout(timer);
  }, [error]);

  // Buscar IP
  const handleSearch = async (ipAddr: string) => {
    setLoading(true);
    setError(undefined);

    try {
      // Obtener datos
      const info = await getIpInfo(ipAddr);
      setIp(info);

      // Comprobar error de API
      // TODO REVISAR ESTAT SI ES FAIL O NO
      if (info.ipApi.status == "fail") setError(`No hay datos para: ${ipAddr}`);
    } catch (err: any) {
      // Gestionar errores
      setError(
        err?.response?.status == 404
          ? `IP no trobada: ${ipAddr}`
          : err?.message?.includes("Network")
          ? "Error de conexio"
          : `Error: ${ipAddr}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-wrapper">
      <Map ipInfo={ip} />

      <div className="search-container">
        <h4 className="mb-3">Escriu IP</h4>
        <IpSearch onSearch={handleSearch} isLoading={loading} />
      </div>

      {showErr && error && (
        <div className="error-container">
          <div className="error-toast">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
