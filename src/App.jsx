import React, { useState } from 'react'
import MapView from './components/MapView'
import { vehicles } from './data/vehicles'
import './App.css'

function App() {
  const [showMap, setShowMap] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const handleShowMap = (vehicle = null) => {
    setSelectedVehicle(vehicle)
    setShowMap(true)
  }

  return (
    <div className="app">
      <header>
        <h1>⚡ Electric Vehicle Management</h1>
      </header>
      
      <main>
        <button 
          className="show-map-btn"
          onClick={() => handleShowMap()}
        >
          Show All Vehicles on Map
        </button>
        
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <h3>{vehicle.number}</h3>
              <p>Supervisor: {vehicle.supervisor}</p>
              <button onClick={() => handleShowMap(vehicle)}>
                View on Map
              </button>
            </div>
          ))}
        </div>
      </main>
      
      {showMap && (
        <MapView
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  )
}

export default App
