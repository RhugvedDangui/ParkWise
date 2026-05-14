import axios from 'axios';
import type { ParkingSpot, UserReport, Booking } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parking Spots
export const getParkingSpots = async (params?: {
  lat?: number;
  lng?: number;
  radius?: number;
  type?: string;
  available?: boolean;
}): Promise<ParkingSpot[]> => {
  const response = await api.get('/spots', { params });
  return response.data;
};

export const getParkingSpot = async (id: string): Promise<ParkingSpot> => {
  const response = await api.get(`/spots/${id}`);
  return response.data;
};

export const updateSpotAvailability = async (
  id: string,
  isAvailable: boolean
): Promise<ParkingSpot> => {
  const response = await api.put(`/spots/${id}/availability`, { isAvailable });
  return response.data;
};

// Reports (Crowdsourcing)
export const submitReport = async (report: {
  spotId: string;
  latitude: number;
  longitude: number;
  isFree: boolean;
  userId: string;
}): Promise<{ success: boolean; report: UserReport; pointsEarned: number }> => {
  const response = await api.post('/reports', report);
  return response.data;
};

// Bookings
export const createBooking = async (booking: {
  spotId: string;
  startTime: Date;
  endTime: Date;
  licensePlate: string;
  userId: string;
}): Promise<Booking> => {
  const response = await api.post('/bookings', booking);
  return response.data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

// User Stats
export const getUserStats = async (
  userId: string
): Promise<{ userId: string; points: number; reportsCount: number; bookingsCount: number }> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

// Routing
export const calculateRoute = async (params: {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}): Promise<{
  distance: number;
  duration: number;
  polyline: [number, number][];
}> => {
  const response = await api.post('/route', params);
  return response.data;
};

export default api;
