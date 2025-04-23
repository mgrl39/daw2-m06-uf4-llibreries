import { useState } from 'react'
import './App.css'
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
      setError('Error fetching IP information. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>IP Address Mapper</h1>
      <p>Enter an IP address to see its location and security information</p>
      
      <IpSearch onSearch={handleSearch} isLoading={isLoading} />
      
      {error && <div className="error">{error}</div>}
      
      <div className="map-container">
        <Map ipInfo={ipInfo} />
      </div>
    </div>
  )
}

export default App
