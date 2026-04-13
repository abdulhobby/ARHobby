const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = Math.min(pages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-6 sm:py-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`
          px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer
          transition-all duration-300 select-none
          ${page === 1
            ? 'bg-bg-tertiary text-text-light cursor-not-allowed opacity-50'
            : 'bg-bg-primary border-2 border-border-light text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-50 shadow-sm hover:shadow-md'
          }
        `}
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* First Page + Ellipsis */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium 
                     bg-bg-primary border-2 border-border-light text-text-secondary 
                     hover:border-primary hover:text-primary hover:bg-primary-50 
                     cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
                     flex items-center justify-center"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-1 sm:px-2 text-text-light text-sm select-none">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          disabled={num === page}
          className={`
            w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold
            cursor-pointer transition-all duration-300 flex items-center justify-center
            ${num === page
              ? 'bg-primary text-text-white shadow-lg shadow-primary/30 scale-110 cursor-default'
              : 'bg-bg-primary border-2 border-border-light text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-50 shadow-sm hover:shadow-md'
            }
          `}
        >
          {num}
        </button>
      ))}

      {/* Last Page + Ellipsis */}
      {endPage < pages && (
        <>
          {endPage < pages - 1 && (
            <span className="px-1 sm:px-2 text-text-light text-sm select-none">...</span>
          )}
          <button
            onClick={() => onPageChange(pages)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium 
                     bg-bg-primary border-2 border-border-light text-text-secondary 
                     hover:border-primary hover:text-primary hover:bg-primary-50 
                     cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
                     flex items-center justify-center"
          >
            {pages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`
          px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer
          transition-all duration-300 select-none
          ${page === pages
            ? 'bg-bg-tertiary text-text-light cursor-not-allowed opacity-50'
            : 'bg-bg-primary border-2 border-border-light text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-50 shadow-sm hover:shadow-md'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>
    </div>
  );
};

export default Pagination;