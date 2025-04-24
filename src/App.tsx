import { useState, useEffect } from 'react'
import Map from './components/Map'
import IpSearch from './components/IpSearch'
import { getIpInfo } from './services/ipService'
import { CombinedIpInfo } from './types/IpInfo'

function App() {
  const [ipInfo, setIpInfo] = useState<CombinedIpInfo>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!error) return;
    
    setShowError(true);
    const timer = setTimeout(() => setShowError(false), 3500);
    return () => clearTimeout(timer);
  }, [error])

  const handleSearch = async (ip: string) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const info = await getIpInfo(ip);
      setIpInfo(info);
      
      if (info.ipApi.status === 'fail') {
        setError(`No se encontraron datos para la IP: ${ip}`);
      }
    } catch (err: any) {
      console.error('Error:', err);
      
      const message = err?.response?.status === 404 
        ? `La IP ${ip} no fue encontrada`
        : err?.message?.includes('Network Error')
          ? 'Error de conexión. Verifica tu internet.'
          : `Error al obtener datos para la IP: ${ip}`;
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="map-wrapper">
      <Map ipInfo={ipInfo} />
      
      <div className="search-container">
        <h4 className="mb-3">Buscar IP</h4>
        <IpSearch onSearch={handleSearch} isLoading={isLoading} />
      </div>
      
      {showError && error && (
        <div className="error-container">
          <div className="error-toast">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
