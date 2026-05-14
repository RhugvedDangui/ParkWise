import { useState } from 'react';
import type { ParkingSpot } from '../types/index';

interface BookingModalProps {
  spot: ParkingSpot;
  onClose: () => void;
  onConfirm: (booking: {
    startTime: Date;
    endTime: Date;
    licensePlate: string;
  }) => void;
}

export default function BookingModal({ spot, onClose, onConfirm }: BookingModalProps) {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [licensePlate, setLicensePlate] = useState('');

  const calculateTotal = () => {
    return (spot.pricePerHour * duration).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    
    onConfirm({
      startTime: start,
      endTime: end,
      licensePlate,
    });
  };

  // Get current datetime for min attribute
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-up">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Parking</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Spot Info */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="font-semibold text-gray-900 mb-1">{spot.name}</div>
              <div className="text-sm text-gray-600">
                ${spot.pricePerHour}/hour
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Start Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min={minDateTime}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-primary w-16 text-center">
                    {duration}h
                  </span>
                </div>
              </div>

              {/* License Plate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate
                </label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  placeholder="ABC1234"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors uppercase"
                />
              </div>

              {/* Total */}
              <div className="bg-primary bg-opacity-10 p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
