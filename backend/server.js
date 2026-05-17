require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const ParkingLocation = require('./models/ParkingSpot');   // model is now ParkingLocation
const ParkingSlot = require('./models/ParkingSlot');
const Reservation = require('./models/Reservation');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

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

// ─── Parking Location Routes ─────────────────────────────────────────────────

// GET /api/parking-spots — all locations, join slots from ParkingSlot via camera_id
app.get('/api/parking-spots', async (req, res) => {
  try {
    const locations = await ParkingLocation.find().lean();
    const { lat, lng, radius_km } = req.query;

    // Fetch all slots and group by camera_id
    const allSlots = await ParkingSlot.find().lean();
    const slotsByCamera = {};
    for (const slot of allSlots) {
      if (!slotsByCamera[slot.camera_id]) slotsByCamera[slot.camera_id] = [];
      slotsByCamera[slot.camera_id].push(slot);
    }

    let result = locations.map(loc => {
      const distKm = (lat && lng)
        ? calcDistanceKm(parseFloat(lat), parseFloat(lng), loc.gps_lat, loc.gps_lng)
        : null;
      const slots = slotsByCamera[loc.camera_id] || [];
      const vacantCount = slots.filter(s => s.status === 'Vacant').length;
      return {
        spot_id: loc.location_id,
        location_id: loc.location_id,
        camera_id: loc.camera_id,
        name: loc.name,
        gps_lat: loc.gps_lat,
        gps_lng: loc.gps_lng,
        video_path: loc.video_path,
        isVerified: loc.isVerified,
        status: vacantCount > 0 ? 'Vacant' : 'Occupied',
        total_slots: slots.length,
        vacant_slots: vacantCount,
        slots,                           // full slot docs including bbox
        lastUpdated: loc.lastUpdated,
        distance_km: distKm,
        distance: distKm !== null ? distKm * 0.621371 : null,
      };
    });

    if (lat && lng && radius_km) {
      const r = parseFloat(radius_km);
      result = result.filter(s => s.distance_km !== null && s.distance_km <= r);
    }
    if (lat && lng) {
      result.sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/find/parking — Triggered when search occurs, receives camera video paths
app.post('/api/find/parking', async (req, res) => {
  try {
    const { cameras } = req.body;
    if (!cameras || !Array.isArray(cameras)) {
      return res.status(400).json({ error: 'Expected an array of cameras' });
    }

    console.log(`\n[CV Pipeline] Received request to process ${cameras.length} camera(s):`);
    cameras.forEach(cam => {
      console.log(` - Camera: ${cam.camera_id} | Video: ${cam.video_path}`);
    });

    // Forward to the external processing PC via ngrok
    const externalUrl = 'https://ebony-untainted-showdown.ngrok-free.dev/parking-statu';
    fetch(externalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cameras })
    })
    .then(res => res.json())
    .then(async data => {
      console.log(`[CV Pipeline] Successfully received response from external PC`);
      if (data && data.results) {
        for (const camResult of data.results) {
          const { camera_id, available_slots, unavailable_slots } = camResult;
          
          // Update Available -> Vacant (skip if Reserved)
          if (available_slots && available_slots.length > 0) {
            await ParkingSlot.updateMany(
              { camera_id, slot_id: { $in: available_slots }, status: { $ne: 'Reserved' } },
              { $set: { status: 'Vacant', lastUpdated: new Date() } }
            );
          }
          
          // Update Unavailable -> Occupied (skip if Reserved)
          if (unavailable_slots && unavailable_slots.length > 0) {
            await ParkingSlot.updateMany(
              { camera_id, slot_id: { $in: unavailable_slots }, status: { $ne: 'Reserved' } },
              { $set: { status: 'Occupied', lastUpdated: new Date() } }
            );
          }
        }
        console.log(`[CV Pipeline] Database updated from external response.`);
      }
    })
    .catch(err => console.error(`[CV Pipeline] Failed to process external response:`, err.message));

    res.json({ message: 'CV processing initiated for cameras', count: cameras.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics — Returns real-time aggregate statistics for the admin dashboard
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const totalSlots = await ParkingSlot.countDocuments();
    const vacantSlots = await ParkingSlot.countDocuments({ status: 'Vacant' });
    const occupiedSlots = await ParkingSlot.countDocuments({ status: { $in: ['Occupied', 'Reserved'] } });
    const totalLocations = await ParkingLocation.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalSlots,
      vacantSlots,
      occupiedSlots,
      totalLocations,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/parking-spots/:location_id/slots — slots for a specific location (via camera_id)
app.get('/api/parking-spots/:location_id/slots', async (req, res) => {
  try {
    const loc = await ParkingLocation.findOne({ location_id: req.params.location_id }).lean();
    if (!loc) return res.status(404).json({ error: 'Location not found' });
    const slots = await ParkingSlot.find({ camera_id: loc.camera_id }).lean();
    res.json({ location_id: loc.location_id, name: loc.name, camera_id: loc.camera_id, slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cameras/:camera_id/slots — all slots for a camera (for CV pipeline)
app.get('/api/cameras/:camera_id/slots', async (req, res) => {
  try {
    const slots = await ParkingSlot.find({ camera_id: req.params.camera_id }).lean();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/cameras/:camera_id/slots/:slot_id/status — CV pipeline updates status
app.patch('/api/cameras/:camera_id/slots/:slot_id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const slot = await ParkingSlot.findOneAndUpdate(
      { camera_id: req.params.camera_id, slot_id: req.params.slot_id },
      { status, lastUpdated: new Date() },
      { new: true }
    );
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parking-locations/setup — run Python script and ingest JSON
app.post('/api/parking-locations/setup', async (req, res) => {
  try {
    const { name, gps_lat, gps_lng, camera_id, video_path } = req.body;
    if (!name || !gps_lat || !gps_lng || !camera_id || !video_path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const scriptDir = path.join(__dirname, '../parking-space');
    const jsonFile = path.join(scriptDir, 'parking-coords', `${camera_id}.json`);

    // Run Python CV Script
    const child = exec(`conda run -n parkwise python ParkingSpacePicker.py ${camera_id} "${video_path}"`, { cwd: scriptDir });

    child.stdout.on('data', (data) => console.log(`Python stdout: ${data}`));
    child.stderr.on('data', (data) => console.error(`Python stderr: ${data}`));

    child.on('close', async (code) => {
      console.log(`OpenCV Python script exited with code ${code}`);

      if (!fs.existsSync(jsonFile)) {
        return res.status(500).json({ error: 'JSON file was not generated' });
      }

      // Read JSON and create DB docs
      try {
        const slotsData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

        const loc = new ParkingLocation({
          location_id: `LOC_${Date.now()}`,
          name,
          gps_lat: parseFloat(gps_lat),
          gps_lng: parseFloat(gps_lng),
          camera_id,
          video_path
        });
        await loc.save();

        const slotDocs = Object.entries(slotsData).map(([key, data], idx) => {
          // Convert 'slot_1' to 'P1'
          const slotNum = key.replace('slot_', '');
          // Map python type to backend spotType enum
          const spotType = data.type === 'normal' ? 'standard' : (data.type || 'standard');
          return {
            slot_id: `P${slotNum}`,
            camera_id,
            status: 'Vacant',
            spotType,
            bbox: {
              x1: data.x1,
              y1: data.y1,
              x2: data.x2,
              y2: data.y2
            }
          };
        });

        if (slotDocs.length > 0) {
          await ParkingSlot.insertMany(slotDocs);
        }

        res.status(201).json({ message: 'Location and slots added', location: loc, slots: slotDocs.length });
      } catch (err) {
        res.status(500).json({ error: 'Error processing slots data: ' + err.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parking-locations/user-report — Create an unverified location
app.post('/api/parking-locations/user-report', async (req, res) => {
  try {
    const { gps_lat, gps_lng, num_slots } = req.body;
    if (!gps_lat || !gps_lng || !num_slots) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = Date.now();
    const camera_id = `USER_REPORT_${timestamp}`;
    const location_id = `LOC_${timestamp}`;

    // 1. Create Location
    const loc = new ParkingLocation({
      location_id,
      name: 'User Reported Spot',
      gps_lat: parseFloat(gps_lat),
      gps_lng: parseFloat(gps_lng),
      camera_id,
      isVerified: false
    });
    await loc.save();

    // 2. Create Slots
    const slotDocs = Array.from({ length: parseInt(num_slots) }).map((_, idx) => ({
      slot_id: `P${idx + 1}`,
      camera_id,
      status: 'Vacant',
      spotType: 'standard',
      bbox: { x1: 0, y1: 0, x2: 0, y2: 0 }
    }));

    if (slotDocs.length > 0) {
      await ParkingSlot.insertMany(slotDocs);
    }

    res.status(201).json({ message: 'User report saved successfully', location: loc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Reservation Routes ───────────────────────────────────────────────────────

// POST /api/reservations
app.post('/api/reservations', async (req, res) => {
  const { user_id, username, location_id, slot_id, start_time, end_time, vehicle_type } = req.body;
  if (!user_id || !location_id || !slot_id || !start_time || !end_time || !vehicle_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const loc = await ParkingLocation.findOne({ location_id }).lean();
    if (!loc) return res.status(404).json({ error: 'Location not found' });

    const slot = await ParkingSlot.findOne({ camera_id: loc.camera_id, slot_id });
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.status !== 'Vacant') return res.status(409).json({ error: `Slot ${slot_id} is already ${slot.status}` });

    // Mark slot as Reserved in ParkingSlot collection
    slot.status = 'Reserved';
    slot.reserved_by = user_id;
    slot.reserved_from = new Date(start_time);
    slot.reserved_until = new Date(end_time);
    slot.lastUpdated = new Date();
    await slot.save();

    const reservation = await Reservation.create({
      user_id, username, location_id, location_name: loc.name,
      slot_id, start_time: new Date(start_time), end_time: new Date(end_time),
      vehicle_type
    });
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/user/:userId
app.get('/api/reservations/user/:userId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.params.userId }).sort({ created_at: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reservations/:id — cancel and free the slot
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    reservation.status = 'cancelled';
    await reservation.save();

    // Free the slot in ParkingSlot collection
    const loc = await ParkingLocation.findOne({ location_id: reservation.location_id }).lean();
    if (loc) {
      await ParkingSlot.findOneAndUpdate(
        { camera_id: loc.camera_id, slot_id: reservation.slot_id },
        { status: 'Vacant', reserved_by: null, reserved_until: null, lastUpdated: new Date() }
      );
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Seed Demo Data ───────────────────────────────────────────────────────────
async function seedIfEmpty() {
  const locCount = await ParkingLocation.countDocuments();
  if (locCount === 0) {
    // Seed locations
    await ParkingLocation.insertMany([
      { location_id: 'DOWNTOWN_LOT4', camera_id: 'CAM_DT_08', name: 'Downtown Lot 4', gps_lat: 15.4909, gps_lng: 73.8278 },
      { location_id: 'MARKET_LOT2', camera_id: 'CAM_MK_02', name: 'Market Street Lot 2', gps_lat: 15.4925, gps_lng: 73.8295 },
      { location_id: 'CIVIC_LOT1', camera_id: 'CAM_CV_04', name: 'Civic Center Lot 1', gps_lat: 15.4935, gps_lng: 73.8265 },
      { location_id: 'STATION_LOT3', camera_id: 'CAM_ST_11', name: 'Station Road Lot 3', gps_lat: 15.4900, gps_lng: 73.8260 },
    ]);

    // Seed slots with bbox coordinates (pixel coords in 640x480 video frame)
    // x1,y1 = top-left  |  x2,y2 = bottom-right
    const makeBbox = (x1, y1, w, h) => ({ x1, y1, x2: x1 + w, y2: y1 + h });
    const statuses = ['Vacant', 'Occupied', 'Vacant', 'Occupied', 'Vacant', 'Vacant'];
    const slotDefs = [
      ...['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((id, i) => ({ camera_id: 'CAM_DT_08', slot_id: id, bbox: makeBbox(20 + i * 100, 60, 80, 60), status: statuses[i] })),
      ...['P1', 'P2', 'P3', 'P4'].map((id, i) => ({ camera_id: 'CAM_MK_02', slot_id: id, bbox: makeBbox(20 + i * 130, 80, 80, 60), status: statuses[i] })),
      ...['P1', 'P2', 'P3', 'P4', 'P5'].map((id, i) => ({ camera_id: 'CAM_CV_04', slot_id: id, bbox: makeBbox(20 + i * 110, 70, 80, 60), status: statuses[i] })),
      ...['P1', 'P2', 'P3'].map((id, i) => ({ camera_id: 'CAM_ST_11', slot_id: id, bbox: makeBbox(20 + i * 150, 90, 80, 60), status: statuses[i] })),
    ];
    await ParkingSlot.insertMany(slotDefs);
    console.log('🌱 Seeded parking locations + slots with bbox into MongoDB');
  }
}
// mongoose.connection.once('open', seedIfEmpty); // Disabled to prevent mock data insertion

// Routes


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

// Helper function to calculate distance (used by new routes)
function calcDistanceMiles(lat1, lon1, lat2, lon2) {
  return calculateDistance(lat1, lon1, lat2, lon2);
}

// Helper function to calculate distance in km
function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const allowedRoles = ['user', 'admin'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already taken' });
    const user = await User.create({ username, password, role: role || 'user' });
    res.json({
      message: 'Registered successfully',
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const query = role ? { username, role } : { username };
    const user = await User.findOne(query);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({
      message: 'Login successful',
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ─── Background Worker ─────────────────────────────────────────────────────────

// Periodically check reservations every 30 seconds
setInterval(async () => {
  try {
    const now = new Date();
    
    // 1. If slot is Reserved and start_time has passed -> Mark as Occupied
    const toOccupy = await ParkingSlot.updateMany(
      { status: 'Reserved', reserved_from: { $lte: now } },
      { $set: { status: 'Occupied' } }
    );
    if (toOccupy.modifiedCount > 0) {
      console.log(`[Cron] Marked ${toOccupy.modifiedCount} slots as Occupied (reservation started).`);
    }

    // 2. If slot is Reserved or Occupied and end_time has passed -> Mark as Vacant
    const toVacate = await ParkingSlot.updateMany(
      { status: { $in: ['Reserved', 'Occupied'] }, reserved_until: { $lt: now } },
      { $set: { status: 'Vacant', reserved_by: null, reserved_from: null, reserved_until: null } }
    );
    if (toVacate.modifiedCount > 0) {
      console.log(`[Cron] Marked ${toVacate.modifiedCount} slots as Vacant (reservation ended).`);
    }
  } catch (err) {
    console.error('[Cron] Error updating slot statuses:', err.message);
  }
}, 30000);


// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ParkWise backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
