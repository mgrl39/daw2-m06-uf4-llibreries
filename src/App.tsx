import { useState, useEffect } from "react";
import Map from "./components/Map";
import IpSearch from "./components/IpSearch";
import { getIpInfo } from "./services/ipService";
import { IpInfo, Holiday } from "./types/IpInfo";
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
  const [ipInfo, setIpInfo] = useState<IpInfo | undefined>(undefined);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [showErr, setShowErr] = useState<boolean>(false);
  const [showHolidays, setShowHolidays] = useState<boolean>(false);
  const [styleIdx, setStyleIdx] = useState<number>(0);

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
    setShowHolidays(!!holidays.length);
  }, [holidays]);

  /**
   * Cerca informació per una IP
   * Gestiona errors de l'API i actualitza l'estat
   */
  const handleSearch = async (ipAddr: string): Promise<void> => {
    setLoading(true);
    setError(undefined);

    try {
      const { ipInfo, holidays }: { ipInfo: IpInfo; holidays: Holiday[] } =
        await getIpInfo(ipAddr);
      setIpInfo(ipInfo);
      setHolidays(holidays);

      if (ipInfo.status == "fail") {
        setError(ipInfo.message || `No hi ha dades per a: ${ipAddr}`);
      }
    } catch (err: any) {
      let errorMsg: string = `Error: ${ipAddr}`;

      if (err?.response?.status == 404) errorMsg = `IP no trobada: ${ipAddr}`;
      else if (err?.message?.includes("Network"))
        errorMsg = "Error de connexió";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dark">
      <header className="bg-black py-3">
        <h1 className="text-center mb-3 app-title">🌍 IPFesta 🌎</h1>

        <div className="container">
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
      </header>

      <main className="flex-grow-1 d-flex flex-wrap">
        <div className="col-md-8 col-12 h-100">
          <Map ipInfo={ipInfo} styleIdx={styleIdx} />
        </div>

        <div className="col-md-4 col-12 p-3">
          {ipInfo && ipInfo.status === "success" && (
            <div
              className="bg-dark text-white p-3 rounded border border-secondary mb-3 overflow-auto"
              style={{ maxHeight: "400px" }}
            >
              <h5 className="border-bottom pb-2 mb-3 text-warning">
                📌 Informació d'IP
              </h5>
              <div>
                <div className="mb-2">
                  <strong>IP:</strong> {ipInfo.query}
                </div>

                {ipInfo.city && (
                  <div className="mb-2">
                    <strong>Ciutat:</strong> {ipInfo.city}
                  </div>
                )}

                {ipInfo.regionName && (
                  <div className="mb-2">
                    <strong>Regió:</strong> {ipInfo.regionName}{" "}
                    {ipInfo.region && `(${ipInfo.region})`}
                  </div>
                )}

                {ipInfo.country && (
                  <div className="mb-2">
                    <strong>País:</strong> {ipInfo.country}{" "}
                    {ipInfo.countryCode && `(${ipInfo.countryCode})`}
                  </div>
                )}

                {ipInfo.timezone && (
                  <div className="mb-2">
                    <strong>Zona horària:</strong> {ipInfo.timezone}
                  </div>
                )}

                {ipInfo.org && (
                  <div className="mb-2">
                    <strong>Organització:</strong> {ipInfo.org}
                  </div>
                )}

                {ipInfo.as && (
                  <div className="mb-2">
                    <strong>ASN:</strong> {ipInfo.as}
                  </div>
                )}

                {ipInfo.currency && (
                  <div className="mb-2">
                    <strong>Moneda:</strong> {ipInfo.currency}{" "}
                    {ipInfo.currency_name && `(${ipInfo.currency_name})`}
                  </div>
                )}

                {ipInfo.languages && (
                  <div className="mb-2">
                    <strong>Idiomes:</strong> {ipInfo.languages}
                  </div>
                )}
              </div>
            </div>
          )}

          {showHolidays && ipInfo && (
            <HolidayInfo
              holidays={holidays}
              country={ipInfo.country}
              isVisible={showHolidays}
            />
          )}
        </div>
      </main>

      {showErr && error && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 z-3">
          <div className="alert alert-danger d-flex align-items-center py-2 px-3">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
