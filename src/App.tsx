import { useState, useEffect } from 'react'
import Map from './components/Map'
import IpSearch from './components/IpSearch'
import { getIpInfo } from './services/ipService'
import { CombinedIpInfo } from './types/IpInfo'

// Componente principal de la aplicación
export default function App() {
  // Estado
  const [ip, setIp] = useState<CombinedIpInfo>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showErr, setShowErr] = useState(false)

  // Mostrar y ocultar errores automáticamente
  useEffect(() => {
    if (!error) return
    setShowErr(true)
    const timer = setTimeout(() => setShowErr(false), 3500)
    return () => clearTimeout(timer)
  }, [error])

  // Buscar IP
  const handleSearch = async (ipAddr: string) => {
    setLoading(true)
    setError(undefined)
    
    try {
      // Obtener datos
      const info = await getIpInfo(ipAddr)
      setIp(info)
      
      // Comprobar error de API
      if (info.ipApi.status === 'fail') {
        setError(`No hay datos para: ${ipAddr}`)
      }
    } catch (err: any) {
      // Gestionar errores
      setError(
        err?.response?.status === 404 ? `IP no encontrada: ${ipAddr}` :
        err?.message?.includes('Network') ? 'Error de conexión' :
        `Error: ${ipAddr}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="map-wrapper">
      <Map ipInfo={ip} />
      
      <div className="search-container">
        <h4 className="mb-3">Buscar IP</h4>
        <IpSearch onSearch={handleSearch} isLoading={loading} />
      </div>
      
      {showErr && error && (
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
