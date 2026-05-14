import { useState } from 'react';

interface ReportSpotButtonProps {
  onReport: (isFree: boolean) => void;
  isVerifying: boolean;
}

export default function ReportSpotButton({ onReport, isVerifying }: ReportSpotButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  const handleReport = (isFree: boolean) => {
    onReport(isFree);
    setShowOptions(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Options Menu */}
      {showOptions && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-2 mb-2 animate-slide-up">
          <button
            onClick={() => handleReport(true)}
            disabled={isVerifying}
            className="w-full px-6 py-3 text-left hover:bg-green-50 rounded-xl transition-colors flex items-center gap-3 text-green-700 font-medium"
          >
            <span className="text-2xl">✅</span>
            <span>Report Spot Free</span>
          </button>
          <button
            onClick={() => handleReport(false)}
            disabled={isVerifying}
            className="w-full px-6 py-3 text-left hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 text-red-700 font-medium"
          >
            <span className="text-2xl">❌</span>
            <span>Report Spot Taken</span>
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isVerifying}
        className={`
          bg-primary hover:bg-primary-dark text-white p-5 rounded-full shadow-2xl 
          transition-all duration-200 hover:scale-110 disabled:opacity-50 
          disabled:cursor-not-allowed flex items-center gap-2
          ${showOptions ? 'rotate-45' : ''}
        `}
        aria-label="Report parking spot"
      >
        {isVerifying ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
