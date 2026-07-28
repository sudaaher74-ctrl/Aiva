import { productsData } from './frontend/src/data/products.js';
import fs from 'fs';

const backendData = JSON.parse(fs.readFileSync('./backend_mock.json', 'utf8'));

const data = backendData;

try {
  const mergedData = data.data.map(backendProduct => {
    const staticMatch = productsData.find(p => 
      p.name === backendProduct.name || 
      (backendProduct.name && backendProduct.name.includes(p.name)) || 
      (p.name && backendProduct.name && p.name.includes(backendProduct.name.replace('IQF ', '').trim()))
    );
    if (staticMatch) {
      return { 
        ...backendProduct, 
        image: staticMatch.image || backendProduct.image,
        tab: staticMatch.tab || backendProduct.tab 
      };
    }
    return backendProduct;
  });

  const missingStatic = productsData.filter(staticProd => {
    const isMatched = data.data.some(backendProduct => 
      staticProd.name === backendProduct.name || 
      (backendProduct.name && backendProduct.name.includes(staticProd.name)) || 
      (staticProd.name && backendProduct.name && staticProd.name.includes(backendProduct.name.replace('IQF ', '').trim()))
    );
    return !isMatched;
  });

  console.log("Success! Merged:", mergedData.length, "Missing:", missingStatic.length);
} catch (e) {
  console.error("Error:", e);
}
