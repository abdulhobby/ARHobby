// utils/seoHelpers.js

export const generateProductSchema = (product, url) => {
  const baseUrl = process.env.REACT_APP_SITE_URL || window.location.origin;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
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
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AR Hobby",
    "url": process.env.REACT_APP_SITE_URL || window.location.origin,
    "logo": `${process.env.REACT_APP_SITE_URL}/logo.png`,
    "sameAs": [
      "https://facebook.com/arhobby",
      "https://twitter.com/arhobby",
      "https://instagram.com/arhobby"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    }
  };
};

export const generateWebsiteSchema = () => {
  const siteUrl = import.meta.process.env.VITE_SITE_URL || window.location.origin;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AR Hobby",
    "url": siteUrl,
    "description": "Discover rare collectible currencies, coins, and banknotes from around the world",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};