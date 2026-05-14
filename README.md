# ParkWise - Smart Parking Solution

A comprehensive smart parking application with real-time availability tracking, crowdsourced reporting, and intelligent navigation.

## Features

### 🗺️ Core Map Interface
- Full-screen interactive map powered by OpenStreetMap
- Custom markers with visual states (Available/Occupied/EV)
- Real-time spot availability updates
- Smooth map animations and transitions

### 🔍 Search & Discovery
- Autocomplete search bar with geocoding
- Filter by parking type (Free, EV Charging, Covered, Accessible)
- Location-based search with distance calculation
- Smart spot recommendations

### 🧭 Smart Routing & Navigation
- Route visualization on map
- ETA and distance calculation
- Deep-link integration with Google Maps
- Dynamic rerouting alerts

### 👥 Crowdsourcing
- Report spot availability (Free/Taken)
- Geofence validation to ensure accuracy
- Gamification with Smart City Points
- Real-time updates from community

### 🎫 Booking & Management
- Reserve parking spots in advance
- Time selection with duration slider
- Mock payment interface
- Active ticket view with QR code
- Countdown timer for active bookings

### 📍 User Location
- "Locate Me" floating action button
- Browser geolocation integration
- Distance calculation to all spots
- User position marker on map

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Leaflet** & **React-Leaflet** for maps
- **Axios** for API calls

### Backend
- **Node.js** with Express
- RESTful API architecture
- In-memory data store (easily replaceable with database)
- CORS enabled for development

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
ParkWise/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapContainer.tsx          # Main map component
│   │   │   ├── SearchBar.tsx             # Location search
│   │   │   ├── FilterToggle.tsx          # Filter buttons
│   │   │   ├── SpotDetailsModal.tsx      # Spot information popup
│   │   │   ├── LocationFAB.tsx           # Locate me button
│   │   │   ├── ReportSpotButton.tsx      # Crowdsourcing button
│   │   │   ├── NavigationHeader.tsx      # Route guidance
│   │   │   ├── GamificationBanner.tsx    # Points display
│   │   │   ├── BookingModal.tsx          # Reservation form
│   │   │   ├── ActiveTicketView.tsx      # Ticket display
│   │   │   └── Toast.tsx                 # Notifications
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript definitions
│   │   ├── App.tsx                       # Main application
│   │   ├── App.css                       # Styles
│   │   └── main.tsx                      # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── server.js                         # Express API server
│   └── package.json
└── README.md
```

## API Endpoints

### Parking Spots
- `GET /api/spots` - Get all parking spots (with optional filters)
- `GET /api/spots/:id` - Get single spot details
- `PUT /api/spots/:id/availability` - Update spot availability

### Reports (Crowdsourcing)
- `POST /api/reports` - Submit a parking spot report

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/user/:userId` - Get user's bookings

### User Stats (Gamification)
- `GET /api/users/:userId/stats` - Get user points and statistics

### Routing
- `POST /api/route` - Calculate route between two points

## Component Usage with GitHub Copilot

When extending this application with Copilot, use these prompts:

### Map Components
```
"Create a heatmap overlay component for parking availability using Leaflet"
"Add a cluster marker component for dense parking areas"
```

### Search & Filters
```
"Create a recent searches component that stores last 5 searches in localStorage"
"Add a price range slider filter component"
```

### Booking System
```
"Create a booking history component showing past reservations"
"Add a payment method selector component with card/wallet options"
```

### Gamification
```
"Create a leaderboard component showing top contributors"
"Add achievement badges component for milestones"
```

## Customization

### Adding New Spot Types
Edit `frontend/src/types/index.ts`:
```typescript
spotType: 'standard' | 'ev' | 'covered' | 'handicap' | 'motorcycle' | 'compact';
```

### Changing Map Style
Edit `frontend/src/components/MapContainer.tsx` and update the TileLayer URL to use different map styles.

### Adding Real Database
Replace the in-memory arrays in `backend/server.js` with database queries (MongoDB, PostgreSQL, etc.)

## Future Enhancements

- [ ] Real-time WebSocket updates for spot availability
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Push notifications for booking reminders
- [ ] Historical data analytics dashboard
- [ ] Mobile app (React Native)
- [ ] IoT sensor integration for verified spots
- [ ] Machine learning for availability prediction
- [ ] Multi-language support

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
