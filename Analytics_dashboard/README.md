# ParkWise - Futuristic Smart Parking & Traffic Analytics Dashboard

## 🚀 Overview

**ParkWise** is an AI-powered smart parking and traffic congestion analytics dashboard designed specifically for Goa. Built with React, Tailwind CSS, and Recharts, it features a stunning anti-gravity cyberpunk aesthetic perfect for hackathon presentations.

## ✨ Features

### 🎨 Design
- **Anti-Gravity Futuristic UI** - Floating cards with smooth animations
- **Cyberpunk Aesthetics** - Neon glows, glassmorphism, and gradient effects
- **Dark/Light Mode** - Fully functional theme toggle with smooth transitions
- **Responsive Layout** - Works seamlessly on all devices

### 📊 Dashboard Pages

1. **Dashboard** - Overview with real-time analytics
   - Total parking slots, occupancy, and availability
   - Active vehicles and congestion index
   - Smart mobility score
   - CO₂ and fuel savings
   - Multiple interactive charts (Line, Bar, Area, Pie)
   - AI-powered insights panel

2. **Smart Parking** - Real-time parking zone monitoring
   - 8 parking zones across Goa (Panaji, Mapusa, Calangute, Margao, Vasco, Baga, Ponda, Porvorim)
   - Live occupancy rates and wait times
   - Congestion level indicators
   - Peak hours information

3. **Traffic Analytics** - Comprehensive traffic analysis
   - Vehicle flow analysis
   - Weekly congestion trends
   - Congestion heat index
   - AI traffic predictions
   - Zone-wise traffic status table

4. **AI Routing** - Intelligent route optimization
   - Smart route suggestions
   - Time and fuel savings calculations
   - CO₂ reduction metrics
   - Real-time AI recommendations
   - Congestion avoidance strategies

5. **Goa Traffic Zones** - Regional traffic monitoring
   - 10 monitored zones across Goa
   - Congestion heat maps
   - Zone comparisons
   - Real-time vehicle counts and speeds

6. **Sustainability** - Environmental impact tracking
   - CO₂ emissions saved
   - Fuel consumption reduction
   - Green route optimization
   - Smart mobility efficiency score
   - Carbon offset calculations
   - Air quality impact metrics

### 🎯 Goa-Specific Locations

All data uses realistic Goa locations:
- Panaji, Mapusa, Margao, Vasco, Ponda
- Calangute, Baga, Candolim, Anjuna
- Porvorim, Taleigao, Old Goa, Miramar
- And more authentic Goa regions

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **Tailwind CSS 3** - Utility-first CSS framework
- **Recharts 2** - Powerful charting library
- **Lucide React** - Beautiful icon set
- **Vite** - Lightning-fast build tool

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Setup Steps

1. **Clone or extract the project**
```bash
cd parkwise-goa
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
colors: {
  neon: {
    cyan: '#00ffff',
    blue: '#0080ff',
    purple: '#8000ff',
    // Add your colors
  }
}
```

### Data
All data is in `src/data/goaData.js`:
- Parking zones
- Traffic zones
- Hourly occupancy
- AI insights
- Sustainability metrics

## 🚀 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 📱 Features Showcase

### Anti-Gravity Effects
- Floating card animations
- Hover scale transformations
- Glow effects on cards
- Smooth transitions

### Interactive Charts
- Line charts for trends
- Bar charts for comparisons
- Area charts for flow analysis
- Pie/Donut charts for distribution
- Radial charts for scores

### Smart Features
- Real-time data updates
- AI-powered insights
- Route optimization
- Congestion predictions
- Environmental impact tracking

## 🎯 Perfect For

- 24-hour hackathons
- Smart city presentations
- Traffic management demos
- Urban mobility showcases
- Environmental impact demonstrations

## 📄 License

MIT License - Feel free to use for hackathons and presentations!

## 🙏 Credits

Built with ❤️ for Goa Smart City Initiative

---

**ParkWise** - Making Goa's traffic smarter, one route at a time! 🚗💨
