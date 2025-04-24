import { useState, FormEvent, ChangeEvent } from 'react';

interface IpSearchProps {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

const IpSearch = ({ onSearch, isLoading }: IpSearchProps) => {
  const [ip, setIp] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ip.trim()) onSearch(ip.trim());
  };

  // Validar que solo se introduzcan números y puntos con máximo 3 dígitos por sección
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value : string = e.target.value;
    
    // Solo permitir números y puntos
    if (!/^[0-9.]*$/.test(value)) return;
  
    
    // Validar que cada sección tenga máximo 3 dígitos
    const parts = value.split('.');
    
    // Si alguna sección tiene más de 3 dígitos, no actualizar
    if (parts.some(part => part.length > 3)) {
      return;
    }
    
    // Si hay más de 4 secciones, no actualizar
    if (parts.length > 4) {
      return;
    }
    
    setIp(value);
  };

  // Evitar pegar contenido inválido
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    
    // Verificar que solo contiene números y puntos
    if (!/^[0-9.]*$/.test(pasteData)) {
      e.preventDefault();
      return;
    }
    
    // Verificar que cada sección tiene máximo 3 dígitos
    const parts = pasteData.split('.');
    if (parts.some(part => part.length > 3) || parts.length > 4) {
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
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="Ej: 8.8.8.8"
          pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
          title="Introduce una dirección IPv4 válida"
          required
          disabled={isLoading}
          maxLength={15} // Limitar a 15 caracteres (xxx.xxx.xxx.xxx)
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
