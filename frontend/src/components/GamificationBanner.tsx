interface GamificationBannerProps {
  points: number;
  reportsCount: number;
}

export default function GamificationBanner({ points, reportsCount }: GamificationBannerProps) {
  return (
    <div className="fixed top-6 left-6 bg-white rounded-2xl shadow-xl p-4 z-30 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
          <span className="text-2xl">🏆</span>
        </div>
        <div>
          <div className="text-xs text-gray-600 font-medium">Smart City Points</div>
          <div className="text-2xl font-bold text-gray-900">{points}</div>
          <div className="text-xs text-gray-500">{reportsCount} reports</div>
        </div>
      </div>
    </div>
  );
}
