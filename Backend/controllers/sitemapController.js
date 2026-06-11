import Product from '../models/Product.js';
import Category from '../models/Category.js';

const DEFAULT_SITE_URL = 'https://www.arhobby.in';

const getBaseUrl = () => {
  const configuredUrl = process.env.SITE_URL || process.env.FRONTEND_URL || DEFAULT_SITE_URL;
  return configuredUrl.replace(/\/+$/, '');
};

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const toLastmod = (value, fallback) => {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
};

const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) => {
  let entry = '  <url>\n';
  entry += `    <loc>${escapeXml(loc)}</loc>\n`;
  entry += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
  entry += `    <changefreq>${changefreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;
  entry += '  </url>\n';
  return entry;
};

const buildSitemapXml = (entries) => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  entries.forEach((entry) => {
    sitemap += buildUrlEntry(entry);
  });
  sitemap += '</urlset>';
  return sitemap;
};

const getStaticPageEntries = (baseUrl, currentDate) => [
  { loc: `${baseUrl}/`, lastmod: currentDate.toISOString(), changefreq: 'daily', priority: '1.0' },
  { loc: `${baseUrl}/shop`, lastmod: currentDate.toISOString(), changefreq: 'daily', priority: '0.9' },
  { loc: `${baseUrl}/new-arrivals`, lastmod: currentDate.toISOString(), changefreq: 'daily', priority: '0.9' },
  { loc: `${baseUrl}/about`, lastmod: currentDate.toISOString(), changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/contact`, lastmod: currentDate.toISOString(), changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/terms-and-conditions`, lastmod: currentDate.toISOString(), changefreq: 'yearly', priority: '0.5' }
];

const sendXml = (res, xml) => {
  res
    .status(200)
    .header('Content-Type', 'application/xml; charset=utf-8')
    .header('Cache-Control', 'public, max-age=3600')
    .send(xml);
};

export const generateSitemap = async (req, res) => {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();
  const staticEntries = getStaticPageEntries(baseUrl, currentDate);

  try {
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true, slug: { $exists: true, $ne: '' } })
        .select('slug updatedAt')
        .sort({ updatedAt: -1 })
        .lean(),
      Category.find({ isActive: true, slug: { $exists: true, $ne: '' } })
        .select('slug updatedAt')
        .sort({ order: 1, name: 1 })
        .lean()
    ]);

    const categoryEntries = categories.map((category) => ({
      loc: `${baseUrl}/category/${category.slug}`,
      lastmod: toLastmod(category.updatedAt, currentDate),
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const productEntries = products.map((product) => ({
      loc: `${baseUrl}/product/${product.slug}`,
      lastmod: toLastmod(product.updatedAt, currentDate),
      changefreq: 'weekly',
      priority: '0.6'
    }));

    sendXml(res, buildSitemapXml([...staticEntries, ...categoryEntries, ...productEntries]));
  } catch (error) {
    console.error('Error generating sitemap:', error);
    sendXml(res, buildSitemapXml(staticEntries));
  }
};

export const generateRobotsTxt = (req, res) => {
  const baseUrl = getBaseUrl();
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
Disallow: /login
Disallow: /register
Disallow: /verify-email
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
Sitemap: ${baseUrl}/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
};
