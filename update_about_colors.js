const fs = require('fs');
let css = fs.readFileSync('frontend/src/pages/About.css', 'utf-8');

css = css.replace(/var\(--accent-gold, #[a-zA-Z0-9]{6}\)/g, 'var(--c-mango)');
css = css.replace(/#D4AF37/gi, 'var(--c-mango)');
css = css.replace(/#dbaa0c/gi, 'var(--c-mango)');
css = css.replace(/#d58c1f/gi, 'var(--c-mango)');

fs.writeFileSync('frontend/src/pages/About.css', css);
console.log('About.css updated.');
