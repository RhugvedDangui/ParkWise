import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import FilterToggle from './components/FilterToggle';
import SpotDetailsModal from './components/SpotDetailsModal';
import LocationFAB from './components/LocationFAB';
import ReportSpotButton from './components/ReportSpotButton';
import NavigationHeader from './components/NavigationHeader';
import GamificationBanner from './components/GamificationBanner';
import BookingModal from './components/BookingModal';
import Toast from './components/Toast';
import type { ParkingSpot, UserLocation, FilterOptions, Booking } from './types/index';

// Mock data for demonstration
const mockSpots: ParkingSpot[] = [
  {
    id: '1',
    name: 'Downtown Parking Garage',
    latitude: 37.7749,
    longitude: -122.4194,
    isAvailable: true,
    isVerified: true,
    spotType: 'covered',
    pricePerHour: 5.0,
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Market Street EV Station',
    latitude: 37.7849,
    longitude: -122.4094,
    isAvailable: true,
    isVerified: true,
    spotType: 'ev',
    pricePerHour: 8.0,
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Union Square Lot',
    latitude: 37.7879,
    longitude: -122.4074,
    isAvailable: false,
    isVerified: false,
    spotType: 'standard',
    pricePerHour: 6.5,
    lastUpdated: new Date(),
  },
  {
    id: '4',
    name: 'Civic Center Accessible',
    latitude: 37.7799,
    longitude: -122.4134,
    isAvailable: true,
    isVerified: true,
    spotType: 'handicap',
    pricePerHour: 4.0,
    lastUpdated: new Date(),
  },
];

function App() {
  const [spots, setSpots] = useState<ParkingSpot[]>(mockSpots);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>(mockSpots);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<ParkingSpot | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>();
  const [isLocating, setIsLocating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  
  // Gamification state
  const [userPoints, setUserPoints] = useState(150);
  const [reportsCount, setReportsCount] = useState(12);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    freeOnly: false,
    evCharging: false,
    coveredParking: false,
    handicapAccessible: false,
  });

  // Apply filters
  useEffect(() => {
    let filtered = [...spots];

    if (filters.freeOnly) {
      filtered = filtered.filter((spot) => spot.pricePerHour === 0);
    }
    if (filters.evCharging) {
      filtered = filtered.filter((spot) => spot.spotType === 'ev');
    }
    if (filters.coveredParking) {
      filtered = filtered.filter((spot) => spot.spotType === 'covered');
    }
    if (filters.handicapAccessible) {
      filtered = filtered.filter((spot) => spot.spotType === 'handicap');
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map((spot) => ({
        ...spot,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        ),
      }));
    }

    setFilteredSpots(filtered);
  }, [filters, spots, userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter([location.latitude, location.longitude]);
          setIsLocating(false);
          showToast('Location found!', 'success');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          showToast('Could not get your location', 'error');
        }
      );
    } else {
      setIsLocating(false);
      showToast('Geolocation not supported', 'error');
    }
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number; name: string }) => {
    setMapCenter([location.latitude, location.longitude]);
    showToast(`Showing results near ${location.name}`, 'info');
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleNavigate = (spot: ParkingSpot) => {
    setNavigatingTo(spot);
    setSelectedSpot(null);

    // Create a simple route polyline (in production, use a routing API)
    if (userLocation) {
      const route: [number, number][] = [
        [userLocation.latitude, userLocation.longitude],
        [spot.latitude, spot.longitude],
      ];
      setRoutePolyline(route);
    }

    showToast('Route calculated!', 'success');
  };

  const handleStartNavigation = () => {
    if (navigatingTo) {
      // Deep link to Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${navigatingTo.latitude},${navigatingTo.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleCancelNavigation = () => {
    setNavigatingTo(null);
    setRoutePolyline([]);
  };

  const handleReport = (isFree: boolean) => {
    if (!userLocation) {
      showToast('Please enable location to report spots', 'warning');
      return;
    }

    setIsVerifying(true);

    // Simulate geofence validation
    setTimeout(() => {
      setIsVerifying(false);
      setUserPoints((prev) => prev + 10);
      setReportsCount((prev) => prev + 1);
      showToast(`Spot reported as ${isFree ? 'free' : 'taken'}! +10 points`, 'success');
    }, 1500);
  };

  const handleBook = (spot: ParkingSpot) => {
    setSelectedSpot(null);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingDetails: {
    startTime: Date;
    endTime: Date;
    licensePlate: string;
  }) => {
    if (!selectedSpot && !navigatingTo) return;

    const spot = selectedSpot || navigatingTo;
    if (!spot) return;

    const duration = (bookingDetails.endTime.getTime() - bookingDetails.startTime.getTime()) / (1000 * 60 * 60);
    const totalPrice = spot.pricePerHour * duration;

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      spotId: spot.id,
      spotName: spot.name,
      startTime: bookingDetails.startTime,
      endTime: bookingDetails.endTime,
      licensePlate: bookingDetails.licensePlate,
      qrCode: 'QR_CODE_PLACEHOLDER',
      totalPrice,
    };

    setActiveBooking(booking);
    setShowBookingModal(false);
    showToast('Booking confirmed!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Top UI Layer */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 space-y-4">
        <SearchBar onLocationSelect={handleLocationSelect} />
        <FilterToggle filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Map */}
      <MapContainer
        spots={filteredSpots}
        userLocation={userLocation}
        onSpotClick={handleSpotClick}
        routePolyline={routePolyline}
        center={mapCenter}
      />

      {/* Floating Action Buttons */}
      <LocationFAB onLocate={handleLocateMe} isLocating={isLocating} />
      <ReportSpotButton onReport={handleReport} isVerifying={isVerifying} />

      {/* Gamification Banner */}
      <GamificationBanner points={userPoints} reportsCount={reportsCount} />

      {/* Navigation Header */}
      {navigatingTo && userLocation && (
        <NavigationHeader
          spot={navigatingTo}
          distance={
            navigatingTo.distance ||
            calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              navigatingTo.latitude,
              navigatingTo.longitude
            )
          }
          eta={Math.round(
            (navigatingTo.distance ||
              calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                navigatingTo.latitude,
                navigatingTo.longitude
              )) *
              60 /
              30
          )} // Assuming 30 mph average speed
          onStartNavigation={handleStartNavigation}
          onCancel={handleCancelNavigation}
        />
      )}

      {/* Modals */}
      {selectedSpot && (
        <SpotDetailsModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onNavigate={handleNavigate}
          onBook={handleBook}
        />
      )}

      {showBookingModal && (selectedSpot || navigatingTo) && (
        <BookingModal
          spot={(selectedSpot || navigatingTo)!}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
