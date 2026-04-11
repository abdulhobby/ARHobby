// Loader.jsx
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading text */}
      <p className="text-sm font-medium text-gray-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;