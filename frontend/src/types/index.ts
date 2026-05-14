export interface ParkingSpot {
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

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  polyline: [number, number][];
}

export interface FilterOptions {
  freeOnly: boolean;
  evCharging: boolean;
  coveredParking: boolean;
  handicapAccessible: boolean;
}

export interface UserReport {
  spotId: string;
  latitude: number;
  longitude: number;
  isFree: boolean;
  timestamp: Date;
}

export interface Booking {
  id: string;
  spotId: string;
  spotName: string;
  startTime: Date;
  endTime: Date;
  licensePlate: string;
  qrCode: string;
  totalPrice: number;
}
