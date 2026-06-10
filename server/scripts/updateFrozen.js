require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const updateFrozen = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const products = await Product.find({ tab: 'iqf-frozen' });
    let updatedCount = 0;

    for (let product of products) {
      let changed = false;
      
      if (product.name.startsWith('IQF ')) {
        product.name = product.name.replace('IQF ', '');
        changed = true;
      }
      
      if (product.category === 'IQF Vegetables' || product.category !== 'Frozen') {
        product.category = 'Frozen';
        changed = true;
      }

      if (changed) {
        await product.save();
        console.log(`Updated product to: ${product.name} (Category: ${product.category})`);
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateFrozen();
