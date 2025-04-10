import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="main">
      <p>Escriu l'adreça IP per veure localització i informació</p>
    </div>
  )
}

export default App
