import { FiShield, FiTruck, FiAward, FiHeadphones } from 'react-icons/fi';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiAward />,
      title: 'Authentic Items',
      description: 'Every item is verified for authenticity by expert numismatists',
      color: 'from-primary-400 to-primary-600',
    },
    {
      icon: <FiShield />,
      title: 'Secure Transactions',
      description: 'Safe and secure payment process with end-to-end encryption',
      color: 'from-primary-500 to-primary-700',
    },
    {
      icon: <FiTruck />,
      title: 'India Post Shipping',
      description: 'Reliable nationwide shipping with real-time tracking',
      color: 'from-primary-400 to-primary-600',
    },
    {
      icon: <FiHeadphones />,
      title: 'Customer Support',
      description: 'Dedicated support via WhatsApp for quick assistance',
      color: 'from-primary-500 to-primary-700',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-secondary relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34,197,94,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(34,197,94,0.2) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-primary/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary-light text-xs sm:text-sm 
                         font-semibold rounded-full mb-4 tracking-wide uppercase border border-primary/20">
            Our Promise
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-white mb-4 tracking-tight">
            Why Choose <span className="text-primary-light">AR Hobby</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            We are committed to providing the best experience for collectors
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-secondary-light/50 backdrop-blur-sm border border-gray-700/50 
                       rounded-2xl p-6 sm:p-8 text-center cursor-default
                       hover:border-primary/50 hover:bg-secondary-light 
                       transition-all duration-500 ease-out
                       hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 
                             rounded-2xl bg-gradient-to-br ${feature.color} text-text-white text-2xl sm:text-3xl
                             shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30
                             transform group-hover:scale-110 group-hover:rotate-3
                             transition-all duration-500 ease-out`}
                >
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-bold text-text-white mb-3 
                             group-hover:text-primary-light transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed 
                            group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary 
                            group-hover:w-3/4 transition-all duration-500 rounded-full"></div>

              {/* Corner Decoration */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/0 
                            group-hover:border-primary/30 rounded-tr-xl transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/0 
                            group-hover:border-primary/30 rounded-bl-xl transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;