import { useState, useEffect } from "react";
import Map from "./components/Map";
import IpSearch from "./components/IpSearch";
import { getIpInfo } from "./services/ipService";
import { CombinedIpInfo } from "./types/IpInfo";
import HolidayInfo from "./components/HolidayInfo";

/**
 * Estils de mapa disponibles
 */
const mapStyles = [
  { name: "☀️ Dia" },
  { name: "🌃 Nit" },
  { name: "🛰️ Satèl·lit" },
  { name: "🛣️ Carrers" },
  { name: "🏥 Humanitari" },
];

/**
 * Component principal de l'aplicació
 */
export default function App() {
  const [ip, setIp] = useState<CombinedIpInfo>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showErr, setShowErr] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [styleIdx, setStyleIdx] = useState(0);

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
    <div className="d-flex flex-column vh-100 bg-dark">
      <div className="bg-black py-3">
        <h1 className="text-white text-center mb-3">IPFesta</h1>

        <div className="container mb-2">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="row g-2">
                <div className="col-9">
                  <IpSearch onSearch={handleSearch} isLoading={loading} />
                </div>
                <div className="col-3">
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={styleIdx}
                    onChange={(e) => setStyleIdx(parseInt(e.target.value))}
                  >
                    {mapStyles.map((s, i) => (
                      <option key={i} value={i}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 position-relative">
        <Map ipInfo={ip} styleIdx={styleIdx} />
      </div>

      {ip && showHolidays && (
        <HolidayInfo
          holidays={ip.holidays}
          country={ip.ipApi.country}
          isVisible={showHolidays}
        />
      )}

      {showErr && error && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 z-3">
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
