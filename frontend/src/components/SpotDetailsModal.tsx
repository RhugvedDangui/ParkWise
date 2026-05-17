import { useState } from 'react';
import type { ParkingSpot } from '../types/index';
import { useAuth } from '../context/AuthContext';

interface SpotDetailsModalProps {
  spot: ParkingSpot;
  onClose: () => void;
}

interface Slot {
  slot_id: string;
  status: 'Vacant' | 'Occupied' | 'Reserved';
  spotType?: string;
}

export default function SpotDetailsModal({ spot, onClose }: SpotDetailsModalProps) {
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vehicleType, setVehicleType] = useState<'standard' | 'ev' | 'handicap'>('standard');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'slots' | 'confirm'>('slots');

  const slots: Slot[] = (spot as any).slots || [];
  const filteredSlots = slots.filter(s => s.spotType === vehicleType || (!s.spotType && vehicleType === 'standard'));
  const vacantSlots = slots.filter(s => s.status === 'Vacant').length;

  const slotColors = {
    Vacant:   { bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-400', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Occupied: { bg: 'bg-red-50 border-red-200 cursor-not-allowed', text: 'text-red-600', dot: 'bg-red-500' },
    Reserved: { bg: 'bg-amber-50 border-amber-200 cursor-not-allowed', text: 'text-amber-600', dot: 'bg-amber-500' },
  };

  const handleReserve = async () => {
    if (!selectedSlot || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setError('End time must be after start time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          username: user?.username,
          location_id: (spot as any).location_id || spot.id,
          slot_id: selectedSlot,
          start_time: startTime,
          end_time: endTime,
          vehicle_type: vehicleType
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reserve');
      setSuccess(`✅ Slot ${selectedSlot} reserved successfully!`);
      setStep('slots');
      setSelectedSlot(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date().toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{spot.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Camera: {(spot as any).camera_id || 'N/A'}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{vacantSlots}</div>
              <div className="text-xs text-gray-500 mt-0.5">Available</div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{slots.filter(s => s.status === 'Occupied').length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Occupied</div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{slots.filter(s => s.status === 'Reserved').length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Reserved</div>
            </div>
          </div>

          {/* Navigation Button */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Navigate via Google Maps
          </a>
        </div>

        <div className="p-5">
          {success && (
            <div className="mb-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {step === 'slots' && (
            <>
              {/* Vehicle Type Selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Vehicle Type</label>
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {['standard', 'ev', 'handicap'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setVehicleType(type as any); setSelectedSlot(null); }}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                        vehicleType === type
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {type === 'ev' ? 'EV' : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select a Slot</h3>
                <span className="text-xs text-gray-500">{filteredSlots.length} available</span>
              </div>

              {filteredSlots.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-8 text-center mb-4">
                  <p className="text-gray-400 text-sm">No {vehicleType} slots available</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {filteredSlots.map(slot => {
                    const isSelected = selectedSlot === slot.slot_id;
                    const canSelect = slot.status === 'Vacant';
                    const dotColor = slot.status === 'Vacant' ? 'bg-green-500' : slot.status === 'Reserved' ? 'bg-yellow-500' : 'bg-red-400';
                    return (
                      <button
                        key={slot.slot_id}
                        disabled={!canSelect}
                        onClick={() => canSelect && setSelectedSlot(slot.slot_id)}
                        className={`
                          p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all duration-150
                          ${canSelect ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                          ${isSelected
                            ? 'border-gray-900 dark:border-gray-300 bg-gray-900 dark:bg-gray-100'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                          }
                        `}
                      >
                        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <span className={`font-semibold text-xs ${isSelected ? 'text-white dark:text-gray-900' : 'text-gray-800 dark:text-gray-200'}`}>{slot.slot_id}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <button
                  onClick={() => { setStep('confirm'); setError(''); }}
                  className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-white transition-all text-sm"
                >
                  Reserve Slot {selectedSlot} →
                </button>
              )}
            </>
          )}

          {step === 'confirm' && (
            <>
              <button onClick={() => setStep('slots')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
                ← Back
              </button>

              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-gray-800 dark:text-gray-200 text-sm">{selectedSlot}</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{spot.name}</div>
                  <div className="text-xs text-gray-500">Slot {selectedSlot} · {(spot as any).camera_id}</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Start Time</label>
                  <input
                    type="datetime-local"
                    min={now}
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">End Time</label>
                  <input
                    type="datetime-local"
                    min={startTime || now}
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  : 'Confirm Reservation'
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
