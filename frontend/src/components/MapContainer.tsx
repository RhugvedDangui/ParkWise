import { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ParkingSpot, UserLocation } from '../types/index';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">${icon}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const availableIcon = createCustomIcon('#10b981', '🅿️');
const occupiedIcon = createCustomIcon('#ef4444', '🅿️');
const evIcon = createCustomIcon('#10b981', '⚡');
const userIcon = createCustomIcon('#3b82f6', '📍');

interface MapContainerProps {
  spots: ParkingSpot[];
  userLocation: UserLocation | null;
  onSpotClick: (spot: ParkingSpot) => void;
  routePolyline?: [number, number][];
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function MapContainer({
  spots,
  userLocation,
  onSpotClick,
  routePolyline,
  center,
  zoom = 13,
}: MapContainerProps) {
  const defaultCenter: [number, number] = center || [37.7749, -122.4194]; // San Francisco default

  const getMarkerIcon = (spot: ParkingSpot) => {
    if (spot.spotType === 'ev') return evIcon;
    return spot.isAvailable ? availableIcon : occupiedIcon;
  };

  return (
    <div className="w-full h-full relative">
      <LeafletMap
        center={defaultCenter}
        zoom={zoom}
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Parking spot markers */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={getMarkerIcon(spot)}
            eventHandlers={{
              click: () => onSpotClick(spot),
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{spot.name}</strong>
                <br />
                {spot.isAvailable ? '✅ Available' : '❌ Occupied'}
                <br />
                ${spot.pricePerHour}/hr
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polyline */}
        {routePolyline && routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        )}
      </LeafletMap>
    </div>
  );
}
