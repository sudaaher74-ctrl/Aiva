const fs = require('fs');
let css = fs.readFileSync('frontend/src/styles/styles.css', 'utf-8');
let indexCss = fs.readFileSync('frontend/src/index.css', 'utf-8');

// 1. index.css update
indexCss = indexCss.replace(
  /font-family: var\(--font-body, 'Plus Jakarta Sans', sans-serif\);/g,
  "font-family: var(--font-body, 'Lora', Georgia, serif);"
);
fs.writeFileSync('frontend/src/index.css', indexCss);

// 2. styles.css updates
css = css.replace(
  "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');",
  "@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');"
);

css = css.replace(
  /--font-heading: 'Plus Jakarta Sans', sans-serif;\s*--font-body: 'Plus Jakarta Sans', sans-serif;/,
  `--font-heading: 'Lora', Georgia, serif;
    --font-body: 'Lora', Georgia, serif;
    
    --fs-display: 64px;
    --fs-h1: 44px;
    --fs-h2: 32px;
    --fs-h3: 24px;
    --fs-body-lg: 20px;
    --fs-body: 18px;
    --fs-small: 15px;
    --fs-caption: 13px;`
);

css = css.replace(
  /body \{\s*font-family: var\(--font-body\);\s*font-size: 18px;/,
  "body {\n    font-family: var(--font-body);\n    font-size: var(--fs-body);"
);

css = css.replace(/h1, \.hero-title, \.prod-hero-title \{[\s\S]*?font-size: 72px;/, "h1, .hero-title, .prod-hero-title {\n    font-family: var(--font-heading);\n    font-size: var(--fs-h1);");
css = css.replace(/h2, \.section-title \{[\s\S]*?font-size: 48px;/, "h2, .section-title {\n    font-family: var(--font-heading);\n    font-size: var(--fs-h2);");
css = css.replace(/h3, \.section-subtitle \{[\s\S]*?font-size: 32px;/, "h3, .section-subtitle {\n    font-family: var(--font-heading);\n    font-size: var(--fs-h3);");
css = css.replace(/h4 \{[\s\S]*?font-size: 24px;/, "h4, .card-title, .product-name, .p-info h3 {\n    font-family: var(--font-heading);\n    font-size: var(--fs-h3);");
css = css.replace(/\.body-large, \.hero-subtitle, \.hero-description, \.prod-hero-subtitle, \.section-desc \{[\s\S]*?font-size: 20px;/, ".body-large, .hero-subtitle, .hero-description, .prod-hero-subtitle, .section-desc {\n    font-size: var(--fs-body-lg);");
css = css.replace(/\.small-desc \{[\s\S]*?font-size: 15px;/, ".small-desc, .p-desc, .footer-links a, .spec-val, .standard-card p {\n    font-size: var(--fs-small);");

css = css.replace(/\.card-title, \.product-name \{[\s\S]*?font-weight: 600;\s*\}/, "/* .card-title etc moved to h4 */");

css = css.replace(/\.btn \{([\s\S]*?)font-size: 17px;/, ".btn {$1font-size: var(--fs-body);");
css = css.replace(/\.btn-primary \{([\s\S]*?)font-size: 18px;/, ".btn-primary {$1font-size: var(--fs-body);");
css = css.replace(/\.nav-links a \{([\s\S]*?)font-size: 17px;/, ".nav-links a {$1font-size: var(--fs-body);");
css = css.replace(/\.footer-links a \{([\s\S]*?)font-size: 16px;/, ".footer-links a {$1font-size: var(--fs-small);");
css = css.replace(/\.footer-bottom \{([\s\S]*?)font-size: 14px;/, ".footer-bottom {$1font-size: var(--fs-caption);");
css = css.replace(/\.btn-link \{([\s\S]*?)font-size: 0\.8rem;/, ".btn-link {$1font-size: var(--fs-caption);");

// Media queries
css = css.replace(/@media \(max-width: 1439px\) \{[\s\S]*?h3, \.section-subtitle \{ font-size: 28px; \}\s*\}/, 
`@media (max-width: 1439px) {
    h1, .hero-title, .prod-hero-title { font-size: 40px; }
    h2, .section-title { font-size: 30px; }
    h3, .section-subtitle { font-size: 22px; }
}`);

css = css.replace(/@media \(max-width: 1023px\) \{[\s\S]*?h3, \.section-subtitle \{ font-size: 28px; \}\s*\}/, 
`@media (max-width: 1023px) {
    .section-padding { padding: 80px 0; }
    h1, .hero-title, .prod-hero-title { font-size: 38px; }
    h2, .section-title { font-size: 28px; }
    h3, .section-subtitle { font-size: 22px; }
}`);

css = css.replace(/@media \(max-width: 767px\) \{[\s\S]*?\.btn \{ font-size: 16px; \}\s*\}/, 
`@media (max-width: 767px) {
    body { font-size: 16px; }
    .section-padding { padding: 60px 0; }
    h1, .hero-title, .prod-hero-title { font-size: 32px; }
    h2, .section-title { font-size: 26px; }
    h3, .section-subtitle { font-size: 20px; }
    .body-large, .hero-subtitle, .hero-description, .prod-hero-subtitle, .section-desc { font-size: 18px; }
    .btn { font-size: 16px; }
}`);

fs.writeFileSync('frontend/src/styles/styles.css', css);
console.log('Styles updated.');
