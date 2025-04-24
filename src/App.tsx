import { useState, useEffect } from 'react'
import Map from './components/Map'
import IpSearch from './components/IpSearch'
import { getIpInfo } from './services/ipService'
import { CombinedIpInfo } from './types/IpInfo'

// Componente principal de la aplicación
function App() {
  // Estado
  const [ipInfo, setIpInfo] = useState<CombinedIpInfo>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showError, setShowError] = useState(false)

  // Gestión de mensajes de error
  useEffect(() => {
    if (!error) return
    
    // Mostrar error y ocultarlo después de un tiempo
    setShowError(true)
    const timer = setTimeout(() => setShowError(false), 3500)
    return () => clearTimeout(timer)
  }, [error])

  // Buscar información de IP
  const handleSearch = async (ip: string) => {
    setIsLoading(true)
    setError(undefined)
    
    try {
      const info = await getIpInfo(ip)
      setIpInfo(info)
      
      // Comprobar si la API devolvió un error
      if (info.ipApi.status === 'fail') {
        setError(`No se encontraron datos para: ${ip}`)
      }
    } catch (err: any) {
      // Determinar mensaje de error según el tipo
      setError(
        err?.response?.status === 404 ? `IP no encontrada: ${ip}` :
        err?.message?.includes('Network Error') ? 'Error de conexión' :
        `Error al consultar IP: ${ip}`
      )
    } finally {
      setIsLoading(false)
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
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
