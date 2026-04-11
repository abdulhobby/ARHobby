// AboutPage.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  FiGlobe, 
  FiCircle, 
  FiDollarSign, 
  FiStar, 
  FiShield, 
  FiHeart, 
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiPackage,
  FiTruck
} from 'react-icons/fi';
import { GiCoinflip, GiTwoCoins, GiIndiaGate } from 'react-icons/gi';

const AboutPage = () => {
  const offerings = [
    {
      icon: FiGlobe,
      title: "World Currencies",
      description: "Banknotes from countries across the globe, featuring unique designs and historical significance",
      color: "bg-blue-500"
    },
    {
      icon: GiTwoCoins,
      title: "World Coins",
      description: "Coins from various nations and eras, each telling its own story of civilization",
      color: "bg-amber-500"
    },
    {
      icon: GiIndiaGate,
      title: "Indian Currencies",
      description: "Historical and modern Indian banknotes showcasing our rich heritage",
      color: "bg-primary"
    },
    {
      icon: GiCoinflip,
      title: "Indian Coins",
      description: "Ancient to modern Indian coins spanning centuries of history",
      color: "bg-orange-500"
    }
  ];

  const promises = [
    {
      icon: FiShield,
      title: "Authenticity Guaranteed",
      description: "Every item is carefully verified for authenticity by our experts"
    },
    {
      icon: FiStar,
      title: "Quality Assurance",
      description: "Detailed descriptions and honest condition grading for all items"
    },
    {
      icon: FiHeart,
      title: "Passion Driven",
      description: "Run by collectors, for collectors who share the same passion"
    },
    {
      icon: FiAward,
      title: "Expert Curation",
      description: "High-quality images and expert curation of rare pieces"
    }
  ];

  const stats = [
    { number: "500+", label: "Items Sold", icon: FiPackage },
    { number: "1000+", label: "Happy Collectors", icon: FiUsers },
    { number: "80+", label: "Countries", icon: FiGlobe },
    { number: "100%", label: "Authentic", icon: FiShield }
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO title="About Us" description="Learn about AR Hobby and our passion for numismatics" />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-1/3 w-20 h-20 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
              <GiCoinflip className="w-5 h-5 text-primary-300" />
              <span className="text-sm font-medium text-primary-100">Established 2020</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              About <span className="text-primary-300">AR Hobby</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Your trusted destination for rare and collectible currencies from around the world
            </p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white relative -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-4 sm:p-6 bg-primary-50 rounded-2xl border border-primary-100 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.number}</p>
                  <p className="text-sm text-text-light">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image/Visual Side */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-primary/20 p-6 sm:p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                      <GiCoinflip className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">AR Hobby</h2>
                    <p className="text-sm text-text-light leading-relaxed">
                      A passionate marketplace for collectors, offering a curated selection of rare and authentic currencies from around the world.
                    </p>

                    <Link to="/shop" className="inline-flex items-center gap-3 mt-6 px-5 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-300">
                      Explore Our Collection
                      <FiArrowRight className="w-4 h-4" />
                    </Link>

                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full mb-4">
                <FiHeart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                A Passion for <span className="text-primary">Numismatics</span>
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  AR Hobby was born from a deep passion for numismatics and the rich history 
                  embedded in every coin and banknote. What started as a personal collection has grown 
                  into a trusted marketplace for collectors worldwide.
                </p>
                <p>
                  We are a dedicated hobby marketplace that connects collectors with rare and fascinating 
                  currencies from India and around the world. Every piece in our collection tells a story 
                  of civilizations, economies, and the art of currency design.
                </p>
                <p>
                  Our team consists of passionate numismatists who understand the thrill of finding that 
                  perfect piece for your collection. We personally verify each item and provide detailed 
                  information to help you make informed decisions.
                </p>
              </div>
              
              {/* Features List */}
              <div className="mt-6 space-y-3">
                {['Expert Authentication', 'India Post Shipping', 'Secure Packaging', 'Collector Community'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-text-primary font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full mb-4">
              <FiPackage className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              What We <span className="text-primary">Offer</span>
            </h2>
            <p className="text-text-secondary">
              Explore our diverse collection of currencies and coins from around the world
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {offerings.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl p-6 border border-border-light shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-6 sm:p-10 lg:p-16 border border-primary-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full mb-4 shadow-sm">
                <FiShield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Commitment</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Our <span className="text-primary">Promise</span> to You
              </h2>
              <p className="text-text-secondary">
                We are committed to providing the best experience for collectors
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {promises.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-primary/10 hover:shadow-xl transition-all duration-300 text-center group"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-text-light">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <Link 
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95 text-lg group"
              >
                Start Exploring Our Collection
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;