import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, fetchRelatedProducts, clearProduct } from '../features/product/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import { formatCurrency } from '../utils/helpers';
import { 
  FiShoppingCart, 
  FiMinus, 
  FiPlus, 
  FiChevronRight, 
  FiHome,
  FiPackage,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiHeart,
  FiShare2,
  FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, loading, error } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    return () => { dispatch(clearProduct()); };
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchRelatedProducts({ id: product._id, params: { limit: 4 } }));
    }
  }, [product, dispatch]);

  useEffect(() => {
    setQuantity(1);
  }, [product?._id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch((err) => toast.error(err));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description?.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getStockStatusConfig = (status) => {
    const configs = {
      'In Stock': {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        icon: FiCheck,
      },
      'Out of Stock': {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        icon: FiAlertCircle,
      },
      'Low Stock': {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        icon: FiAlertCircle,
      },
    };
    return configs[status] || configs['In Stock'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Product Not Found</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark 
                     text-white rounded-xl font-semibold transition-all duration-300 cursor-pointer
                     shadow-lg shadow-primary/30"
          >
            <FiPackage className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const stockConfig = getStockStatusConfig(product.stockStatus);
  const StockIcon = stockConfig.icon;
  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const specifications = [
    { label: 'Country', value: product.country },
    { label: 'Year', value: product.year },
    { label: 'Condition', value: product.condition },
    { label: 'Denomination', value: product.denomination },
    { label: 'Material', value: product.material },
    { label: 'Weight', value: product.weight },
    { label: 'Dimensions', value: product.dimensions },
    { label: 'Rarity', value: product.rarity },
  ].filter(spec => spec.value);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SEO title={product.name} description={product.description?.substring(0, 160)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center flex-wrap gap-2 text-sm">
            <Link 
              to="/" 
              className="flex items-center gap-1 text-text-secondary hover:text-primary 
                       transition-colors duration-300 cursor-pointer"
            >
              <FiHome className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <FiChevronRight className="w-4 h-4 text-text-light" />
            <Link 
              to="/shop" 
              className="text-text-secondary hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Shop
            </Link>
            {product.category && (
              <>
                <FiChevronRight className="w-4 h-4 text-text-light" />
                <Link 
                  to={`/category/${product.category?.slug}`}
                  className="text-text-secondary hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  {product.category?.name}
                </Link>
              </>
            )}
            <FiChevronRight className="w-4 h-4 text-text-light" />
            <span className="text-text-primary font-medium truncate max-w-[150px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <ProductImageGallery images={product.images} />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-error text-white text-sm font-bold rounded-lg shadow-lg">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <Link 
                to={`/category/${product.category?.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary 
                         text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors 
                         duration-300 cursor-pointer"
              >
                <FiPackage className="w-4 h-4" />
                {product.category?.name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-xl text-text-light line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                  <span className="px-3 py-1 bg-success/10 text-success text-sm font-semibold rounded-lg">
                    Save {formatCurrency(product.comparePrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                             ${stockConfig.bg} ${stockConfig.text} border ${stockConfig.border}`}>
                <StockIcon className="w-4 h-4" />
                {product.stockStatus}
              </span>
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-sm text-warning font-medium">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-text-secondary leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Specifications Grid */}
            {specifications.length > 0 && (
              <div className="bg-bg-secondary rounded-2xl p-5 border border-border">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FiInfo className="w-4 h-4 text-primary" />
                  Quick Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {specifications.slice(0, 6).map((spec, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-xs text-text-light uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium text-text-primary mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            {product.stockStatus === 'In Stock' && (
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">Quantity</span>
                  <div className="flex items-center gap-1 bg-bg-secondary rounded-xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg
                               text-text-secondary hover:text-primary hover:bg-white
                               transition-all duration-300 cursor-pointer
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-text-primary">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center rounded-lg
                               text-text-secondary hover:text-primary hover:bg-white
                               transition-all duration-300 cursor-pointer
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stock Info */}
                {product.stock > 0 && (
                  <p className="text-sm text-text-secondary text-center">
                    <span className="font-medium text-text-primary">{product.stock}</span> items available
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6
                             bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold
                             transition-all duration-300 cursor-pointer shadow-lg shadow-primary/30
                             hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5
                             active:scale-[0.98]"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  
                  <button 
                    className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-border
                             text-text-secondary hover:text-error hover:border-error/30 hover:bg-error/5
                             transition-all duration-300 cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <FiHeart className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-border
                             text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5
                             transition-all duration-300 cursor-pointer"
                    title="Share Product"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Out of Stock Message */}
            {product.stockStatus === 'Out of Stock' && (
              <div className="bg-error/5 border border-error/20 rounded-2xl p-6 text-center">
                <FiAlertCircle className="w-12 h-12 text-error mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary mb-2">Currently Unavailable</h3>
                <p className="text-sm text-text-secondary">
                  This item is out of stock. Please check back later or browse similar products.
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiShield className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Authentic</span>
                <span className="text-xs text-text-light">Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiTruck className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Free Shipping</span>
                <span className="text-xs text-text-light">On ₹500+</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiPackage className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Secure Pack</span>
                <span className="text-xs text-text-light">Safe Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiRefreshCw className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Easy Returns</span>
                <span className="text-xs text-text-light">7 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-border overflow-x-auto scrollbar-none">
              {['description', 'specifications', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300
                            cursor-pointer relative
                            ${activeTab === tab 
                              ? 'text-primary' 
                              : 'text-text-secondary hover:text-text-primary'
                            }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-green max-w-none">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                  {product.additionalInfo && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold text-text-primary mb-3">
                        Additional Information
                      </h3>
                      <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {product.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specifications.length > 0 ? (
                    specifications.map((spec, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center py-3 px-4 bg-bg-secondary 
                                 rounded-xl border border-border"
                      >
                        <span className="text-text-secondary">{spec.label}</span>
                        <span className="font-semibold text-text-primary">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary col-span-2 text-center py-8">
                      No specifications available for this product.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiTruck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Free Shipping</h4>
                      <p className="text-sm text-text-secondary">
                        Free shipping on orders above ₹500. Standard delivery takes 5-7 business days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiPackage className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Secure Packaging</h4>
                      <p className="text-sm text-text-secondary">
                        All items are carefully packaged to ensure safe delivery. Collectibles receive 
                        extra protection with bubble wrap and rigid packaging.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiRefreshCw className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Returns & Refunds</h4>
                      <p className="text-sm text-text-secondary">
                        7-day return policy for damaged or incorrect items. Please contact us within 
                        24 hours of delivery for any issues.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Related Products
                </h2>
                <p className="text-text-secondary mt-1">You might also like these</p>
              </div>
              <Link 
                to="/shop"
                className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark 
                         font-medium transition-colors duration-300 cursor-pointer"
              >
                View All
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link 
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary
                         rounded-xl font-medium transition-all duration-300 cursor-pointer
                         hover:bg-primary hover:text-white"
              >
                View All Products
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;