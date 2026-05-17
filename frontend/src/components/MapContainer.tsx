import { useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
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

// Pulsing user location icon
const createUserIcon = () => L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="position:relative;width:24px;height:24px;">
      <div style="
        position:absolute;inset:0;
        background:#3b82f6;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(59,130,246,0.6);
        z-index:2;
      "></div>
      <div style="
        position:absolute;inset:-8px;
        background:rgba(59,130,246,0.2);
        border-radius:50%;
        animation:pulse 2s infinite;
        z-index:1;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0%,100%{transform:scale(1);opacity:0.6}
        50%{transform:scale(1.4);opacity:0.2}
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -16],
});

const availableIcon = createCustomIcon('#10b981', '🅿️');
const occupiedIcon = createCustomIcon('#ef4444', '🅿️');
const evIcon = createCustomIcon('#10b981', '⚡');
const unverifiedIcon = createCustomIcon('#f59e0b', '⚠️');

interface MapContainerProps {
  spots: ParkingSpot[];
  userLocation: UserLocation | null;
  onSpotClick: (spot: ParkingSpot) => void;
  routePolyline?: [number, number][];
  allRouteLines?: [number, number][][];
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function MapContainer({
  spots,
  userLocation,
  onSpotClick,
  routePolyline,
  allRouteLines = [],
  center,
  zoom = 16,
  darkMode = false,
}: MapContainerProps & { darkMode?: boolean }) {
  // Always start centered on user if available, else a neutral world view
  const initialCenter: [number, number] = center || (userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [20, 0]);
  const initialZoom = center ? zoom : (userLocation ? 16 : 2);

  const getMarkerIcon = (spot: ParkingSpot) => {
    if (spot.isVerified === false) return unverifiedIcon;
    if (spot.spotType === 'ev') return evIcon;
    return spot.isAvailable ? availableIcon : occupiedIcon;
  };

  return (
    <div className="w-full h-full relative">
      {/* Loading overlay while waiting for location */}
      {!userLocation && !center && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm pointer-events-none">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold text-lg">Getting your location…</p>
          <p className="text-gray-400 text-sm mt-1">Please allow location access</p>
        </div>
      )}

      <LeafletMap
        center={initialCenter}
        zoom={initialZoom}
        className={`w-full h-full z-0 ${darkMode ? 'map-tiles-dark' : ''}`}
        zoomControl={true}
      >
        <MapUpdater center={center || (userLocation ? [userLocation.latitude, userLocation.longitude] : undefined)} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1km search radius circle around searched location */}
        {center && (
          <Circle
            center={center}
            radius={1000}
            pathOptions={{ color: '#aa3bff', fillColor: '#aa3bff', fillOpacity: 0.06, weight: 2, dashArray: '6 4' }}
          />
        )}

        {/* User location marker with accuracy circle */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createUserIcon()}
              zIndexOffset={1000}
            >
              <Popup>
                <strong>📍 You are here</strong>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={100}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 1 }}
            />
          </>
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
                <div className="flex items-center gap-2">
                  <strong>{spot.name}</strong>
                  {spot.isVerified === false && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Unverified</span>
                  )}
                </div>
                {spot.isAvailable ? '✅ Available' : '❌ Occupied'}
                <br />
                ${spot.pricePerHour}/hr
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route lines from user to each nearby spot (after search) */}
        {allRouteLines.map((line, i) => (
          <Polyline
            key={`route-${i}`}
            positions={line}
            color={i === 0 ? '#10b981' : '#94a3b8'}
            weight={i === 0 ? 3 : 2}
            opacity={i === 0 ? 0.9 : 0.5}
            dashArray={i === 0 ? undefined : '6 4'}
          />
        ))}

        {/* Single navigate route polyline */}
        {routePolyline && routePolyline.length > 0 && allRouteLines.length === 0 && (
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
