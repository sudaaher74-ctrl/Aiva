const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const templatePath = path.join(__dirname, 'template.html');
const productsDir = path.join(__dirname, '..', 'products');
const locationsDir = path.join(__dirname, '..', 'locations');
const seoDir = path.join(__dirname, '..', 'seo');

// Ensure output directories exist
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);
if (!fs.existsSync(locationsDir)) fs.mkdirSync(locationsDir);
if (!fs.existsSync(seoDir)) fs.mkdirSync(seoDir);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

function generateProductPages() {
  if(!data.products) return;
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
    if(product.faqs && product.faqs.length > 0) {
      product.faqs.forEach(faq => {
        faqHtml += `<div class="faq-item"><h4>${faq.q}</h4><p>${faq.a}</p></div>`;
        faqSchemaElements.push({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        });
      });
    }
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

    let faqSchemaStr = '';
    if(faqSchemaElements.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqSchemaElements
        };
        faqSchemaStr = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    }

    const schemas = `
    <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    ${faqSchemaStr}
    `;
    
    html = html.replace(/\{\{JSON_LD\}\}/g, schemas);

    const outputPath = path.join(productsDir, `${product.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  });
}

function generateLandingPages() {
  if(!data.landingPages) return;
  data.landingPages.forEach(page => {
    let html = template;
    
    html = html.replace(/\{\{TITLE\}\}/g, page.title);
    html = html.replace(/\{\{META_DESC\}\}/g, page.description);
    html = html.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.aivaenterprises.com/seo/${page.slug}`);
    
    html = html.replace(/\{\{PRODUCT_NAME\}\}/g, page.h1);
    html = html.replace(/\{\{CATEGORY\}\}/g, page.category);
    html = html.replace(/\{\{PRODUCT_IMAGE\}\}/g, page.image || '/assets/images/products/newlogo.webp');
    html = html.replace(/\{\{PRODUCT_OVERVIEW\}\}/g, page.content);
    html = html.replace(/\{\{APPLICATIONS\}\}/g, page.applications || 'Serving B2B Food & Beverage Manufacturers globally.');
    
    // Provide generic specifications for landing pages unless specified
    html = html.replace(/\{\{SPEC_BRIX\}\}/g, page.specs?.brix || 'Varies by product');
    html = html.replace(/\{\{SPEC_ACIDITY\}\}/g, page.specs?.acidity || 'Varies by product');
    html = html.replace(/\{\{SPEC_PH\}\}/g, page.specs?.ph || 'Varies by product');
    html = html.replace(/\{\{SPEC_COLOR\}\}/g, page.specs?.color || 'Natural Characteristic Color');
    html = html.replace(/\{\{PACKAGING\}\}/g, page.packaging || 'Aseptic Drums, Cans, Cartons');
    html = html.replace(/\{\{SHELF_LIFE\}\}/g, page.shelfLife || '12 - 24 Months');
    html = html.replace(/\{\{STORAGE\}\}/g, page.storage || 'Ambient / Cold Chain based on product');
    html = html.replace(/\{\{FAQ_HTML\}\}/g, '');

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aivaenterprises.com/" },
        { "@type": "ListItem", "position": 2, "name": page.h1, "item": `https://www.aivaenterprises.com/seo/${page.slug}` }
      ]
    };
    html = html.replace(/\{\{JSON_LD\}\}/g, `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`);

    // Save Location pages in the seo folder
    const outputPath = path.join(seoDir, `${page.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${outputPath}`);
  });
}

generateProductPages();
generateLandingPages();
console.log('Static Site Generation complete.');
