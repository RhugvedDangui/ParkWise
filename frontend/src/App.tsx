import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import NearbySpotsList from './components/NearbySpotsList';
import AddSpotFAB from './components/AddSpotFAB';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import ReportSpotModal from './components/ReportSpotModal';
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

function MapView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<ParkingSpot | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [allRouteLines, setAllRouteLines] = useState<[number, number][][]>([]);
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

  // Helper to map DB spot → frontend ParkingSpot (preserve slots data)
  const mapDbSpot = (s: any, userLat?: number, userLng?: number): ParkingSpot => ({
    id: s.spot_id,
    name: s.name || s.spot_id.replace(/_/g, ' '),
    latitude: s.gps_lat,
    longitude: s.gps_lng,
    isAvailable: s.status === 'Vacant',
    isVerified: !!s.camera_id,
    spotType: 'standard',
    pricePerHour: 0,
    lastUpdated: new Date(s.lastUpdated),
    distance: (userLat && userLng)
      ? s.distance ?? calculateDistance(userLat, userLng, s.gps_lat, s.gps_lng)
      : s.distance,
    video_path: s.video_path,
    camera_id: s.camera_id,
    // Extra fields passed through for modal
    ...(s as any),
  });

  // Fetch spots from backend (pass user location if available for sorting)
  const fetchSpots = async (lat?: number, lng?: number) => {
    try {
      const url = lat && lng
        ? `http://localhost:3001/api/parking-spots?lat=${lat}&lng=${lng}&radius_km=1`
        : 'http://localhost:3001/api/parking-spots';
      const res = await fetch(url);
      const data = await res.json();
      const mapped = data.map((s: any) => mapDbSpot(s, lat, lng));
      setSpots(mapped);
    } catch {
      setToast({ message: 'Could not load spots from server', type: 'error' });
    }
  };

  // Auto-geolocate on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter([loc.latitude, loc.longitude]);
          setIsLocating(false);
          fetchSpots(loc.latitude, loc.longitude);
        },
        () => {
          setIsLocating(false);
          fetchSpots(); // fetch without location
        }
      );
    } else {
      fetchSpots();
    }
  }, []);

  // Polling interval for live updates (depends on latest mapCenter or userLocation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (mapCenter) {
        fetchSpots(mapCenter[0], mapCenter[1]);
      } else if (userLocation) {
        fetchSpots(userLocation.latitude, userLocation.longitude);
      } else {
        fetchSpots();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [mapCenter, userLocation]);

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

  const handleLocationSelect = async (location: { latitude: number; longitude: number; name: string }) => {
    setMapCenter([location.latitude, location.longitude]);
    setToast({ message: `🔍 Searching parking spots near ${location.name.split(',')[0]}...`, type: 'info' });

    try {
      const res = await fetch(
        `http://localhost:3001/api/parking-spots?lat=${location.latitude}&lng=${location.longitude}&radius_km=1`
      );
      const data = await res.json();
      const mapped = data.map((s: any) => mapDbSpot(s, userLocation?.latitude, userLocation?.longitude));
      setSpots(mapped);

      if (mapped.length === 0) {
        setToast({ message: 'No parking spots found within 1km of that location', type: 'warning' });
      } else {
        setToast({ message: `Found ${mapped.length} parking spot${mapped.length > 1 ? 's' : ''} nearby!`, type: 'success' });

        // --- Trigger CV Pipeline ---
        // Collect all spots that have a video_path and a camera_id
        const camerasToCheck = mapped
          .filter(spot => spot.video_path && spot.camera_id)
          .map(spot => ({
            camera_id: spot.camera_id,
            video_path: spot.video_path
          }));

        // Deduplicate cameras since multiple slots might belong to the same camera
        const uniqueCameras = Array.from(new Map(camerasToCheck.map(item => [item.camera_id, item])).values());

        if (uniqueCameras.length > 0) {
          fetch('http://localhost:3001/api/find/parking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cameras: uniqueCameras })
          }).catch(err => console.error('Failed to trigger CV pipeline:', err));
        }

        // Draw route lines from user location to each spot
        if (userLocation) {
          const lines: [number, number][][] = mapped.map((spot: ParkingSpot) => [
            [userLocation.latitude, userLocation.longitude],
            [spot.latitude, spot.longitude],
          ]);
          setAllRouteLines(lines);
        }
      }
    } catch {
      setToast({ message: 'Could not fetch spots from server', type: 'error' });
    }
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

  const [showReportModal, setShowReportModal] = useState(false);

  const handleAddSpot = () => {
    setShowReportModal(true);
  };

  const handleReportSuccess = (numSpots: number) => {
    showToast(`Successfully reported ${numSpots} unverified spots! +50 points`, 'success');
    setUserPoints((prev) => prev + 50);
    setReportsCount((prev) => prev + 1);
    // Optionally fetch spots here
    if (userLocation) fetchSpots(userLocation.latitude, userLocation.longitude);
  };

  // Dark mode state for the User side
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Top UI Layer */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 pointer-events-none flex justify-between items-start">
        <div className="flex justify-end gap-6 h-full w-full">
          {/* Top Search Bar */}
          <div className="pointer-events-auto flex-1 max-w-2xl absolute top-6 left-1/2 -translate-x-1/2">
            <SearchBar onLocationSelect={handleLocationSelect} />
          </div>

          {/* Right Sidebar for Nearby Spots */}
          <div className="h-[calc(100vh-48px)] pt-16">
            <NearbySpotsList spots={filteredSpots} onSpotClick={handleSpotClick} />
          </div>
        </div>
      </div>

      {/* User Badge & Theme Toggle */}
      <div className="fixed top-6 left-6 z-[1000] flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-2xl px-5 py-3 shadow-lg">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold ${user?.role === 'admin' ? 'bg-amber-500' : 'bg-blue-600'}`}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.username}</div>
            <div className={`text-xs font-semibold capitalize ${user?.role === 'admin' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>{user?.role}</div>
          </div>
          <button onClick={logout} className="ml-1 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Logout">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <MapContainer
        spots={filteredSpots}
        userLocation={userLocation}
        onSpotClick={handleSpotClick}
        routePolyline={routePolyline}
        allRouteLines={allRouteLines}
        center={mapCenter}
        darkMode={darkMode}
      />

      {/* Action Buttons */}
      <AddSpotFAB onAdd={handleAddSpot} />

      {/* Admin Dashboard Access */}
      {user?.role === 'admin' && (
        <button
          onClick={() => navigate('/admin')}
          className="absolute bottom-24 right-4 z-[1000] bg-gray-900 hover:bg-gray-800 text-amber-400 p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-110 flex items-center gap-2 font-bold text-sm border border-amber-500/30"
          aria-label="Admin Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Admin Panel
        </button>
      )}

      {/* Report Spot Modal */}
      {showReportModal && (
        <ReportSpotModal
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
        />
      )}

      {/* Spot Details Modal */}
      {selectedSpot && (
        <SpotDetailsModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
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

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />} />
      <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
      <Route path="/" element={user ? <MapView /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
