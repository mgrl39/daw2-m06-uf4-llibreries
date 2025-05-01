import { useState, FormEvent, ChangeEvent } from "react";
import { Props } from "../types/IpInfo";

/**
 * Component per cercar informació d'una adreça IP
 */
const IpSearch = ({ onSearch, isLoading }: Props) => {
  const [ip, setIp] = useState("");

  /**
   * Valida el format d'una adreça IP mentre s'escriu
   */
  const isValidFormat = (value: string): boolean =>
    /^[0-9.]*$/.test(value) &&
    !value.split(".").some((part) => part.length > 3) &&
    value.split(".").length <= 4;

  /**
   * Gestiona l'enviament del formulari
   */
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (ip.trim()) onSearch(ip.trim());
  };

  /**
   * Gestiona l'entrada de text validant el format
   */
  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (isValidFormat(e.target.value)) {
      setIp(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control bg-black text-white border-secondary"
          value={ip}
          onChange={handleInput}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (!isValidFormat(text)) e.preventDefault();
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
