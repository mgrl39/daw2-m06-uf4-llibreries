import { useState, useEffect } from "react";
import Map from "./components/Map";
import IpSearch from "./components/IpSearch";
import { getIpInfo } from "./services/ipService";
import { CombinedIpInfo } from "./types/IpInfo";

/**
 * Component principal de l'aplicació
 */
export default function App() {
  const [ip, setIp] = useState<CombinedIpInfo>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showErr, setShowErr] = useState(false);

  /**
   * Mostra i oculta errors automaticament
   */
  useEffect(() => {
    if (!error) return;
    setShowErr(true);
    const timer = setTimeout(() => setShowErr(false), 3500);
    return () => clearTimeout(timer);
  }, [error]);

  /**
   * Buscar IP
   * Comprovar error de API
   * Revisar estat si es Fail o No
   * Conte gestio d'errors
   *
   * TODO: MILLORAR GESTIO ERRORS
   */
  const handleSearch = async (ipAddr: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const info = await getIpInfo(ipAddr);
      setIp(info);
      if (info.ipApi.status == "fail")
        setError(`No hi ha dades per: ${ipAddr}`);
    } catch (err: any) {
      setError(
        err?.response?.status == 404
          ? `IP no trobada: ${ipAddr}`
          : err?.message?.includes("Network")
          ? "Error de connexió"
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
