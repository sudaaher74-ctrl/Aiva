const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const Product = require('./models/Product');

async function updateBananaImage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aiva_enterprises');
    console.log('Connected to MongoDB');

    const result = await Product.updateOne(
      { name: 'IQF Banana' },
      { $set: { image_url: './assets/images/products/iqf_fruites/bananaIQF.png' } }
    );

    console.log('Update result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error updating product:', err);
    process.exit(1);
  }
}

updateBananaImage();
