const fs = require('fs');
const path = require('path');

const domain = 'https://www.aivaenterprises.com';

function generateSitemap() {
  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const sitemapFooter = `\n</urlset>`;
  let sitemapContent = '';

  const addUrl = (urlStr) => {
    sitemapContent += `\n  <url>\n    <loc>${domain}${urlStr}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  };

  // Add root pages
  addUrl('/');
  addUrl('/about');
  addUrl('/products');
  addUrl('/contact');

  // Add generated location pages in root
  const rootDir = path.join(__dirname, '..');
  fs.readdirSync(rootDir).forEach(file => {
    if (file.endsWith('.html') && !['index.html', 'about.html', 'products.html', 'contact.html', 'dashboard.html'].includes(file)) {
      const slug = file.replace('.html', '');
      addUrl(`/${slug}`);
    }
  });

  // Add product pages
  const productsDir = path.join(__dirname, '..', 'products');
  if (fs.existsSync(productsDir)) {
    fs.readdirSync(productsDir).forEach(file => {
      if (file.endsWith('.html')) {
        const slug = file.replace('.html', '');
        addUrl(`/products/${slug}`);
      }
    });
  }

  const fullSitemap = sitemapHeader + sitemapContent + sitemapFooter;
  fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), fullSitemap);
  console.log('Generated sitemap.xml');
}

function generateRobots() {
  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /server/

Sitemap: ${domain}/sitemap.xml
`;
  fs.writeFileSync(path.join(__dirname, '..', 'robots.txt'), content);
  console.log('Generated robots.txt');
}

generateSitemap();
generateRobots();
