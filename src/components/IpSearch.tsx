import { useState } from "react";
import { ComponentProps } from "../types/IpInfo";

/**
 * Component per cercar informació d'una adreça IP
 */
const IpSearch = ({ onSearch, isLoading }: ComponentProps) => {
  const [ip, setIp] = useState("");

  /**
   * Validar y gestionar entrada
   */
  const isValid = (v: string) =>
    /^[0-9.]*$/.test(v) &&
    !v.split(".").some((p) => p.length > 3) &&
    v.split(".").length <= 4;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ip.trim() && onSearch) onSearch(ip.trim());
      }}
    >
      <div className="input-group">
        <input
          type="text"
          className="form-control bg-black text-white border-secondary"
          value={ip}
          onChange={(e) => isValid(e.target.value) && setIp(e.target.value)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (!isValid(text)) e.preventDefault();
          }}
          placeholder="8.8.8.8"
          pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          title="Format d'IP vàlid: xxx.xxx.xxx.xxx"
          required
          disabled={isLoading}
          maxLength={15}
        />
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
