# ParkWise Component Architecture

This document provides a detailed breakdown of all components, their props, and usage examples for GitHub Copilot prompting.

---

## 🗺️ Map Components

### MapContainer
**File:** `frontend/src/components/MapContainer.tsx`

**Purpose:** Core map interface using Leaflet and OpenStreetMap

**Props:**
```typescript
{
  spots: ParkingSpot[];              // Array of parking spots to display
  userLocation: UserLocation | null; // User's current position
  onSpotClick: (spot: ParkingSpot) => void; // Callback when marker clicked
  routePolyline?: [number, number][]; // Route coordinates to draw
  center?: [number, number];          // Map center coordinates
  zoom?: number;                      // Zoom level (default: 13)
}
```

**Features:**
- Custom marker icons with color coding
- Smooth map animations (flyTo)
- Route polyline rendering
- Popup on marker click
- Responsive full-screen layout

**Copilot Prompt Example:**
```
"Add a heatmap layer to MapContainer that shows parking density using Leaflet.heat plugin"
```

---

## 🔍 Search & Discovery Components

### SearchBar
**File:** `frontend/src/components/SearchBar.tsx`

**Purpose:** Autocomplete location search with geocoding

**Props:**
```typescript
{
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    name: string;
  }) => void;
}
```

**Features:**
- Debounced search (500ms)
- Nominatim API integration
- Dropdown results with icons
- Click-outside to close
- Loading spinner

**Copilot Prompt Example:**
```
"Add recent searches to SearchBar that persist in localStorage and show as quick options"
```

---

### FilterToggle
**File:** `frontend/src/components/FilterToggle.tsx`

**Purpose:** Pill-style filter buttons for spot types

**Props:**
```typescript
{
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

// FilterOptions type:
{
  freeOnly: boolean;
  evCharging: boolean;
  coveredParking: boolean;
  handicapAccessible: boolean;
}
```

**Features:**
- Toggle on/off states
- Visual feedback (scale animation)
- Icon + label design
- Responsive wrapping

**Copilot Prompt Example:**
```
"Add a price range slider filter to FilterToggle with min/max values"
```

---

## 📍 Spot Information Components

### SpotDetailsModal
**File:** `frontend/src/components/SpotDetailsModal.tsx`

**Purpose:** Bottom sheet modal showing parking spot details

**Props:**
```typescript
{
  spot: ParkingSpot | null;
  onClose: () => void;
  onNavigate: (spot: ParkingSpot) => void;
  onBook?: (spot: ParkingSpot) => void;
}
```

**Features:**
- Slide-up animation
- Availability badges
- Verified IoT indicator
- Price and distance display
- Action buttons (Navigate, Book)
- Backdrop click to close

**Copilot Prompt Example:**
```
"Add a photo gallery to SpotDetailsModal showing parking spot images with swipe navigation"
```

---

## 🧭 Navigation Components

### NavigationHeader
**File:** `frontend/src/components/NavigationHeader.tsx`

**Purpose:** Top banner showing active navigation details

**Props:**
```typescript
{
  spot: ParkingSpot;
  distance: number;        // In miles
  eta: number;             // In minutes
  onStartNavigation: () => void;
  onCancel: () => void;
}
```

**Features:**
- Fixed top positioning
- Distance and ETA display
- Start navigation button (deep links to Google Maps)
- Cancel button
- Slide-down animation

**Copilot Prompt Example:**
```
"Add turn-by-turn instructions to NavigationHeader with voice guidance support"
```

---

## 🎮 Interaction Components

### LocationFAB
**File:** `frontend/src/components/LocationFAB.tsx`

**Purpose:** Floating action button to get user location

**Props:**
```typescript
{
  onLocate: () => void;
  isLocating: boolean;
}
```

**Features:**
- Fixed bottom-right position
- Loading spinner state
- Hover scale animation
- Disabled state handling

**Copilot Prompt Example:**
```
"Add a compass mode to LocationFAB that rotates the map based on device orientation"
```

---

### ReportSpotButton
**File:** `frontend/src/components/ReportSpotButton.tsx`

**Purpose:** FAB with expandable options for crowdsourcing

**Props:**
```typescript
{
  onReport: (isFree: boolean) => void;
  isVerifying: boolean;
}
```

**Features:**
- Expandable menu (slide-up)
- Two options: Free/Taken
- Rotation animation on expand
- Loading state during verification

**Copilot Prompt Example:**
```
"Add photo upload capability to ReportSpotButton for visual verification"
```

---

## 🏆 Gamification Components

### GamificationBanner
**File:** `frontend/src/components/GamificationBanner.tsx`

**Purpose:** Display user points and contribution stats

**Props:**
```typescript
{
  points: number;
  reportsCount: number;
}
```

**Features:**
- Fixed top-left position
- Gradient trophy icon
- Points and report count
- Compact card design

**Copilot Prompt Example:**
```
"Create a leaderboard modal that opens from GamificationBanner showing top contributors"
```

---

## 🎫 Booking Components

### BookingModal
**File:** `frontend/src/components/BookingModal.tsx`

**Purpose:** Reservation form for parking spots

**Props:**
```typescript
{
  spot: ParkingSpot;
  onClose: () => void;
  onConfirm: (booking: {
    startTime: Date;
    endTime: Date;
    licensePlate: string;
  }) => void;
}
```

**Features:**
- DateTime picker for start time
- Duration slider (1-12 hours)
- License plate input (auto-uppercase)
- Real-time price calculation
- Form validation

**Copilot Prompt Example:**
```
"Add payment method selection to BookingModal with credit card and digital wallet options"
```

---

