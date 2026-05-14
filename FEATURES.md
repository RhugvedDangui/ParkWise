# ParkWise Features Guide

Visual walkthrough of all features and how to use them.

---

## 🗺️ 1. Core Map Interface

### What You See
- **Full-screen interactive map** powered by OpenStreetMap
- **Color-coded markers**:
  - 🟢 Green = Available parking
  - 🔴 Red = Occupied parking
  - ⚡ Yellow with lightning = EV charging station
  - 📍 Blue = Your current location

### How to Use
1. **Pan**: Click and drag the map
2. **Zoom**: Use mouse wheel or +/- buttons
3. **Click marker**: View spot details
4. **Double-click map**: Zoom in

### Features
- Smooth animations when moving
- Real-time marker updates
- Route visualization
- Custom marker designs

---

## 🔍 2. Search Bar

### Location
Top center of the screen

### What It Does
Finds any address, landmark, or place name worldwide

### How to Use
1. Click the search bar
2. Type at least 3 characters
3. Wait for autocomplete suggestions
4. Click a result
5. Map centers on that location

### Features
- **Debounced search** - Waits 500ms after you stop typing
- **Geocoding** - Converts addresses to coordinates
- **Autocomplete** - Shows up to 5 results
- **Loading indicator** - Spinner while searching
- **Click outside to close** - Dropdown closes automatically

### Example Searches
- "Times Square, New York"
- "Eiffel Tower"
- "123 Main Street, San Francisco"
- "Golden Gate Bridge"

---

## 🎛️ 3. Filter Toggle

### Location
Below the search bar

### Available Filters
1. **💰 Free Only** - Show only free parking spots
2. **⚡ EV Charging** - Electric vehicle charging stations
3. **🏠 Covered** - Covered/indoor parking
4. **♿ Accessible** - Handicap accessible spots

### How to Use
1. Click any filter pill
2. Active filters turn purple and scale up
3. Click again to deactivate
4. Multiple filters can be active
5. Map updates instantly

### Behavior
- Filters are cumulative (AND logic)
- Distance is recalculated for filtered results
- Original spots remain in memory

---

## 📍 4. Spot Details Modal

### How to Open
Click any parking marker on the map

### Information Shown
- **Spot name** - e.g., "Downtown Parking Garage"
- **Availability status** - Available (green) or Occupied (red)
- **Verification badge** - "Verified IoT" for sensor-equipped spots
- **Price** - Per hour rate in large text
- **Distance** - Miles from your location (if available)
- **Spot type** - Standard, EV, Covered, or Accessible
- **Last updated** - Timestamp of last status change

### Actions
1. **Navigate** - Calculate route and show directions
2. **Book Now** - Reserve the spot (if available)
3. **Close** - Click X or backdrop

### Features
- Slide-up animation
- Backdrop blur
- Responsive layout
- Touch-friendly buttons

---

## 🧭 5. Navigation

### How to Start
1. Click a parking marker
2. Click "Navigate" in the spot details
3. Navigation header appears at top

### Navigation Header Shows
- **Destination name**
- **Distance** - In miles
- **ETA** - Estimated time in minutes
- **Start Navigation** button
- **Cancel** button

### Route Display
- Blue polyline on map
- Connects your location to the spot
- Updates if you move

### Start Navigation Button
- Opens Google Maps in new tab
- Pre-filled with destination
- Works on mobile and desktop

### Cancel Navigation
- Removes route from map
- Hides navigation header
- Returns to normal view

---

## 👥 6. Crowdsourcing (Report Spot)

### Location
Purple + button, bottom right corner

### How to Use
1. Click the purple + button
2. Menu expands with two options:
   - ✅ **Report Spot Free**
   - ❌ **Report Spot Taken**
3. Click your choice
4. "Verifying Location..." appears
5. After 1.5 seconds, confirmation shows
6. Earn +10 Smart City Points!

### Geofence Validation
- System checks if you're near a spot
- Must be within 0.05 miles
- Prevents false reports
- Ensures data accuracy

