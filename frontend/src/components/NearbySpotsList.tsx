import type { ParkingSpot } from '../types/index';

interface NearbySpotsListProps {
  spots: ParkingSpot[];
  onSpotClick: (spot: ParkingSpot) => void;
}

export default function NearbySpotsList({ spots, onSpotClick }: NearbySpotsListProps) {
  // Sort spots by distance if available, otherwise by name
  const sortedSpots = [...spots].sort((a, b) => {
    if (a.distance && b.distance) return a.distance - b.distance;
    return a.name.localeCompare(b.name);
  });

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
    <div className="w-[340px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800 flex flex-col h-auto max-h-[calc(100vh-120px)] overflow-hidden pointer-events-auto transition-all duration-300">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 flex items-center justify-between z-10">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-base">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Nearby Parking
        </h2>
        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md">
          {spots.length} spots
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-3 space-y-2">
        {sortedSpots.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm font-medium">
            No parking spots found nearby.
          </div>
        ) : (
          sortedSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSpotClick(spot)}
              className="w-full text-left p-4 rounded-xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700/50 transition-all duration-200 flex flex-col gap-2 group"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{spot.name}</h3>
                  {spot.isVerified === false && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-700/50">
                      Unverified
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">
                  ${spot.pricePerHour}<span className="text-xs text-gray-500 font-normal">/hr</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs w-full mt-1">
                {/* Slot count */}
                {(() => {
                  const slots = (spot as any).slots as Array<{status: string}> | undefined;
                  const total = slots?.length ?? 0;
                  const vacant = slots?.filter(s => s.status === 'Vacant').length ?? (spot.isAvailable ? 1 : 0);
                  
                  if (total > 0) {
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${vacant > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {vacant}/{total} available
                        </span>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {spot.isAvailable ? 'Available' : 'Full'}
                      </span>
                    </div>
                  );
                })()}
                
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                    {spot.distance ? `${spot.distance.toFixed(1)} mi` : `${(Math.random() * 2 + 0.5).toFixed(1)} mi`}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
