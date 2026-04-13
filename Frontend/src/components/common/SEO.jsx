// components/common/SEO.jsx
import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'AR Hobby',
  section,
  tags = [],
  productData,
  noIndex = false,
  canonicalUrl,
  locale = 'en_IN',
  siteName = 'AR Hobby'
}) => {

  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.arhobby.in';
    const siteTitle = import.meta.env.VITE_SITE_NAME || siteName;
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultImage = `${siteUrl}/og-image.jpg`;
    const imageUrl = image || defaultImage;
    const metaDescription = description || import.meta.env.VITE_SITE_DESCRIPTION || 'Shop premium hobby products at AR Hobby. Discover quality collectibles, hobby supplies, and rare items with fast delivery across India.';
    const metaKeywords = keywords || 'AR Hobby, hobby products, collectibles, hobby store India, hobby supplies online';
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
    const canonical = canonicalUrl || currentUrl;

    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (identifier, content, useProperty = false) => {
      if (!content) return;

      const attribute = useProperty ? 'property' : 'name';
      const selector = `meta[${attribute}="${identifier}"]`;

      let meta = document.querySelector(selector);

      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, identifier);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const updateLinkTag = (rel, href, attributes = {}) => {
      if (!href) return;

      let link = document.querySelector(`link[rel="${rel}"]${attributes.hreflang ? `[hreflang="${attributes.hreflang}"]` : ''}`);

      if (link) {
        link.setAttribute('href', href);
        Object.entries(attributes).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        Object.entries(attributes).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
        document.head.appendChild(link);
      }
    };

    // Remove existing JSON-LD scripts to avoid duplicates
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      if (script.id === 'product-schema' || script.id === 'website-schema' || script.id === 'organization-schema') {
        script.remove();
      }
    });

    // Basic Meta Tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('bingbot', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', author);
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'IN');
    updateMetaTag('geo.placename', 'India');

    // Open Graph / Facebook
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', metaDescription, true);
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('og:image:secure_url', imageUrl, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', title || siteTitle, true);
    updateMetaTag('og:site_name', siteTitle, true);
    updateMetaTag('og:locale', locale, true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@arhobby');
    updateMetaTag('twitter:creator', '@arhobby');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', imageUrl);
    updateMetaTag('twitter:image:alt', title || siteTitle);

    // Article/Product Specific Meta
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }
    if (section) {
      updateMetaTag('article:section', section, true);
    }

    // Product Specific
    if (productData && type === 'product') {
      updateMetaTag('product:price:amount', productData.price?.toString(), true);
      updateMetaTag('product:price:currency', 'INR', true);
      updateMetaTag('product:availability', productData.stock > 0 ? 'in stock' : 'out of stock', true);
      if (productData.condition) {
        updateMetaTag('product:condition', productData.condition, true);
      }
      if (productData.brand) {
        updateMetaTag('product:brand', productData.brand, true);
      }
    }

    // Canonical URL
    updateLinkTag('canonical', canonical);

    // Alternate for mobile
    updateLinkTag('alternate', canonical, { media: 'only screen and (max-width: 640px)' });

    // Hreflang tags
    updateLinkTag('alternate', canonical, { hreflang: 'en-in' });
    updateLinkTag('alternate', canonical, { hreflang: 'x-default' });

    // JSON-LD Schema Markup
    addSchemaMarkup(type, {
      siteUrl,
      siteTitle,
      title: fullTitle,
      description: metaDescription,
      imageUrl,
      currentUrl,
      productData
    });

    // Cleanup function
    return () => {
      // Optional: Clean up specific meta tags if needed
    };
  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime,
    author, section, tags, productData, noIndex, canonicalUrl, locale, siteName]);

  return null;
};

// Helper function to add JSON-LD Schema Markup
const addSchemaMarkup = (type, data) => {
  const schemas = [];

  // Organization Schema (Global)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AR Hobby",
    "url": data.siteUrl,
    "logo": `${data.siteUrl}/logo.png`,
    "description": "Premium hobby products and collectibles store in India",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/arhobby",
      "https://www.instagram.com/arhobby",
      "https://twitter.com/arhobby"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.siteTitle,
    "url": data.siteUrl,
    "description": data.description,
    "publisher": {
      "@type": "Organization",
      "name": "AR Hobby"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${data.siteUrl}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  schemas.push(organizationSchema, websiteSchema);

  // Product Schema
  if (type === 'product' && data.productData) {
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.productData.name || data.title,
      "description": data.productData.description || data.description,
      "image": data.imageUrl,
      "sku": data.productData.sku || data.productData._id,
      "mpn": data.productData.mpn || data.productData._id,
      "brand": {
        "@type": "Brand",
        "name": data.productData.brand || "AR Hobby"
      },
      "offers": {
        "@type": "Offer",
        "url": data.currentUrl,
        "priceCurrency": "INR",
        "price": data.productData.price || data.productData.salePrice || 0,
        "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "itemCondition": data.productData.condition ?
          `https://schema.org/${data.productData.condition.replace(/\s/g, '')}Condition` :
          "https://schema.org/NewCondition",
        "availability": data.productData.stock > 0 ?
          "https://schema.org/InStock" :
          "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "AR Hobby"
        }
      }
    };

    // Add ratings if available
    if (data.productData.rating) {
      productSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": data.productData.rating || "4.8",
        "reviewCount": data.productData.reviewCount || "127",
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    schemas.push(productSchema);
  }

  // BreadcrumbList Schema
  if (type === 'product' && data.productData?.category) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": data.siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": data.productData.category.name || "Shop",
          "item": `${data.siteUrl}/category/${data.productData.category.slug || 'all'}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": data.productData.name,
          "item": data.currentUrl
        }
      ]
    };
    schemas.push(breadcrumbSchema);
  }

  // Add all schemas to head
  const schemaScript = document.createElement('script');
  schemaScript.id = type === 'product' ? 'product-schema' : 'website-schema';
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  document.head.appendChild(schemaScript);
};

export default SEO;