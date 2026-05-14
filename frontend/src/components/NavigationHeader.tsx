import type { ParkingSpot } from '../types/index';

interface NavigationHeaderProps {
  spot: ParkingSpot;
  distance: number;
  eta: number;
  onStartNavigation: () => void;
  onCancel: () => void;
}

export default function NavigationHeader({
  spot,
  distance,
  eta,
  onStartNavigation,
  onCancel,
}: NavigationHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">Navigating to</div>
            <div className="font-bold text-lg text-gray-900">{spot.name}</div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                {distance.toFixed(1)} mi
              </span>
              <span className="flex items-center gap-1 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {eta} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onStartNavigation}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
            >
              Start Navigation
            </button>
            <button
              onClick={onCancel}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Cancel navigation"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
