const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, '..', 'assets', 'images', 'products');

function optimizeImages(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      optimizeImages(fullPath);
    } else if (file.match(/\.(png|jpe?g)$/i)) {
      const parsedPath = path.parse(fullPath);
      const webpPath = path.join(dir, `${parsedPath.name}.webp`);
      
      sharp(fullPath)
        .webp({ quality: 80 })
        .toFile(webpPath)
        .then(() => {
          console.log(`Optimized: ${file} -> ${parsedPath.name}.webp`);
          // Note: we're keeping the original to avoid breaking existing hardcoded references until replaced
        })
        .catch(err => {
          console.error(`Error optimizing ${file}:`, err);
        });
    }
  });
}

optimizeImages(imgDir);
