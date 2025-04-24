import { useState } from 'react'
import Map from './components/Map'
import IpSearch from './components/IpSearch'
import { getIpInfo } from './services/ipService'
import { CombinedIpInfo } from './types/IpInfo'

function App() {
  const [ipInfo, setIpInfo] = useState<CombinedIpInfo>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  const handleSearch = async (ip: string) => {
    setIsLoading(true)
    setError(undefined)
    try {
      const info = await getIpInfo(ip)
      setIpInfo(info)
    } catch (err) {
      setError('Error al obtener información de IP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 app-container my-4">
          <h1 className="text-center mb-4 fw-bold">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Mapa de Direcciones IP
          </h1>
          
          <IpSearch onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="alert alert-danger mt-3 d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          <div className="map-container mt-4">
            <Map ipInfo={ipInfo} />
          </div>
          
          {ipInfo && (
            <div className="mt-3 text-center text-muted small">
              <p>Datos obtenidos de IP-API y Shodan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
