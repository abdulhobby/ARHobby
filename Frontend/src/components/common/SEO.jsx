// components/common/SEO.jsx
import { useEffect } from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'product',
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
    // Use import.meta.env for Vite instead of process.env
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const siteTitle = import.meta.env.VITE_SITE_NAME || siteName;
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultImage = `${siteUrl}/og-image.jpg`;
    const imageUrl = image || defaultImage;
    const metaDescription = description || import.meta.env.VITE_SITE_DESCRIPTION || 'Discover rare collectible currencies, coins, and banknotes from around the world. Authentic collection for hobbyists and investors.';
    const metaKeywords = keywords || 'collectible currencies, rare coins, banknotes, numismatics, currency collection, antique coins, collectible money';
    const currentUrl = url || window.location.href;
    const canonical = canonicalUrl || currentUrl;

    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      let selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute(property ? 'property' : 'name', name);
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const updateLinkTag = (rel, href, type = null) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (link) {
        link.setAttribute('href', href);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        if (type) {
          link.setAttribute('type', type);
        }
        document.head.appendChild(link);
      }
    };

    // Remove existing script tags for schema to avoid duplicates
    const existingScript = document.querySelector('#product-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Basic Meta Tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', author);
    updateMetaTag('copyright', author);
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('distribution', 'global');
    updateMetaTag('rating', 'general');

    // Open Graph / Facebook
    updateMetaTag('og:type', type === 'product' ? 'product' : 'website', true);
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
    updateMetaTag('og:locale:alternate', 'en_US', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', import.meta.env.VITE_TWITTER_SITE || '@arhobby');
    updateMetaTag('twitter:creator', import.meta.env.VITE_TWITTER_CREATOR || '@arhobby');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', imageUrl);
    updateMetaTag('twitter:image:alt', title || siteTitle);

    // Article Specific
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }
    if (author) {
      updateMetaTag('article:author', author, true);
    }
    if (section) {
      updateMetaTag('article:section', section, true);
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag, i) => {
        updateMetaTag(`article:tag`, tag, true);
      });
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

    // Alternate Language Versions
    updateLinkTag('alternate', canonical, null);
    const alternateLink = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (alternateLink) {
      alternateLink.setAttribute('href', canonical);
    } else if (canonical) {
      const hreflangLink = document.createElement('link');
      hreflangLink.setAttribute('rel', 'alternate');
      hreflangLink.setAttribute('hreflang', 'x-default');
      hreflangLink.setAttribute('href', canonical);
      document.head.appendChild(hreflangLink);
    }

    // Schema.org JSON-LD
    if (productData && type === 'product') {
      const schemaScript = document.createElement('script');
      schemaScript.id = 'product-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(productData.schemaMarkup || generateProductSchema({
        ...productData,
        name: title,
        description: metaDescription,
        image: imageUrl,
        url: currentUrl,
        siteName: siteTitle
      }));
      document.head.appendChild(schemaScript);
    } else if (type === 'website') {
      const websiteSchema = document.createElement('script');
      websiteSchema.id = 'website-schema';
      websiteSchema.type = 'application/ld+json';
      websiteSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "url": siteUrl,
        "description": metaDescription,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/shop?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      });
      document.head.appendChild(websiteSchema);
    }
  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, 
      author, section, tags, productData, noIndex, canonicalUrl, locale, siteName]);

  return null;
};

// Helper function to generate product schema
const generateProductSchema = (data) => {
  const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "image": data.image,
    "sku": data.sku || data.id,
    "mpn": data.mpn || data.id,
    "brand": {
      "@type": "Brand",
      "name": data.brand || "AR Hobby"
    },
    "offers": {
      "@type": "Offer",
      "url": data.url,
      "priceCurrency": "INR",
      "price": data.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": data.condition ? 
        `https://schema.org/${data.condition.replace(/\s/g, '')}Condition` : 
        "https://schema.org/UsedCondition",
      "availability": data.stock > 0 ? 
        "https://schema.org/InStock" : 
        "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": data.siteName || "AR Hobby"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

export default SEO;