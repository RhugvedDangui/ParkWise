const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Mock database
let parkingSpots = [
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

let userReports = [];
let bookings = [];

// Routes

// Get all parking spots
app.get('/api/spots', (req, res) => {
  const { lat, lng, radius, type, available } = req.query;
  
  let filtered = [...parkingSpots];
  
  // Filter by location radius
  if (lat && lng && radius) {
    filtered = filtered.filter(spot => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        spot.latitude,
        spot.longitude
      );
      return distance <= parseFloat(radius);
    });
  }
  
  // Filter by type
  if (type) {
    filtered = filtered.filter(spot => spot.spotType === type);
  }
  
  // Filter by availability
  if (available !== undefined) {
    filtered = filtered.filter(spot => spot.isAvailable === (available === 'true'));
  }
  
  res.json(filtered);
});

// Get single parking spot
app.get('/api/spots/:id', (req, res) => {
  const spot = parkingSpots.find(s => s.id === req.params.id);
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  res.json(spot);
});

// Update spot availability (IoT simulation)
app.put('/api/spots/:id/availability', (req, res) => {
  const { isAvailable } = req.body;
  const spotIndex = parkingSpots.findIndex(s => s.id === req.params.id);
  
  if (spotIndex === -1) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  
  parkingSpots[spotIndex].isAvailable = isAvailable;
  parkingSpots[spotIndex].lastUpdated = new Date();
  
  res.json(parkingSpots[spotIndex]);
});

// Report a parking spot (crowdsourcing)
app.post('/api/reports', (req, res) => {
  const { spotId, latitude, longitude, isFree, userId } = req.body;
  
  // Validate geofence (check if user is near the spot)
  const spot = parkingSpots.find(s => s.id === spotId);
  if (spot) {
    const distance = calculateDistance(latitude, longitude, spot.latitude, spot.longitude);
    
    if (distance > 0.05) { // More than 0.05 miles away
      return res.status(400).json({ error: 'You must be near the spot to report it' });
    }
    
    // Update spot availability
    const spotIndex = parkingSpots.findIndex(s => s.id === spotId);
    parkingSpots[spotIndex].isAvailable = isFree;
    parkingSpots[spotIndex].lastUpdated = new Date();
  }
  
  const report = {
    id: Date.now().toString(),
    spotId,
    latitude,
    longitude,
    isFree,
    userId,
    timestamp: new Date(),
  };
  
  userReports.push(report);
  
  res.json({
    success: true,
    report,
    pointsEarned: 10,
  });
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const { spotId, startTime, endTime, licensePlate, userId } = req.body;
  
  const spot = parkingSpots.find(s => s.id === spotId);
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  
  if (!spot.isAvailable) {
    return res.status(400).json({ error: 'Spot is not available' });
  }
  
  const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
  const totalPrice = spot.pricePerHour * duration;
  
  const booking = {
    id: Date.now().toString(),
    spotId,
    spotName: spot.name,
    startTime,
    endTime,
    licensePlate,
    userId,
    qrCode: `QR_${Date.now()}`,
    totalPrice,
    createdAt: new Date(),
  };
  
  bookings.push(booking);
  
  // Mark spot as unavailable
  const spotIndex = parkingSpots.findIndex(s => s.id === spotId);
  parkingSpots[spotIndex].isAvailable = false;
  
  res.json(booking);
});

// Get user bookings
app.get('/api/bookings/user/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.params.userId);
  res.json(userBookings);
});

// Get user stats (gamification)
app.get('/api/users/:userId/stats', (req, res) => {
  const userReportsCount = userReports.filter(r => r.userId === req.params.userId).length;
  const points = userReportsCount * 10;
  
  res.json({
    userId: req.params.userId,
    points,
    reportsCount: userReportsCount,
    bookingsCount: bookings.filter(b => b.userId === req.params.userId).length,
  });
});

// Calculate route (simplified)
app.post('/api/route', (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.body;
  
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  const duration = Math.round((distance / 30) * 60); // Assuming 30 mph
  
  // Simple straight line polyline
  const polyline = [
    [startLat, startLng],
    [endLat, endLng],
  ];
  
  res.json({
    distance,
    duration,
    polyline,
  });
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
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
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`ParkWise backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
