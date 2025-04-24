import { useState, FormEvent, ChangeEvent, ClipboardEvent } from 'react';

type IpSearchProps = {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

const IpSearch = ({ onSearch, isLoading }: IpSearchProps) => {
  const [ip, setIp] = useState('');

  // Validar formato IP básico
  const isValidIpFormat = (value: string) => {
    if (!/^[0-9.]*$/.test(value)) return false;
    
    const parts = value.split('.');
    return !(parts.length > 4 || parts.some(part => part.length > 3));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedIp = ip.trim();
    if (trimmedIp) onSearch(trimmedIp);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidIpFormat(value)) setIp(value);
  };
  
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData('text');
    if (!isValidIpFormat(value)) e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={ip}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Ej: 8.8.8.8"
          pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          title="Introduce una dirección IPv4 válida"
          required
          disabled={isLoading}
          maxLength={15}
        />
        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> : 
            <i className="bi bi-search"/>
          }
        </button>
      </div>
    </form>
  );
};

export default IpSearch; 
