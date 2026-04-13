import { useState } from 'react';
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        className="aspect-square bg-bg-secondary rounded-2xl border-2 border-border-light 
                   flex items-center justify-center"
      >
        <div className="text-center">
          <div
            className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center 
                       mx-auto mb-3"
          >
            <svg
              className="w-8 h-8 text-text-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-text-light text-sm font-medium">
            No image available
          </p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div
          className="aspect-square overflow-hidden rounded-2xl border-2 border-border-light 
                     bg-bg-secondary cursor-pointer relative"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={images[selectedImage]?.url}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-700 
                     group-hover:scale-105"
          />

          {/* Zoom Overlay */}
          <div
            className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 
                       transition-all duration-300 flex items-center justify-center"
          >
            <div
              className="w-12 h-12 bg-bg-primary/90 backdrop-blur-sm rounded-full 
                         flex items-center justify-center shadow-lg
                         opacity-0 group-hover:opacity-100 transform scale-75 
                         group-hover:scale-100 transition-all duration-400"
            >
              <FiZoomIn className="text-primary text-lg" />
            </div>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 bg-secondary/70 backdrop-blur-sm 
                         text-text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg-primary/90 
                       backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg
                       opacity-0 group-hover:opacity-100 transform -translate-x-2 
                       group-hover:translate-x-0 transition-all duration-400
                       hover:bg-primary hover:text-text-white text-text-secondary 
                       cursor-pointer z-10"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg-primary/90 
                       backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg
                       opacity-0 group-hover:opacity-100 transform translate-x-2 
                       group-hover:translate-x-0 transition-all duration-400
                       hover:bg-primary hover:text-text-white text-text-secondary 
                       cursor-pointer z-10"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden 
                        cursor-pointer transition-all duration-300 border-2
                        ${selectedImage === index
                  ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'border-border-light hover:border-primary-300 opacity-70 hover:opacity-100'
                }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedImage === index && (
                <div className="absolute inset-0 border-2 border-primary rounded-[10px]"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-secondary/95 backdrop-blur-md 
                     flex items-center justify-center p-4 sm:p-8
                     animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setIsZoomed(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-bg-primary/10 
                     backdrop-blur-sm rounded-full flex items-center justify-center 
                     text-text-white hover:bg-bg-primary/20 cursor-pointer 
                     transition-all duration-300 z-20"
          >
            <FiX className="text-xl" />
          </button>

          {/* Large Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]?.url}
              alt="Product zoomed"
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 
                           bg-bg-primary/20 backdrop-blur-sm rounded-full flex items-center 
                           justify-center text-text-white hover:bg-primary cursor-pointer 
                           transition-all duration-300"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 
                           bg-bg-primary/20 backdrop-blur-sm rounded-full flex items-center 
                           justify-center text-text-white hover:bg-primary cursor-pointer 
                           transition-all duration-300"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden cursor-pointer 
                            transition-all duration-300 border-2
                            ${selectedImage === index
                      ? 'border-primary scale-110 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;