### Points System
- +10 points per report
- Points shown in trophy banner
- Report count tracked
- Future: Redeem for rewards

---

## 🏆 7. Gamification Banner

### Location
Top left corner

### Displays
- 🏆 Trophy icon with gradient
- **Smart City Points** - Your total score
- **Report count** - Number of spots reported

### How to Earn Points
- Report a spot: +10 points
- (Future) Book parking: +5 points
- (Future) Complete profile: +20 points
- (Future) Daily login: +1 point

### Future Features
- Leaderboards
- Achievement badges
- Reward redemption
- Level system

---

## 🎫 8. Booking System

### How to Book
1. Click available parking marker
2. Click "Book Now" in spot details
3. Booking modal opens

### Booking Form
1. **Start Time**
   - DateTime picker
   - Can't select past times
   - Shows calendar and clock

2. **Duration**
   - Slider from 1-12 hours
   - Large display shows selected hours
   - Real-time price calculation

3. **License Plate**
   - Text input
   - Auto-converts to uppercase
   - Required field
   - Example: ABC1234

4. **Total Price**
   - Calculated automatically
   - Price per hour × duration
   - Shown in large purple box

5. **Confirm Booking**
   - Purple button at bottom
   - Validates all fields
   - Creates booking

### After Booking
- Success toast notification
- Booking saved to system
- "View Active Ticket" button appears (bottom left)

---

## 🎟️ 9. Active Ticket View

### How to Open
Click "View Active Ticket" button (bottom left)

### Ticket Information
1. **QR Code**
   - Large display (placeholder in demo)
   - Scannable at parking entrance
   - Unique per booking

2. **Booking Details**
   - Spot name
   - License plate
   - Start time
   - End time

3. **Countdown Timer**
   - Shows time remaining
   - Updates every second
   - Format: Xh Xm Xs
   - Turns red when < 10 minutes

4. **Total Paid**
   - Final amount charged
   - Displayed prominently

### Features
- Real-time countdown
- Auto-updates
- Can't be dismissed accidentally
- Print-friendly layout

---

## 📍 10. User Location

### Location FAB
Blue circular button, bottom right (above report button)

### How to Use
1. Click the location button
2. Browser asks for permission
3. Allow location access
4. Map centers on your position
5. Blue marker shows your location

### Features
- **Loading state** - Spinner while getting location
- **Success toast** - "Location found!"
- **Error handling** - "Could not get your location"
- **Distance calculation** - Updates all spot distances
- **Auto-center** - Smooth animation to your position

### Requirements
- HTTPS or localhost
- Browser location permission
- GPS/WiFi enabled

---

## 🔔 11. Toast Notifications

### Types
1. **Success** (Green)
   - Location found
   - Booking confirmed
   - Report submitted

2. **Error** (Red)
   - Location failed
   - Booking error
   - Network issues

3. **Warning** (Yellow)
   - Location required
   - Spot unavailable

4. **Info** (Blue)
   - Search results
   - General information

### Behavior
- Appears top right
- Auto-dismisses after 3 seconds
- Can manually close with X
- Slide-up animation
- Multiple toasts stack

---

## 🎨 12. Visual Design

