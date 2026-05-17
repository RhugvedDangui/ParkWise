import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

interface ReportSpotModalProps {
  onClose: () => void;
  onSuccess: (numSpots: number) => void;
}

export default function ReportSpotModal({ onClose, onSuccess }: ReportSpotModalProps) {
  const [numSlots, setNumSlots] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Send to backend
      const res = await fetch('http://localhost:3001/api/parking-locations/user-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gps_lat: lat,
          gps_lng: lng,
          num_slots: numSlots
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      onSuccess(numSlots);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit report. Please ensure location services are enabled.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[slideUp_0.3s_ease] p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report a Spot</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Help others find parking nearby</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              How many vacant slots do you see?
            </label>
            <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-100 p-2">
              <button
                type="button"
                onClick={() => setNumSlots(Math.max(1, numSlots - 1))}
                className="w-12 h-12 bg-white rounded-lg shadow-sm font-bold text-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >-</button>
              <div className="flex-1 text-center text-3xl font-black text-primary">
                {numSlots}
              </div>
              <button
                type="button"
                onClick={() => setNumSlots(numSlots + 1)}
                className="w-12 h-12 bg-white rounded-lg shadow-sm font-bold text-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >+</button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Report'}
          </button>
          
          <p className="text-[10px] text-gray-400 text-center mt-4">
            Your current GPS location will be attached to this report.
          </p>
        </form>
      </div>
    </div>
  );
}
