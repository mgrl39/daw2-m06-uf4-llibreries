import { useState, FormEvent } from 'react';

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

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-lg border-start-0"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Introduce dirección IP (ej: 8.8.8.8)..."
              pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              title="Por favor, introduce una dirección IPv4 válida"
              required
              disabled={isLoading}
            />
            <button 
              className="btn btn-primary px-4" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Buscando...
                </>
              ) : 'Buscar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IpSearch; 
