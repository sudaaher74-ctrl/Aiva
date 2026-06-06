const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const products = [
  // Aseptic / Pulps & Pastes
  {
    name: 'Alphonso Mango Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'Premium export-quality Alphonso Mango Pulp made from hand-picked Ratnagiri Alphonso mangoes packaged in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '16-18° Brix',
    shelfLife: '24 Months',
    image_url: './assets/alphonsomangodrum.png',
    status: 'Active'
  },
  
  {
    name: 'Kesar Mango Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'Rich and vibrant Kesar Mango Pulp, known for its sweet taste and bright color in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '16-18° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/kesarmangopulpdrum.png',
    status: 'Active'
  },
  
  {
    name: 'Totapuri Mango Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'High-quality Totapuri Mango Pulp, perfect for nectars and juices in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '14-16° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/totapurimangopulpdrumm.png',
    status: 'Active'
  },
  
  {
    name: 'Mango Concentrate (Aseptic Drum)',
    category: 'Concentrate',
    description: 'Highly concentrated mango base for premium beverage production in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '28-30° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/mangoconcentrate.png',
    status: 'Active'
  },
  
  {
    name: 'Banana Concentrate (Aseptic Drum)',
    category: 'Concentrate',
    description: 'Sweet and smooth banana concentrate, ideal for baby food and smoothies in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '24-26° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/bananaconcentratdrum.png',
    status: 'Active'
  },
  
  {
    name: 'Guava Concentrate (Aseptic Drum)',
    category: 'Concentrate',
    description: 'Aromatic guava concentrate made from selected fresh guavas in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '20-22° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/gavaconcentratedrum.png',
    status: 'Active'
  },
  
  {
    name: 'Pink Guava Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'Distinctive pink guava pulp with a sweet, musky flavor profile in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '9-11° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pinkguavadrum.png',
    status: 'Active'
  },
  
  {
    name: 'White Guava Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'Classic white guava pulp offering a perfect balance of sweetness and acidity in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '9-11° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/whiteguavadum.png',
    status: 'Active'
  },
  {
    name: 'Papaya Pulp (Aseptic Drum)',
    category: 'Fruit Pulp',
    description: 'Tropical papaya pulp, rich in color and natural enzymes in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '9-11° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/papayapulpdrum.png',
    status: 'Active'
  },
  
  {
    name: 'Tomato Paste (Aseptic Drum)',
    category: 'Paste',
    description: 'Cold-break and hot-break tomato paste with intense red color and fresh flavor profile in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '28-30° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/tomatopastedrum.png',
    status: 'Active'
  },
  

  // IQF (Individually Quick Frozen)
  {
    name: 'IQF Strawberry',
    category: 'IQF Fruits',
    description: 'Individually Quick Frozen (IQF) strawberries maintaining natural texture, flavor, and color.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/strawberryIQF.png',
    status: 'Active'
  },
  {
    name: 'IQF Banana',
    category: 'IQF Fruits',
    description: 'Premium frozen banana slices or dices, perfect for baking and smoothies.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/bananaIQF.png',
    status: 'Active'
  },
  {
    name: 'IQF Guava',
    category: 'IQF Fruits',
    description: 'Frozen guava maintaining its strong tropical aroma and nutritional value.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/guavaIQF.png',
    status: 'Active'
  },
  {
    name: 'IQF Totapuri Mango',
    category: 'IQF Fruits',
    description: 'Diced Totapuri mangoes frozen at peak freshness.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/totapuriIQF.png',
    status: 'Active'
  },
  {
    name: 'IQF Sweet Corn',
    category: 'IQF Vegetables',
    description: 'Tender and sweet IQF corn kernels, processed within hours of harvest.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/sweetcornIQF.png',
    status: 'Active'
  }
];

const seedDB = async () => {
  await connectDB();
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert new products
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} products.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
