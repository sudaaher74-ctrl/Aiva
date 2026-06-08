const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const templatePath = path.join(__dirname, 'template.html');
const productsDir = path.join(__dirname, '..', 'products');
const locationsDir = path.join(__dirname, '..', 'locations');

// Ensure output directories exist
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);
if (!fs.existsSync(locationsDir)) fs.mkdirSync(locationsDir);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

function generateProductPages() {
  data.products.forEach(product => {
    let html = template;
    
    // Core SEO Replace
    html = html.replace(/\{\{TITLE\}\}/g, product.title);
    html = html.replace(/\{\{META_DESC\}\}/g, product.description);
    html = html.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.aivaenterprises.com/products/${product.slug}`);
    
    // Content Replace
    html = html.replace(/\{\{PRODUCT_NAME\}\}/g, product.name);
    html = html.replace(/\{\{CATEGORY\}\}/g, product.category);
    html = html.replace(/\{\{PRODUCT_IMAGE\}\}/g, product.image);
    html = html.replace(/\{\{PRODUCT_OVERVIEW\}\}/g, product.overview);
    html = html.replace(/\{\{APPLICATIONS\}\}/g, product.applications);
    html = html.replace(/\{\{SPEC_BRIX\}\}/g, product.specs.brix);
    html = html.replace(/\{\{SPEC_ACIDITY\}\}/g, product.specs.acidity);
    html = html.replace(/\{\{SPEC_PH\}\}/g, product.specs.ph);
    html = html.replace(/\{\{SPEC_COLOR\}\}/g, product.specs.color);
    html = html.replace(/\{\{PACKAGING\}\}/g, product.packaging);
    html = html.replace(/\{\{SHELF_LIFE\}\}/g, product.shelfLife);
    html = html.replace(/\{\{STORAGE\}\}/g, product.storage);

    // FAQs HTML
    let faqHtml = '';
    let faqSchemaElements = [];
    product.faqs.forEach(faq => {
      faqHtml += `<div class="faq-item"><h4>${faq.q}</h4><p>${faq.a}</p></div>`;
      faqSchemaElements.push({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      });
    });
    html = html.replace(/\{\{FAQ_HTML\}\}/g, faqHtml);

    // Schemas
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": `https://www.aivaenterprises.com${product.image}`,
      "description": product.description,
      "brand": { "@type": "Brand", "name": "AIVA Enterprises" }
    };
    
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aivaenterprises.com/" },
        { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://www.aivaenterprises.com/products" },
        { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://www.aivaenterprises.com/products/${product.slug}` }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSchemaElements
    };

    const schemas = `
    <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    `;
    
    html = html.replace(/\{\{JSON_LD\}\}/g, schemas);

    const outputPath = path.join(productsDir, `${product.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  });
}

function generateLocationPages() {
  data.locations.forEach(loc => {
    let html = template;
    
    html = html.replace(/\{\{TITLE\}\}/g, loc.title);
    html = html.replace(/\{\{META_DESC\}\}/g, loc.description);
    html = html.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.aivaenterprises.com/${loc.slug}`);
    
    html = html.replace(/\{\{PRODUCT_NAME\}\}/g, `${loc.country} Export Hub`);
    html = html.replace(/\{\{CATEGORY\}\}/g, loc.focus);
    html = html.replace(/\{\{PRODUCT_IMAGE\}\}/g, '/assets/images/products/newlogo.webp');
    html = html.replace(/\{\{PRODUCT_OVERVIEW\}\}/g, loc.content);
    html = html.replace(/\{\{APPLICATIONS\}\}/g, 'Serving B2B Food & Beverage Manufacturers in this region.');
    html = html.replace(/\{\{SPEC_BRIX\}\}/g, 'N/A');
    html = html.replace(/\{\{SPEC_ACIDITY\}\}/g, 'N/A');
    html = html.replace(/\{\{SPEC_PH\}\}/g, 'N/A');
    html = html.replace(/\{\{SPEC_COLOR\}\}/g, 'N/A');
    html = html.replace(/\{\{PACKAGING\}\}/g, 'Bulk Drums / Cans / Carton');
    html = html.replace(/\{\{SHELF_LIFE\}\}/g, '24 Months');
    html = html.replace(/\{\{STORAGE\}\}/g, 'Ambient / Cold Chain');
    html = html.replace(/\{\{FAQ_HTML\}\}/g, '');

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aivaenterprises.com/" },
        { "@type": "ListItem", "position": 2, "name": loc.country, "item": `https://www.aivaenterprises.com/${loc.slug}` }
      ]
    };
    html = html.replace(/\{\{JSON_LD\}\}/g, `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`);

    // Save Location pages directly in the root folder for cleaner URLs (e.g., /fruit-pulp-exporter-india)
    const outputPath = path.join(__dirname, '..', `${loc.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  });
}

generateProductPages();
generateLocationPages();
console.log('Static Site Generation complete.');
