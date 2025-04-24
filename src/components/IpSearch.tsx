import { useState, FormEvent, ChangeEvent } from "react";

type Props = {
  onSearch: (ip: string) => void;
  isLoading: boolean;
};

const IpSearch = ({ onSearch, isLoading }: Props) => {
  const [ip, setIp] = useState("");
  const isValidFormat = (value: string): boolean =>
    /^[0-9.]*$/.test(value) &&
    !value.split(".").some((part) => part.length > 3) &&
    value.split(".").length <= 4;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ip.trim()) onSearch(ip.trim());
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    if (isValidFormat(val)) setIp(val);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={ip}
          onChange={handleInput}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (!isValidFormat(text)) e.preventDefault();
          }}
          placeholder="Ex: 8.8.8.8"
          pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          title="IP vàlida (formato: xxx.xxx.xxx.xxx)"
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
