import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom EV icon
const evIcon = new L.divIcon({
  html: '<div class="custom-ev-marker">⚡</div>',
  className: 'custom-marker-wrapper',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const selectedEvIcon = new L.divIcon({
  html: '<div class="custom-ev-marker selected">⚡</div>',
  className: 'custom-marker-wrapper',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Component to handle flying to selected vehicle
function FlyToVehicle({ selectedVehicle }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo(
        [selectedVehicle.location.latitude, selectedVehicle.location.longitude],
        13,
        { duration: 1.5 }
      );
    }
  }, [selectedVehicle, map]);
  
  return null;
}

function MapView({ vehicles, selectedVehicle, onClose }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate center position - use selected vehicle or center of US
  const center = selectedVehicle
    ? [selectedVehicle.location.latitude, selectedVehicle.location.longitude]
    : [39.8283, -98.5795];
  
  const zoom = selectedVehicle ? 13 : 4;

  return (
    <div className="map-overlay">
      <div className="map-container">
        <div className="map-header">
          <h2>🗺️ Vehicle Locations</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ width: '100%', height: '100%', flex: 1 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <FlyToVehicle selectedVehicle={selectedVehicle} />
          
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.location.latitude, vehicle.location.longitude]}
              icon={selectedVehicle?.id === vehicle.id ? selectedEvIcon : evIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{vehicle.number}</h3>
                  <div className="popup-info">
                    <p><strong>👤 Supervisor:</strong> {vehicle.supervisor}</p>
                    <p><strong>📍 Location:</strong> {vehicle.location.latitude.toFixed(4)}°, {vehicle.location.longitude.toFixed(4)}°</p>
                    <p><strong>🕐 Updated:</strong> {formatDate(vehicle.lastUpdated)}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
