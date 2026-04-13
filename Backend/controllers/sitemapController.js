import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = 'https://www.arhobby.in';
    const currentDate = new Date().toISOString();

    // Fetch all active products, categories, and subcategories
    const [products, categories, subCategories] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt').lean(),
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
      SubCategory.find({ isActive: true }).select('slug updatedAt').lean()
    ]);

    // Static pages
    const staticPages = [
      { loc: '', changefreq: 'daily', priority: '1.0' },
      { loc: '/shop', changefreq: 'daily', priority: '0.9' },
      { loc: '/new-arrivals', changefreq: 'daily', priority: '0.9' },
      { loc: '/about', changefreq: 'monthly', priority: '0.7' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
      { loc: '/terms-and-conditions', changefreq: 'yearly', priority: '0.5' }
    ];

    // Build XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    // Add categories
    categories.forEach(category => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
      sitemap += `    <lastmod>${category.updatedAt ? category.updatedAt.toISOString() : currentDate}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    // Add subcategories (if you have subcategory pages)
    subCategories.forEach(subCategory => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/subcategory/${subCategory.slug}</loc>\n`;
      sitemap += `    <lastmod>${subCategory.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    });

    // Add products
    products.forEach(product => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/product/${product.slug}</loc>\n`;
      sitemap += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

export const generateRobotsTxt = (req, res) => {
  const robotsTxt = `# AR Hobby - Robots.txt
# www.arhobby.in

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: /addresses
Disallow: /order-success/
Disallow: /track-order/
Disallow: /forgot-password
Disallow: /reset-password/

# Allow crawling of public pages
Allow: /shop
Allow: /category/
Allow: /product/
Allow: /new-arrivals
Allow: /about
Allow: /contact
Allow: /terms-and-conditions

# Sitemap location
Sitemap: https://www.arhobby.in/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
};