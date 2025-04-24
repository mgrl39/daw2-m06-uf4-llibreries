import { useState, FormEvent, ChangeEvent, ClipboardEvent } from 'react';

interface IpSearchProps {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

const IpSearch = ({ onSearch, isLoading }: IpSearchProps) => {
  const [ip, setIp] = useState('');

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ip.trim()) onSearch(ip.trim());
  };

  // Validar entrada con reglas simplificadas
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números y puntos
    if (!/^[0-9.]*$/.test(value)) return;
    
    // Validar formato básico de IP
    const parts = value.split('.');
    if (parts.length > 4 || parts.some(part => part.length > 3)) return;
    
    setIp(value);
  };
  
  // Manejar eventos de pegado
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData('text');
    
    // Solo permitir números y puntos
    if (!/^[0-9.]*$/.test(value)) {
      e.preventDefault();
      return;
    }
    
    // Validar formato básico de IP
    const parts = value.split('.');
    if (parts.length > 4 || parts.some(part => part.length > 3)) {
      e.preventDefault();
    }
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
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-search"></i>
          )}
        </button>
      </div>
    </form>
  );
};

export default IpSearch; 
