// Realistic fictional data for Goa smart parking and traffic analytics

export const parkingZones = [
  {
    id: 1,
    name: "Panaji Smart Parking",
    location: "Panaji Market Area",
    totalSlots: 150,
    occupied: 127,
    available: 23,
    congestionLevel: "high",
    coordinates: { lat: 15.4909, lng: 73.8278 },
    estimatedWaitTime: "15 min",
    peakHours: "9 AM - 12 PM, 5 PM - 8 PM"
  },
  {
    id: 2,
    name: "Mapusa Market Parking",
    location: "Mapusa Municipal Market",
    totalSlots: 120,
    occupied: 98,
    available: 22,
    congestionLevel: "high",
    coordinates: { lat: 15.5909, lng: 73.8078 },
    estimatedWaitTime: "12 min",
    peakHours: "8 AM - 11 AM, 4 PM - 7 PM"
  },
  {
    id: 3,
    name: "Calangute Beach Parking",
    location: "Calangute Beach Road",
    totalSlots: 200,
    occupied: 145,
    available: 55,
    congestionLevel: "medium",
    coordinates: { lat: 15.5435, lng: 73.7554 },
    estimatedWaitTime: "8 min",
    peakHours: "10 AM - 6 PM"
  },
  {
    id: 4,
    name: "Margao Station Parking",
    location: "Margao Railway Station",
    totalSlots: 180,
    occupied: 142,
    available: 38,
    congestionLevel: "medium",
    coordinates: { lat: 15.2708, lng: 73.9528 },
    estimatedWaitTime: "10 min",
    peakHours: "7 AM - 10 AM, 5 PM - 9 PM"
  },
  {
    id: 5,
    name: "Vasco Port Parking",
    location: "Vasco da Gama Port Area",
    totalSlots: 100,
    occupied: 35,
    available: 65,
    congestionLevel: "low",
    coordinates: { lat: 15.3989, lng: 73.8151 },
    estimatedWaitTime: "3 min",
    peakHours: "8 AM - 11 AM"
  },
  {
    id: 6,
    name: "Baga Beach Parking",
    location: "Baga Beach North",
    totalSlots: 160,
    occupied: 128,
    available: 32,
    congestionLevel: "high",
    coordinates: { lat: 15.5559, lng: 73.7516 },
    estimatedWaitTime: "14 min",
    peakHours: "11 AM - 7 PM"
  },
  {
    id: 7,
    name: "Ponda Smart Hub",
    location: "Ponda City Center",
    totalSlots: 90,
    occupied: 42,
    available: 48,
    congestionLevel: "low",
    coordinates: { lat: 15.4013, lng: 74.0119 },
    estimatedWaitTime: "4 min",
    peakHours: "9 AM - 1 PM"
  },
  {
    id: 8,
    name: "Porvorim Tech Park",
    location: "Porvorim IT Hub",
    totalSlots: 250,
    occupied: 198,
    available: 52,
    congestionLevel: "medium",
    coordinates: { lat: 15.5311, lng: 73.8197 },
    estimatedWaitTime: "9 min",
    peakHours: "9 AM - 11 AM, 6 PM - 8 PM"
  }
];

export const trafficZones = [
  { zone: "Panaji", congestion: 85, vehicles: 1250, avgSpeed: 15 },
  { zone: "Mapusa", congestion: 78, vehicles: 980, avgSpeed: 18 },
  { zone: "Margao", congestion: 72, vehicles: 1100, avgSpeed: 20 },
  { zone: "Calangute", congestion: 68, vehicles: 890, avgSpeed: 22 },
  { zone: "Vasco", congestion: 45, vehicles: 650, avgSpeed: 35 },
  { zone: "Ponda", congestion: 42, vehicles: 580, avgSpeed: 38 },
  { zone: "Porvorim", congestion: 65, vehicles: 820, avgSpeed: 25 },
  { zone: "Candolim", congestion: 58, vehicles: 720, avgSpeed: 28 },
  { zone: "Anjuna", congestion: 52, vehicles: 640, avgSpeed: 30 },
  { zone: "Baga", congestion: 75, vehicles: 950, avgSpeed: 19 }
];

