// pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, fetchRelatedProducts, clearProduct } from '../features/product/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatCurrency, generateProductSchema } from '../utils/helpers';
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
  FiInfo,
  FiStar,
  FiAward,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, loading, error } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { 
      dispatch(clearProduct());
    };
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
    if (product.stockStatus === 'Out of Stock') {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }))
      .unwrap()
      .then(() => toast.success(`Added ${quantity} item(s) to cart`))
      .catch((err) => toast.error(err));
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing collectible: ${product.name}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const getStockStatusConfig = (status, stock) => {
    if (stock > 0 && stock <= 5) {
      return {
        status: 'Low Stock',
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        icon: FiAlertCircle,
        message: `Only ${stock} left in stock!`
      };
    }
    
    const configs = {
      'In Stock': {
        status: 'In Stock',
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        icon: FiCheck,
        message: 'Ready to ship'
      },
      'Out of Stock': {
        status: 'Out of Stock',
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        icon: FiAlertCircle,
        message: 'Currently unavailable'
      },
    };
    return configs[status] || configs['In Stock'];
  };

  // Generate SEO schema data
  const getProductSchema = () => {
    if (!product) return null;
    
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      condition: product.condition,
      sku: product._id,
      image: product.images?.[0]?.url,
      url: window.location.href,
      brand: 'AR Hobby',
      category: product.category?.name,
      ...product.seo?.schemaMarkup
    };
  };

  // Generate meta keywords from product data
  const getMetaKeywords = () => {
    const keywords = [
      product.name,
      product.category?.name,
      product.country,
      product.year,
      product.condition,
      product.material,
      product.rarity,
      'collectible currency',
      'rare coin',
      'numismatics',
      ...(product.tags || [])
    ];
    return [...new Set(keywords.filter(Boolean))].join(', ');
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

  const stockConfig = getStockStatusConfig(product.stockStatus, product.stock);
  const StockIcon = stockConfig.icon;
  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const specifications = [
    { label: 'Country of Origin', value: product.country, icon: FiHome },
    { label: 'Year of Issue', value: product.year, icon: FiClock },
    { label: 'Condition', value: product.condition, icon: FiAward },
    { label: 'Denomination', value: product.denomination, icon: FiPackage },
    { label: 'Material', value: product.material, icon: FiStar },
    { label: 'Weight', value: product.weight, icon: FiPackage },
    { label: 'Dimensions', value: product.dimensions, icon: FiInfo },
    { label: 'Rarity Grade', value: product.rarity, icon: FiAward },
  ].filter(spec => spec.value);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    ...(product.category ? [{ label: product.category.name, path: `/category/${product.category.slug}` }] : []),
    { label: product.name, path: null }
  ];

  return (
    <div className="bg-bg-secondary py-8 sm:py-5">
      {/* Full SEO Implementation */}
      <SEO
        title={product.seo?.metaTitle || product.name}
        description={product.seo?.metaDescription || product.description?.substring(0, 160)}
        keywords={getMetaKeywords()}
        image={product.seo?.ogImage || product.images?.[0]?.url}
        url={`${import.meta.env.VITE_SITE_URL || window.location.origin}/product/${product.slug}`}
        type="product"
        publishedTime={product.createdAt}
        modifiedTime={product.updatedAt}
        author="AR Hobby"
        section={product.category?.name}
        tags={[...(product.tags || []), product.category?.name, product.country, product.condition].filter(Boolean)}
        productData={getProductSchema()}
        canonicalUrl={product.seo?.canonicalUrl}
      />

      {/* Breadcrumb with Schema */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <ProductImageGallery images={product.images} />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-error text-white text-sm font-bold rounded-lg shadow-lg animate-pulse">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
              
              {/* Trust Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs text-center">
                  🔒 100% Authentic Guaranteed
                </div>
              </div>
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                               ${stockConfig.bg} ${stockConfig.text} border ${stockConfig.border}`}>
                  <StockIcon className="w-4 h-4" />
                  {stockConfig.status}
                </span>
                <span className="text-sm text-text-secondary">{stockConfig.message}</span>
              </div>
              {product.stock > 0 && product.stock <= 10 && (
                <div className="w-full bg-error/10 rounded-full h-1.5">
                  <div 
                    className="bg-error h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(product.stock / 10) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <div className="bg-bg-secondary rounded-2xl p-5 border border-border">
                <p className="text-text-secondary leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3">
              {specifications.slice(0, 4).map((spec, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl">
                  <spec.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-text-light">{spec.label}</span>
                    <span className="text-sm font-semibold text-text-primary">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

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

                {/* Total Price */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-text-secondary">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>

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
                    onClick={handleWishlist}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2
                             transition-all duration-300 cursor-pointer
                             ${isWishlisted 
                               ? 'border-error bg-error/10 text-error' 
                               : 'border-border text-text-secondary hover:text-error hover:border-error/30 hover:bg-error/5'
                             }`}
                    title="Add to Wishlist"
                  >
                    <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
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
                <button 
                  onClick={() => toast.success('We\'ll notify you when back in stock!')}
                  className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Notify Me When Available
                </button>
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
                <span className="text-xs text-text-light">On ₹1000+</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiPackage className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Secure Pack</span>
                <span className="text-xs text-text-light">Safe Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-bg-secondary rounded-xl">
                <FiRefreshCw className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium text-text-primary">Real Collection</span>
                <span className="text-xs text-text-light">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-border overflow-x-auto scrollbar-none">
              {[
                { id: 'description', label: 'Product Description', icon: FiInfo },
                { id: 'specifications', label: 'Technical Specifications', icon: FiPackage },
                { id: 'shipping', label: 'Shipping & Returns', icon: FiTruck }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap 
                            transition-all duration-300 cursor-pointer relative
                            ${activeTab === tab.id 
                              ? 'text-primary' 
                              : 'text-text-secondary hover:text-text-primary'
                            }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-green max-w-none">
                  <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                  {product.additionalInfo && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <FiInfo className="w-5 h-5 text-primary" />
                        Additional Information
                      </h3>
                      <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {product.additionalInfo}
                      </div>
                    </div>
                  )}
                  
                  {/* Historical Context */}
                  {product.year && product.country && (
                    <div className="mt-6 p-4 bg-bg-secondary rounded-xl">
                      <h4 className="font-semibold text-text-primary mb-2">Historical Context</h4>
                      <p className="text-sm text-text-secondary">
                        This {product.denomination || 'coin'} from {product.country} dates back to {product.year}, 
                        representing a significant piece of numismatic history. {product.condition} condition 
                        makes it a valuable addition to any collection.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specifications.length > 0 ? (
                      specifications.map((spec, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-4 py-3 px-4 bg-bg-secondary rounded-xl border border-border"
                        >
                          <spec.icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-text-secondary text-sm">{spec.label}</span>
                            <span className="font-semibold text-text-primary block">{spec.value}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-secondary col-span-2 text-center py-8">
                        No specifications available for this product.
                      </p>
                    )}
                  </div>

                  {/* Certification */}
                  <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FiShield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">Authenticity Guarantee</h4>
                        <p className="text-sm text-text-secondary">
                          All banknotes and coins sold on AR Hobby are guaranteed to be 100% authentic.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiTruck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Free Shipping</h4>
                      <p className="text-sm text-text-secondary">
                        Free shipping on all orders above ₹1000. Standard delivery takes 5-7 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiPackage className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Secure Packaging</h4>
                      <p className="text-sm text-text-secondary">
                        All items are carefully packaged to ensure they arrive in perfect condition.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-xl">
                    <FiRefreshCw className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Returns & Refunds</h4>
                      <p className="text-sm text-text-secondary">
                        Once an item has been shipped, returns will not be accepted. Please contact us 
                        immediately if there are any issues with your order. We will do our best to 
                        resolve any problems, but we cannot accept returns or cancellations after shipping.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products with SEO */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  You May Also Like
                </h2>
                <p className="text-text-secondary mt-1">Discover similar collectibles from our collection</p>
              </div>
              <Link 
                to="/shop"
                className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark 
                         font-medium transition-colors duration-300 cursor-pointer"
              >
                View All Products
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