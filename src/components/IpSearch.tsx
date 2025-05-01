import { useState } from "react";
import { ComponentProps } from "../types/IpInfo";

/**
 * Component per cercar informació d'una adreça IP
 * Permet a l'usuari introduir una adreça IP i validar-la
 */
const IpSearch = ({ onSearch, isLoading }: ComponentProps) => {
  // Estat per guardar el valor del camp d'entrada
  const [ip, setIp] = useState<string>("");

  /**
   * Funció per validar que el format d'IP sigui correcte
   * Comprova que:
   * - Només contingui números i punts
   * - Cap segment tingui més de 3 dígits
   * - No tingui més de 4 segments (x.x.x.x)
   */
  const esIpValida = (valor: string): boolean => {
    // Només accepta números i punts
    const nomesNumerosiPunts: boolean = /^[0-9.]*$/.test(valor);

    // Comprova que cap segment tingui més de 3 dígits
    const segments: string[] = valor.split(".");
    let segmentsValids: boolean = true;
    for (const segment of segments) {
      if (segment.length > 3) {
        segmentsValids = false;
        break;
      }
    }

    // Comprova que no tingui més de 4 segments, retorna cert si és vàlid
    const noMesDe4Segments: boolean = segments.length <= 4;
    return nomesNumerosiPunts && segmentsValids && noMesDe4Segments;
  };

  /**
   * Funció que s'executa quan es fa submit del formulari
   * Evita que la pàgina es recarregui
   * Si hi ha un valor d'IP i existeix la funció onSearch, la crida
   */
  const cercarIP = (event: React.FormEvent): void => {
    // Evita que la pàgina es recarregui
    event.preventDefault();
    if (ip.trim() && onSearch) onSearch(ip.trim());
  };

  return (
    <form onSubmit={cercarIP}>
      <div className="input-group">
        {/* Camp d'entrada per l'adreça IP */}
        <input
          type="text"
          className="form-control bg-black text-white border-secondary"
          value={ip}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // Només actualitza l'estat si la IP és vàlida
            const nouValor: string = e.target.value;
            if (esIpValida(nouValor)) {
              setIp(nouValor);
            }
          }}
          onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
            // Evita enganxar text no vàlid
            const textEnganxat: string = e.clipboardData.getData("text");
            if (!esIpValida(textEnganxat)) {
              e.preventDefault();
            }
          }}
          placeholder="8.8.8.8"
          pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          title="Format d'IP vàlid: xxx.xxx.xxx.xxx"
          required
          disabled={isLoading}
          maxLength={15}
        />

        {/* Botó de cerca */}
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-search" />
          )}
        </button>
      </div>
    </form>
  );
};

export default IpSearch;