### ActiveTicketView
**File:** `frontend/src/components/ActiveTicketView.tsx`

**Purpose:** Display active booking with QR code

**Props:**
```typescript
{
  booking: Booking;
  onClose: () => void;
}
```

**Features:**
- QR code display (placeholder)
- Countdown timer (updates every second)
- Booking details grid
- Total price display
- Auto-updates remaining time

**Copilot Prompt Example:**
```
"Integrate a real QR code generator in ActiveTicketView using qrcode.react library"
```

---

## 🔔 Notification Components

### Toast
**File:** `frontend/src/components/Toast.tsx`

**Purpose:** Temporary notification messages

**Props:**
```typescript
{
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number; // Default: 3000ms
}
```

**Features:**
- Auto-dismiss after duration
- Color-coded by type
- Icon per type
- Slide-up animation
- Manual close button

**Copilot Prompt Example:**
```
"Create a toast queue system that stacks multiple toasts vertically"
```

---

## 📊 Type Definitions

### ParkingSpot
```typescript
{
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  isVerified: boolean;
  spotType: 'standard' | 'ev' | 'covered' | 'handicap';
  pricePerHour: number;
  distance?: number;
  lastUpdated: Date;
}
```

### UserLocation
```typescript
{
  latitude: number;
  longitude: number;
}
```

### Booking
```typescript
{
  id: string;
  spotId: string;
  spotName: string;
  startTime: Date;
  endTime: Date;
  licensePlate: string;
  qrCode: string;
  totalPrice: number;
}
```

### FilterOptions
```typescript
{
  freeOnly: boolean;
  evCharging: boolean;
  coveredParking: boolean;
  handicapAccessible: boolean;
}
```

---

## 🎨 Styling Guidelines

### Tailwind Classes Used

**Colors:**
- `primary` - #aa3bff (purple)
- `primary-dark` - #8a2fd9
- `primary-light` - #c084fc

**Common Patterns:**
```css
/* Buttons */
.btn-primary: bg-primary hover:bg-primary-dark text-white rounded-xl

/* Cards */
.card: bg-white rounded-2xl shadow-xl p-6

/* Modals */
.modal: fixed inset-0 z-50 animate-slide-up

/* FABs */
.fab: fixed bottom-6 right-6 rounded-full shadow-2xl
```

**Animations:**
- `animate-slide-up` - Bottom to top
- `animate-slide-down` - Top to bottom
- `animate-fade-in` - Opacity 0 to 1

---

## 🔌 API Integration

### Service Layer
**File:** `frontend/src/services/api.ts`

**Available Functions:**
```typescript
getParkingSpots(params?)      // Get all spots with filters
getParkingSpot(id)            // Get single spot
updateSpotAvailability(id, isAvailable)
submitReport(report)          // Crowdsource report
createBooking(booking)        // Create reservation
getUserBookings(userId)       // Get user's bookings
getUserStats(userId)          // Get points/stats
calculateRoute(params)        // Get route data
```

**Usage Example:**
```typescript
import { getParkingSpots } from '../services/api';

const spots = await getParkingSpots({
  lat: 37.7749,
  lng: -122.4194,
  radius: 5,
  available: true
});
```

---

## 🚀 Component Creation Patterns

### Creating a New Component with Copilot

**1. Define the Interface:**
```typescript
// Prompt: "Create a ParkingHistoryCard component that shows past bookings"
interface ParkingHistoryCardProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}
```

**2. Component Structure:**
```typescript
export default function ParkingHistoryCard({ 
  bookings, 
  onSelectBooking 
}: ParkingHistoryCardProps) {
  // Copilot will generate the component body
}
```

**3. Styling Pattern:**
```typescript
// Use Tailwind classes matching the existing design system
className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
```

---

## 📦 State Management Patterns

### App-Level State (App.tsx)
```typescript
// Parking data
const [spots, setSpots] = useState<ParkingSpot[]>([]);
const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);

// User state
const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
const [userPoints, setUserPoints] = useState(0);

// UI state
const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
const [showModal, setShowModal] = useState(false);

// Navigation state
const [navigatingTo, setNavigatingTo] = useState<ParkingSpot | null>(null);
const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
```

### Component-Level State
```typescript
// Local UI state only
const [isLoading, setIsLoading] = useState(false);
const [query, setQuery] = useState('');
```

---

## 🧪 Testing Patterns

### Component Testing Prompt
```
"Create Jest tests for the SearchBar component covering search, selection, and error states"
```

### Integration Testing Prompt
```
"Create Cypress E2E tests for the complete booking flow from search to confirmation"
```

---

## 🎯 Common Copilot Prompts

### Adding Features
```
"Add a favorites feature that lets users save spots to localStorage"
"Create a parking history timeline showing past bookings"
"Add a price comparison chart to compare spot prices"
```

### Enhancing Existing
```
"Add photo upload to the report spot feature"
"Enhance the map with clustering for dense areas"
"Add real-time availability updates using WebSockets"
```

### Styling
```
"Add dark mode support to all components"
"Create a mobile-first responsive layout for tablets"
"Add loading skeletons to all data-fetching components"
```

### Performance
```
"Add React.memo to optimize MapContainer re-renders"
"Implement virtual scrolling for large spot lists"
"Add lazy loading for map markers"
```

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile First */
default: 0-640px

/* Tablet */
sm: 640px
md: 768px

/* Desktop */
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Usage:**
```typescript
className="px-4 md:px-6 lg:px-8"  // Responsive padding
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"  // Responsive grid
```

---

This component architecture is designed to be modular, reusable, and easy to extend with GitHub Copilot!
