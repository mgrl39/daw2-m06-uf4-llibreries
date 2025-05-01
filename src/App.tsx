import { useState, useEffect } from "react";
import Map from "./components/Map";
import IpSearch from "./components/IpSearch";
import { getIpInfo } from "./services/ipService";
import { CombinedIpInfo } from "./types/IpInfo";
import HolidayInfo from "./components/HolidayInfo";

/**
 * Component principal de l'aplicació
 */
export default function App() {
  const [ip, setIp] = useState<CombinedIpInfo>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showErr, setShowErr] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);

  /**
   * Mostra i oculta errors automàticament
   */
  useEffect(() => {
    if (!error) return;
    setShowErr(true);
    const timer = setTimeout(() => setShowErr(false), 3500);
    return () => clearTimeout(timer);
  }, [error]);

  /**
   * Mostra les festivitats quan hi ha informació d'IP
   */
  useEffect(() => {
    if (ip && ip.holidays.length > 0) {
      setShowHolidays(true);
    } else {
      setShowHolidays(false);
    }
  }, [ip]);

  /**
   * Cerca informació per una IP
   * Gestiona errors de l'API i actualitza l'estat
   */
  const handleSearch = async (ipAddr: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const info = await getIpInfo(ipAddr);
      setIp(info);

      if (info.ipApi.status === "fail") {
        if (info.ipApi.message?.includes("reserved range")) {
          setError(
            `IP reservada: ${ipAddr} - No disponible per a geolocalització`
          );
        } else {
          setError(`No hi ha dades per: ${ipAddr}`);
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.status === 404
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
    <div className="app-container">
      <Map ipInfo={ip} />

      <div className="search-panel">
        <h3 className="search-title">Cerca per IP</h3>
        <IpSearch onSearch={handleSearch} isLoading={loading} />
      </div>

      {ip && showHolidays && (
        <HolidayInfo
          holidays={ip.holidays}
          country={ip.ipApi.country}
          isVisible={showHolidays}
        />
      )}

      {showErr && error && (
        <div className="error-notification">
          <div className="error-content">
            <i className="bi bi-exclamation-triangle-fill error-icon" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