export const hourlyOccupancy = [
  { hour: "12 AM", occupied: 120, available: 330, vehicles: 85 },
  { hour: "2 AM", occupied: 85, available: 365, vehicles: 45 },
  { hour: "4 AM", occupied: 45, available: 405, vehicles: 28 },
  { hour: "6 AM", occupied: 98, available: 352, vehicles: 125 },
  { hour: "8 AM", occupied: 280, available: 170, vehicles: 385 },
  { hour: "10 AM", occupied: 350, available: 100, vehicles: 520 },
  { hour: "12 PM", occupied: 380, available: 70, vehicles: 580 },
  { hour: "2 PM", occupied: 410, available: 40, vehicles: 625 },
  { hour: "4 PM", occupied: 395, available: 55, vehicles: 595 },
  { hour: "6 PM", occupied: 425, available: 25, vehicles: 680 },
  { hour: "8 PM", occupied: 320, available: 130, vehicles: 485 },
  { hour: "10 PM", occupied: 180, available: 270, vehicles: 245 }
];

export const weeklyTrend = [
  { day: "Mon", occupied: 290, available: 160, congestion: 65 },
  { day: "Tue", occupied: 320, available: 130, congestion: 72 },
  { day: "Wed", occupied: 305, available: 145, congestion: 68 },
  { day: "Thu", occupied: 335, available: 115, congestion: 75 },
  { day: "Fri", occupied: 370, available: 80, congestion: 82 },
  { day: "Sat", occupied: 260, available: 190, congestion: 58 },
  { day: "Sun", occupied: 200, available: 250, congestion: 45 }
];

export const peakHoursData = [
  { hour: "12 AM", traffic: 12 },
  { hour: "1 AM", traffic: 8 },
  { hour: "2 AM", traffic: 5 },
  { hour: "3 AM", traffic: 4 },
  { hour: "4 AM", traffic: 6 },
  { hour: "5 AM", traffic: 15 },
  { hour: "6 AM", traffic: 35 },
  { hour: "7 AM", traffic: 65 },
  { hour: "8 AM", traffic: 85 },
  { hour: "9 AM", traffic: 95 },
  { hour: "10 AM", traffic: 88 },
  { hour: "11 AM", traffic: 82 },
  { hour: "12 PM", traffic: 78 },
  { hour: "1 PM", traffic: 75 },
  { hour: "2 PM", traffic: 72 },
  { hour: "3 PM", traffic: 68 },
  { hour: "4 PM", traffic: 75 },
  { hour: "5 PM", traffic: 88 },
  { hour: "6 PM", traffic: 98 },
  { hour: "7 PM", traffic: 92 },
  { hour: "8 PM", traffic: 78 },
  { hour: "9 PM", traffic: 58 },
  { hour: "10 PM", traffic: 42 },
  { hour: "11 PM", traffic: 25 }
];

export const zoneWiseUsage = [
  { zone: "Panaji", usage: 85, slots: 150 },
  { zone: "Mapusa", usage: 82, slots: 120 },
  { zone: "Calangute", usage: 73, slots: 200 },
  { zone: "Margao", usage: 79, slots: 180 },
  { zone: "Vasco", usage: 35, slots: 100 },
  { zone: "Baga", usage: 80, slots: 160 },
  { zone: "Ponda", usage: 47, slots: 90 },
  { zone: "Porvorim", usage: 79, slots: 250 }
];