### Color Scheme
- **Primary**: Purple (#aa3bff)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Info**: Blue (#3b82f6)

### Typography
- **Headings**: Bold, large
- **Body**: Regular, readable
- **Buttons**: Semibold
- **Labels**: Medium weight

### Spacing
- Consistent padding
- Generous white space
- Clear visual hierarchy

### Animations
- Smooth transitions
- Slide-up modals
- Fade-in elements
- Scale on hover

---

## 📱 13. Responsive Design

### Mobile (< 640px)
- Full-screen map
- Stacked filters
- Bottom sheet modals
- Touch-optimized buttons
- Larger tap targets

### Tablet (640px - 1024px)
- Optimized layout
- Side-by-side elements
- Comfortable spacing

### Desktop (> 1024px)
- Full feature set
- Hover effects
- Keyboard shortcuts
- Mouse interactions

---

## ⌨️ 14. Keyboard Shortcuts

### Current
- **Esc** - Close any modal
- **Tab** - Navigate form fields
- **Enter** - Submit forms

### Future
- **Ctrl/Cmd + K** - Focus search
- **Ctrl/Cmd + L** - Get location
- **Ctrl/Cmd + F** - Toggle filters
- **Ctrl/Cmd + B** - Quick book

---

## ♿ 15. Accessibility

### Features
- **Semantic HTML** - Proper heading hierarchy
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - All features accessible
- **Focus indicators** - Visible focus states
- **Color contrast** - WCAG AA compliant
- **Alt text** - Images described

### Screen Reader Support
- Announces modal openings
- Describes button actions
- Reads form labels
- Announces notifications

---

## 🔄 16. Real-Time Updates

### Current
- Manual refresh
- User-triggered updates
- Crowdsourced reports

### Future (WebSocket)
- Live availability changes
- Real-time price updates
- Instant notifications
- Collaborative features

---

## 💡 17. Pro Tips

### Efficiency
1. **Save favorites** - Quick access to common spots
2. **Enable location** - Faster distance calculations
3. **Use filters** - Find exactly what you need
4. **Report spots** - Earn points and help others

### Best Practices
1. **Book in advance** - Guarantee availability
2. **Check last updated** - Verify recent data
3. **Report accurately** - Maintain data quality
4. **Arrive early** - Account for navigation time

### Hidden Features
1. **Click backdrop** - Quick close modals
2. **Drag map** - Explore nearby areas
3. **Double-click marker** - Quick details
4. **Hold filter** - See description (future)

---

## 🎯 18. Use Cases

### Daily Commuter
1. Search work address
2. Filter by price
3. Book recurring spot
4. Navigate each morning

### Event Attendee
1. Search event venue
2. Filter by distance
3. Check availability
4. Book for event duration

### Tourist
1. Search landmark
2. View nearby spots
3. Compare prices
3. Book and navigate

### Delivery Driver
1. Enable location
2. Find nearest spot
3. Quick book
4. Report when leaving

---

## 🚀 19. Performance

### Load Times
- **Initial load**: < 2 seconds
- **Map render**: < 1 second
- **Search results**: < 500ms
- **Navigation**: Instant

### Optimizations
- Lazy loading
- Debounced search
- Cached results
- Optimized images

---

## 🔐 20. Privacy & Security

### Data Collection
- Location (with permission)
- Booking details
- Usage statistics
- No personal data sold

### Security
- HTTPS only
- Secure payments (future)
- Data encryption
- Regular audits

---

## 📊 21. Statistics

### App Metrics
- 11 components
- 8 API endpoints
- 6 type definitions
- 4 filter options
- 3-second toast duration
- 1.5-second geofence check

### User Metrics (Future)
- Average booking duration
- Most popular spots
- Peak usage times
- User satisfaction score

---

## 🎓 22. Learning Resources

### For Users
- This guide (FEATURES.md)
- Quick start (QUICKSTART.md)
- FAQ (coming soon)

### For Developers
- Component docs (COMPONENTS.md)
- API documentation (README.md)
- Deployment guide (DEPLOYMENT.md)
- Roadmap (ROADMAP.md)

---

## 🆘 23. Troubleshooting

### Common Issues

**Map not loading?**
- Check internet connection
- Refresh the page
- Clear browser cache

**Location not working?**
- Allow browser permissions
- Enable device GPS
- Use HTTPS or localhost

**Search not finding results?**
- Check spelling
- Try broader terms
- Ensure internet connection

**Booking failed?**
- Check spot availability
- Verify all form fields
- Try again in a moment

---

## 📞 24. Support

### Get Help
1. Check this guide
2. Read QUICKSTART.md
3. Review README.md
4. Open GitHub issue

### Report Bugs
1. Describe the issue
2. Steps to reproduce
3. Expected behavior
4. Screenshots if possible

---

**Enjoy using ParkWise! 🚗💨**

*Making parking smart, simple, and stress-free.*
