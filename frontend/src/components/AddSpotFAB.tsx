interface AddSpotFABProps {
  onAdd: () => void;
}

export default function AddSpotFAB({ onAdd }: AddSpotFABProps) {
  return (
    <div className="fixed bottom-8 left-8 z-[1000]">
      <button
        onClick={onAdd}
        className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-white text-white dark:text-gray-900 rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center group relative"
        aria-label="Add free parking spot"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Add Spot
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </button>
    </div>
  );
}
