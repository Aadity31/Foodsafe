'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Default icon fallback
L.Marker.prototype.options.icon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background-color: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface MapViewProps {
  requests: any[];
  ngoLat: number;
  ngoLng: number;
}

export function MapView({ requests, ngoLat, ngoLng }: MapViewProps) {
  const center: [number, number] = [ngoLat || 28.6139, ngoLng || 77.2090];

  return (
    <div className="h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* NGO Location */}
        <Marker position={center}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>

        {/* Food Request Markers */}
        {requests.map((request) => (
          <Marker
            key={request.id}
            position={[request.latitude, request.longitude]}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    request.isVeg ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {request.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {request.quantity} servings
                  </span>
                </div>
                <p className="text-sm font-medium">{request.category.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {request.distance?.toFixed(1)} km away
                </p>
                <p className="text-xs text-gray-500">
                  Expires: {new Date(request.expiryTime).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
