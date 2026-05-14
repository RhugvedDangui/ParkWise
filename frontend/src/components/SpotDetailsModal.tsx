import type { ParkingSpot } from '../types/index';

interface SpotDetailsModalProps {
  spot: ParkingSpot | null;
  onClose: () => void;
  onNavigate: (spot: ParkingSpot) => void;
  onBook?: (spot: ParkingSpot) => void;
}

export default function SpotDetailsModal({
  spot,
  onClose,
  onNavigate,
  onBook,
}: SpotDetailsModalProps) {
  if (!spot) return null;

  const getSpotTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      standard: '🅿️ Standard',
      ev: '⚡ EV Charging',
      covered: '🏠 Covered',
      handicap: '♿ Accessible',
    };
    return labels[type] || type;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{spot.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    spot.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {spot.isAvailable ? '✅ Available' : '❌ Occupied'}
                </span>
                {spot.isVerified && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    ✓ Verified IoT
                  </span>
                )}
              </div>
            </div>
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

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Price</div>
              <div className="text-2xl font-bold text-primary">
                ${spot.pricePerHour}
                <span className="text-sm text-gray-600">/hr</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Distance</div>
              <div className="text-2xl font-bold text-gray-900">
                {spot.distance ? `${spot.distance.toFixed(1)} mi` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Spot Type */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Spot Type</div>
            <div className="text-lg font-medium text-gray-900">
              {getSpotTypeLabel(spot.spotType)}
            </div>
          </div>

          {/* Last Updated */}
          <div className="mb-6 text-sm text-gray-500">
            Last updated: {new Date(spot.lastUpdated).toLocaleString()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate(spot)}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Navigate
            </button>
            {onBook && spot.isAvailable && (
              <button
                onClick={() => onBook(spot)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
