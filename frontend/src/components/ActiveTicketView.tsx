import { useState, useEffect } from 'react';
import type { Booking } from '../types/index';

interface ActiveTicketViewProps {
  booking: Booking;
  onClose: () => void;
}

export default function ActiveTicketView({ booking, onClose }: ActiveTicketViewProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(booking.endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [booking.endTime]);

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
              <h2 className="text-2xl font-bold text-gray-900">Active Booking</h2>
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

            {/* QR Code */}
            <div className="bg-gray-50 p-8 rounded-2xl mb-6 flex items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-inner">
                {/* Placeholder QR Code - In production, use a QR code library */}
                <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-6xl">QR</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Spot</span>
                <span className="font-semibold text-gray-900">{booking.spotName}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">License Plate</span>
                <span className="font-semibold text-gray-900">{booking.licensePlate}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Start Time</span>
                <span className="font-semibold text-gray-900">
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">End Time</span>
                <span className="font-semibold text-gray-900">
                  {new Date(booking.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-primary to-primary-light p-6 rounded-2xl mb-6 text-center">
              <div className="text-white text-sm font-medium mb-2">Time Remaining</div>
              <div className="text-white text-4xl font-bold">{timeRemaining}</div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <div className="text-gray-600 text-sm mb-1">Total Paid</div>
              <div className="text-3xl font-bold text-primary">${booking.totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