export const aiInsights = [
  {
    id: 1,
    type: "success",
    title: "Lower Congestion Detected",
    message: "Traffic congestion near Porvorim reduced by 18%. Optimal time for travel.",
    location: "Porvorim",
    timestamp: "2 min ago",
    priority: "low"
  },
  {
    id: 2,
    type: "info",
    title: "Parking Availability Forecast",
    message: "Panaji occupancy expected to reduce after 8 PM. 45+ slots will be available.",
    location: "Panaji",
    timestamp: "5 min ago",
    priority: "medium"
  },
  {
    id: 3,
    type: "warning",
    title: "Alternate Route Suggested",
    message: "High traffic on Panaji-Mapusa route. Suggested alternate via Taleigao saves 12 min.",
    location: "Taleigao",
    timestamp: "8 min ago",
    priority: "high"
  },
  {
    id: 4,
    type: "alert",
    title: "High Tourist Traffic",
    message: "Baga Beach area experiencing 85% congestion. Estimated wait time: 14 minutes.",
    location: "Baga",
    timestamp: "10 min ago",
    priority: "high"
  },
  {
    id: 5,
    type: "success",
    title: "Reduced Waiting Time",
    message: "AI routing optimization reduced average waiting time by 12 minutes in Margao.",
    location: "Margao",
    timestamp: "15 min ago",
    priority: "medium"
  },
  {
    id: 6,
    type: "info",
    title: "Smart Parking Available",
    message: "Vasco Port Parking has 65 available slots. Low congestion detected.",
    location: "Vasco",
    timestamp: "18 min ago",
    priority: "low"
  }
];

export const sustainabilityMetrics = {
  fuelSavedToday: "2,450 L",
  co2Reduced: "6,125 kg",
  idleTimeReduced: "18,500 min",
  mobilityScore: 87,
  trafficReduction: "23%",
  greenRoutes: 145,
  efficientTrips: 3250,
  carbonOffset: "8.2 tons"
};

export const vehicleFlowData = [
  { time: "6 AM", inflow: 45, outflow: 12 },
  { time: "7 AM", inflow: 125, outflow: 35 },
  { time: "8 AM", inflow: 185, outflow: 58 },
  { time: "9 AM", inflow: 220, outflow: 85 },
  { time: "10 AM", inflow: 195, outflow: 125 },
  { time: "11 AM", inflow: 165, outflow: 145 },
  { time: "12 PM", inflow: 145, outflow: 158 },
  { time: "1 PM", inflow: 135, outflow: 165 },
  { time: "2 PM", inflow: 125, outflow: 142 },
  { time: "3 PM", inflow: 115, outflow: 128 },
  { time: "4 PM", inflow: 145, outflow: 115 },
  { time: "5 PM", inflow: 185, outflow: 95 },
  { time: "6 PM", inflow: 225, outflow: 78 },
  { time: "7 PM", inflow: 195, outflow: 125 },
  { time: "8 PM", inflow: 145, outflow: 165 },
  { time: "9 PM", inflow: 95, outflow: 185 }
];

export const congestionHeatIndex = [
  { zone: "Panaji Market", index: 92, status: "Critical" },
  { zone: "Mapusa Junction", index: 85, status: "High" },
  { zone: "Margao Circle", index: 78, status: "High" },
  { zone: "Calangute Beach", index: 72, status: "Medium" },
  { zone: "Baga North", index: 82, status: "High" },
  { zone: "Porvorim IT Hub", index: 68, status: "Medium" },
  { zone: "Vasco Port", index: 38, status: "Low" },
  { zone: "Ponda Center", index: 42, status: "Low" },
  { zone: "Candolim Strip", index: 58, status: "Medium" },
  { zone: "Anjuna Market", index: 52, status: "Medium" }
];

export const aiPredictions = [
  { hour: "Now", predicted: 85, actual: 85 },
  { hour: "+1h", predicted: 88, actual: null },
  { hour: "+2h", predicted: 82, actual: null },
  { hour: "+3h", predicted: 75, actual: null },
  { hour: "+4h", predicted: 68, actual: null },
  { hour: "+5h", predicted: 72, actual: null },
  { hour: "+6h", predicted: 78, actual: null }
];
