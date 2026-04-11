import { Link } from 'react-router-dom';
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import HomeImg1 from '../../assets/home4.jpg';
import HomeImg2 from '../../assets/home3.jpg';
import HomeImg3 from '../../assets/home2.jpg';
import HomeImg4 from '../../assets/home1.jpg';

const HeroBanner = () => {
  // Currency images for background
  const currencyImages = [
    HomeImg1,
    HomeImg2,
    HomeImg3,
    HomeImg4
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Background Currency Images Grid - FIXED */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div> {/* Optional: overlay for better text readability */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 transform rotate-12 scale-150 w-full h-full">
          {[...currencyImages, ...currencyImages, ...currencyImages].map((img, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-xl w-full h-full min-h-[200px]">
              <img
                src={img}
                alt="Currency background"
                className="w-full h-full object-cover opacity-30 hover:opacity-50 transition-opacity duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Ensure higher z-index */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className=" text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/90 backdrop-blur-sm 
                        border border-green-200 rounded-full mb-6 sm:mb-8 
                        animate-[fadeIn_0.8s_ease-out]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-green-800 text-xs sm:text-sm font-semibold tracking-wide">
              100% Original & Authentic Banknotes
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white 
                       leading-[1.1] tracking-tight mb-6 sm:mb-8
                       animate-[fadeIn_1s_ease-out_0.2s_both]">
            Discover
            <span className="relative inline-block mx-2 sm:mx-3">
              <span className="text-green-400">Rare</span>
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="#4ade80" strokeWidth="3" strokeLinecap="round"
                  className="opacity-60" />
              </svg>
            </span>
            &
            <br className="hidden sm:block" />
            <span className="text-green-400"> Collectible</span> Currencies
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed 
                      max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10
                      animate-[fadeIn_1s_ease-out_0.4s_both]">
            Explore our curated collection of world currencies, coins, and numismatic
            treasures from across the globe. Each piece tells a story of history and heritage.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start
                        animate-[fadeIn_1s_ease-out_0.6s_both]">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-3 bg-green-500 
                       hover:bg-green-600 text-white font-bold 
                       py-4 sm:py-5 px-8 sm:px-10 rounded-full cursor-pointer 
                       transition-all duration-300 ease-out 
                       shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/35 
                       transform hover:-translate-y-1 text-base sm:text-lg"
            >
              Shop Now
              <FiArrowRight className="text-xl transition-all duration-300 group-hover:translate-x-2" />
            </Link>

            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-3 
                       bg-white/10 backdrop-blur-sm border-2 border-white/30 
                       hover:bg-white/20 hover:border-white/50 text-white 
                       font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-full cursor-pointer 
                       transition-all duration-300 ease-out shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-1 text-base sm:text-lg"
            >
              <FiInfo className="text-xl" />
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 50.7C672 53 768 59 864 58.7C960 59 1056 53 1152 50.7C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            fill="white" />
        </svg>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          75% {
            transform: translateY(20px) rotate(-5deg);
          }
        }
        
        .currency-float {
          animation: float linear infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse {
          animation: pulse 8s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;