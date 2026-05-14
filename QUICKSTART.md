# ParkWise Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Install Dependencies

Open two terminal windows in the ParkWise directory.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Start Backend:**
```bash
npm start
```
✅ Backend running at http://localhost:3001

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
✅ Frontend running at http://localhost:5173

### Step 3: Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 🎯 Try These Features

### 1. Find Your Location
- Click the **blue location button** (bottom right)
- Allow browser location access
- Map will center on your position

### 2. Search for a Place
- Use the **search bar** at the top
- Type any address or landmark
- Select from autocomplete results

### 3. Filter Parking Spots
- Click filter pills below search bar:
  - 💰 **Free Only** - Show only free spots
  - ⚡ **EV Charging** - Electric vehicle spots
  - 🏠 **Covered** - Covered parking
  - ♿ **Accessible** - Handicap accessible

### 4. View Spot Details
- Click any **parking marker** on the map
- See price, distance, and availability
- Click **Navigate** to get directions
- Click **Book Now** to reserve (if available)

### 5. Report a Spot (Crowdsourcing)
- Click the **purple + button** (bottom right)
- Choose "Report Spot Free" or "Report Spot Taken"
- Earn **+10 Smart City Points**!

### 6. Book a Parking Spot
- Select an available spot
- Click **Book Now**
- Choose start time and duration
- Enter license plate
- Confirm booking

### 7. View Your Points
- Check the **trophy banner** (top left)
- See your Smart City Points
- Track your contribution count

---

## 🗺️ Understanding the Map

### Marker Colors
- 🟢 **Green** = Available parking
- 🔴 **Red** = Occupied parking
- ⚡ **Lightning** = EV charging station
- 📍 **Blue** = Your location

### Marker Types
- ✓ **Verified IoT** = Real-time sensor data
- **Crowdsourced** = Community reported

---

## 🛠️ Troubleshooting

### Backend won't start?
```bash
cd backend
npm install express
npm start
```

### Frontend won't start?
```bash
cd frontend
npm install
npm run dev
```

### Map not loading?
- Check your internet connection
- OpenStreetMap tiles require internet access

### Location not working?
- Allow location permissions in browser
- HTTPS is required for geolocation (or localhost)

### Port already in use?
**Backend (3001):**
Edit `backend/server.js` and change:
```javascript
const PORT = process.env.PORT || 3002; // Change to 3002
```

**Frontend (5173):**
Edit `frontend/vite.config.ts` and add:
```typescript
server: {
  port: 5174 // Change to 5174
}
```

---

## 📱 Mobile Testing

The app is fully responsive! Test on mobile:

1. Find your computer's local IP:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)

2. Update frontend to allow network access:
   Edit `frontend/vite.config.ts`:
   ```typescript
   server: {
     host: '0.0.0.0',
     port: 5173
   }
   ```

3. Access from mobile:
   `http://YOUR_IP:5173`

---

## 🎨 Customization Tips

### Change Default Location
Edit `frontend/src/App.tsx`:
```typescript
const defaultCenter: [number, number] = [YOUR_LAT, YOUR_LNG];
```

### Add More Mock Spots
Edit `frontend/src/App.tsx` or `backend/server.js`:
```javascript
{
  id: '5',
  name: 'Your Parking Spot',
  latitude: 37.7749,
  longitude: -122.4194,
  isAvailable: true,
  isVerified: true,
  spotType: 'standard',
  pricePerHour: 3.0,
  lastUpdated: new Date(),
}
```

### Change Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',
}
```

---

## 🤖 Using with GitHub Copilot

### Example Prompts:

**Add a feature:**
```
"Create a favorites component that lets users save their favorite parking spots"
```

**Enhance existing:**
```
"Add a price comparison feature to the SpotDetailsModal component"
```

**New component:**
```
"Create a parking history timeline component showing past bookings with dates"
```

**Styling:**
```
"Add a dark mode toggle to the app using Tailwind CSS"
```

---

## 📚 Next Steps

1. ✅ Explore all features
2. 📖 Read the full [README.md](README.md)
3. 🔧 Customize for your needs
4. 🚀 Deploy to production
5. 🤝 Contribute improvements

---

## 💡 Pro Tips

- **Keyboard Shortcuts**: Press `Esc` to close any modal
- **Quick Navigation**: Click markers directly instead of using search
- **Batch Reporting**: Report multiple spots to earn points faster
- **Smart Booking**: Book during off-peak hours for better availability

---

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review component code in `frontend/src/components/`
- Check API endpoints in `backend/server.js`
- Look at type definitions in `frontend/src/types/index.ts`

---

**Happy Parking! 🚗💨**
