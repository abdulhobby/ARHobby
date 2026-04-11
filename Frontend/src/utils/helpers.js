// utils/helpers.js

// Currency Formatting
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Date Formatting
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Text Formatting
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Status Helpers
export const getStatusColor = (status) => {
  const colors = {
    'Placed': 'text-blue-600',
    'Confirmed': 'text-indigo-600',
    'Processing': 'text-yellow-600',
    'Shipped': 'text-purple-600',
    'In Transit': 'text-orange-600',
    'Delivered': 'text-green-600',
    'Cancelled': 'text-red-600',
    'Returned': 'text-gray-600',
    'Pending': 'text-yellow-600',
    'Received': 'text-blue-600',
    'Verified': 'text-green-600',
    'Failed': 'text-red-600',
    'In Stock': 'text-green-600',
    'Out of Stock': 'text-red-600',
    'Low Stock': 'text-yellow-600'
  };
  return colors[status] || 'text-gray-600';
};

export const getStatusBgColor = (status) => {
  const colors = {
    'Placed': 'bg-blue-100',
    'Confirmed': 'bg-indigo-100',
    'Processing': 'bg-yellow-100',
    'Shipped': 'bg-purple-100',
    'In Transit': 'bg-orange-100',
    'Delivered': 'bg-green-100',
    'Cancelled': 'bg-red-100',
    'Returned': 'bg-gray-100',
    'Pending': 'bg-yellow-100',
    'Received': 'bg-blue-100',
    'Verified': 'bg-green-100',
    'Failed': 'bg-red-100',
    'In Stock': 'bg-green-100',
    'Out of Stock': 'bg-red-100',
    'Low Stock': 'bg-yellow-100'
  };
  return colors[status] || 'bg-gray-100';
};

// Query Helpers
export const buildQueryString = (params) => {
  const query = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      query[key] = params[key];
    }
  });
  return query;
};

// Array Helpers
export const chunkArray = (array, size) => {
  if (!array || !Array.isArray(array)) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// String Helpers
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Number Helpers
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// SEO Helpers
export const generateProductSchema = (product, url) => {
  const baseUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  
  if (!product) return null;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description?.substring(0, 500),
    "image": product.images?.map(img => img.url) || [],
    "sku": product._id,
    "mpn": product._id,
    "brand": {
      "@type": "Brand",
      "name": "AR Hobby"
    },
    "offers": {
      "@type": "Offer",
      "url": url || `${baseUrl}/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": getConditionSchema(product.condition),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AR Hobby"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

export const getConditionSchema = (condition) => {
  const conditions = {
    'Uncirculated': 'https://schema.org/NewCondition',
    'Extremely Fine': 'https://schema.org/ExcellentCondition',
    'Very Fine': 'https://schema.org/GoodCondition',
    'Fine': 'https://schema.org/GoodCondition',
    'Very Good': 'https://schema.org/GoodCondition',
    'Good': 'https://schema.org/AcceptableCondition',
    'Fair': 'https://schema.org/AcceptableCondition',
    'Poor': 'https://schema.org/PoorCondition'
  };
  return conditions[condition] || 'https://schema.org/UsedCondition';
};

export const generateBreadcrumbSchema = (items, baseUrl) => {
  if (!items || !Array.isArray(items)) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name || item.label,
      "item": item.url ? `${baseUrl}${item.url}` : undefined
    }))
  };
};

// Validation Helpers
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const isValidPincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

// Local Storage Helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// URL Helpers
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const updateUrlParams = (params, replace = false) => {
  const urlParams = new URLSearchParams(window.location.search);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      urlParams.set(key, params[key]);
    } else {
      urlParams.delete(key);
    }
  });
  
  const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
  
  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
};

// Product Helpers
export const getProductCondition = (condition) => {
  const conditions = {
    'Uncirculated': 'Mint condition, never circulated',
    'Extremely Fine': 'Light wear, sharp details',
    'Very Fine': 'Moderate wear, clear details',
    'Fine': 'Considerable wear, details visible',
    'Very Good': 'Heavy wear, basic details',
    'Good': 'Significant wear, major details visible',
    'Fair': 'Heavy damage, details partially visible',
    'Poor': 'Severe damage, barely identifiable'
  };
  return conditions[condition] || condition;
};

export const getRarityLevel = (rarity) => {
  const levels = {
    'Common': 'Easily available',
    'Uncommon': 'Moderately available',
    'Rare': 'Difficult to find',
    'Very Rare': 'Extremely difficult to find',
    'Extremely Rare': 'Almost impossible to find'
  };
  return levels[rarity] || rarity;
};

// Image Helpers
export const getImageUrl = (url, width = 800, height = 800) => {
  if (!url) return '/placeholder.png';
  
  // If using Cloudinary, you can add transformations
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  }
  
  return url;
};

export const getOptimizedImageUrl = (url, options = {}) => {
  const { width = 400, height = 400, quality = 80, format = 'auto' } = options;
  
  if (!url) return '/placeholder.png';
  
  if (url.includes('cloudinary.com')) {
    let transformation = `/upload/`;
    if (width || height) transformation += `w_${width},h_${height},c_fill/`;
    if (quality) transformation += `q_${quality}/`;
    if (format) transformation += `f_${format}/`;
    return url.replace('/upload/', transformation);
  }
  
  return url;
};

// Debounce Helper
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle Helper
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Error Helpers
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.response?.data?.message) return error.response.data.message;
  
  if (error.message) return error.message;
  
  return 'Something went wrong. Please try again.';
};

// Constants
export const PRODUCT_CONDITIONS = [
  'Uncirculated',
  'Extremely Fine',
  'Very Fine',
  'Fine',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
];

export const PRODUCT_RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Very Rare',
  'Extremely Rare'
];

export const ORDER_STATUSES = [
  'Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered',
  'Cancelled',
  'Returned'
];

export const PAYMENT_STATUSES = [
  'Pending',
  'Received',
  'Verified',
  'Failed'
];