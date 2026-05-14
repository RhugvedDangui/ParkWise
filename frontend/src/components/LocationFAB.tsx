interface LocationFABProps {
  onLocate: () => void;
  isLocating: boolean;
}

export default function LocationFAB({ onLocate, isLocating }: LocationFABProps) {
  return (
    <button
      onClick={onLocate}
      disabled={isLocating}
      className="fixed bottom-32 right-6 bg-white hover:bg-gray-50 text-primary p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-30"
      aria-label="Locate me"
    >
      {isLocating ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
}
