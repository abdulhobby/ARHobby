const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Square Spinner */}
        <div
          className="loader-square w-14 h-14 sm:w-16 sm:h-16 bg-primary shadow-lg shadow-primary/30"
        ></div>

        <p className="text-text-secondary text-sm sm:text-base font-medium tracking-wider animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;