import { useState } from 'react'
import './App.css'

function App() {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (ip: string) => {

  }
  return (
    <div className="main">
      <p>Escriu l'adreça IP per veure localització i informació</p>
      <IpInput onSearch={handleSearch} isLoading={isLoading} />
      <div className="map-container">
        <Map ipInfo={ipInfo} />
      </div>
    </div>
  )
}

export default App
