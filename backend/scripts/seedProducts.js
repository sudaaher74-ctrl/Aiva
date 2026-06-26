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
    name: 'Alphonso Mango Pulp',
    category: 'Fruit Pulp',
    description: 'Premium export-quality Alphonso Mango Pulp made from hand-picked Ratnagiri Alphonso mangoes packaged in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '16-18° Brix',
    shelfLife: '24 Months',
    image_url: './assets/alphonsomangodrum.png',
    status: 'Active'
  },
  
  {
    name: 'Kesar Mango Pulp',
    category: 'Fruit Pulp',
    description: 'Rich and vibrant Kesar Mango Pulp, known for its sweet taste and bright color in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '16-18° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/kesarmangopulpdrum.webp',
    status: 'Active'
  },
  
  {
    name: 'Totapuri Mango Pulp',
    category: 'Fruit Pulp',
    description: 'High-quality Totapuri Mango Pulp, perfect for nectars and juices in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '14-16° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/totapurimangopulpdrumm.webp',
    status: 'Active'
  },
  
  {
    name: 'Mango Concentrate',
    category: 'Concentrate',
    description: 'Highly concentrated mango base for premium beverage production in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '28-30° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/mangoconcentrate.webp',
    status: 'Active'
  },
  
  {
    name: 'Banana Concentrate',
    category: 'Concentrate',
    description: 'Sweet and smooth banana concentrate, ideal for baby food and smoothies in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '24-26° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/bananaconcentratdrum.webp',
    status: 'Active'
  },
  
  {
    name: 'Guava Concentrate',
    category: 'Concentrate',
    description: 'Aromatic guava concentrate made from selected fresh guavas in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '20-22° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/gavaconcentratedrum.webp',
    status: 'Active'
  },
  
  {
    name: 'Pink Guava Pulp',
    category: 'Fruit Pulp',
    description: 'Distinctive pink guava pulp with a sweet, musky flavor profile in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '9-11° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/pinkguavapulpdrum.png',
    status: 'Active'
  },
  

  {
    name: 'Papaya Pulp',
    category: 'Fruit Pulp',
    description: 'Tropical papaya pulp, rich in color and natural enzymes in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '9-11° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/papayapulpdrum1.png',
    status: 'Active'
  },
  
  {
    name: 'Tomato Paste',
    category: 'Paste',
    description: 'Cold-break and hot-break tomato paste with intense red color and fresh flavor profile in bulk aseptic drums.',
    tab: 'aseptic',
    brix: '28-30° Brix',
    shelfLife: '24 Months',
    image_url: './assets/images/products/pulp/tomatopastedrum.webp',
    status: 'Active'
  },
  

  // IQF (Individually Quick Frozen)
  {
    name: 'IQF Strawberry',
    category: 'IQF Fruits',
    description: 'Individually Quick Frozen (IQF) strawberries maintaining natural texture, flavor, and color.',
    tab: 'iqf-fruits',
    shelfLife: '18 Months',
    image_url: './assets/images/products/iqf_fruites/strawberryIQF.webp',
    status: 'Active'
  },
  {
    name: 'IQF Banana',
    category: 'IQF Fruits',
    description: 'Premium frozen banana slices or dices, perfect for baking and smoothies.',
    tab: 'iqf-fruits',
    shelfLife: '18 Months',
    image_url: './assets/images/products/iqf_fruites/bananaIQF.png',
    status: 'Active'
  },
  {
    name: 'IQF Guava',
    category: 'IQF Fruits',
    description: 'Frozen guava maintaining its strong tropical aroma and nutritional value.',
    tab: 'iqf-fruits',
    shelfLife: '18 Months',
    image_url: './assets/images/products/iqf_fruites/guavaIQF.webp',
    status: 'Active'
  },
  {
    name: 'IQF Totapuri Mango',
    category: 'IQF Fruits',
    description: 'Diced Totapuri mangoes frozen at peak freshness.',
    tab: 'iqf',
    shelfLife: '18 Months',
    image_url: './assets/images/products/iqf_fruites/totapuriIQF.webp',
    status: 'Active'
  },
  {
    name: 'IQF Sweet Corn',
    category: 'IQF Vegetables',
    description: 'Tender and sweet IQF corn kernels, processed within hours of harvest.',
    tab: 'vegetables',
    shelfLife: '18 Months',
    image_url: './assets/images/products/vegetables/sweetcorn.png',
    status: 'Active'
  }
  ,{
    name: 'IQF Green Peas',
    category: 'IQF Vegetables',
    description: 'Tender and sweet individually quick frozen green peas.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/greenpeas.png',
    status: 'Active'
  },
  {
    name: 'IQF Okra',
    category: 'IQF Vegetables',
    description: 'Clean-cut okra frozen quickly for reliable color and texture.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/okraIQFfrozzen.png',
    status: 'Active'
  },
  {
    name: 'IQF Spinach',
    category: 'IQF Vegetables',
    description: 'Fresh spinach leaves, available whole or chopped.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/spinch.png',
    status: 'Active'
  },
  {
    name: 'IQF Mix Vegetable',
    category: 'IQF Vegetables',
    description: 'Blend of Green Peas, Carrot & Green Beans.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/mixvegitables.png',
    status: 'Active'
  },
  {
    name: 'IQF Corn on Cobs',
    category: 'IQF Vegetables',
    description: 'Sweet corn cob portions frozen quickly.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/corn on cobs.png',
    status: 'Active'
  },
  {
    name: 'IQF Carrot',
    category: 'IQF Vegetables',
    description: 'Diced carrots, individually quick frozen.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/carrot.png',
    status: 'Active'
  },
  {
    name: 'IQF Baby Corn',
    category: 'IQF Vegetables',
    description: 'Tender baby corn, individually quick frozen.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/babycoen.png',
    status: 'Active'
  },
  {
    name: 'IQF Beetroot',
    category: 'IQF Vegetables',
    description: 'Diced beetroot, individually quick frozen.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/beetroot.png',
    status: 'Active'
  },
  {
    name: 'IQF Cauliflower',
    category: 'IQF Vegetables',
    description: 'Cauliflower florets, individually quick frozen.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/cauliflower.png',
    status: 'Active'
  },
  {
    name: 'IQF Mushroom',
    category: 'IQF Vegetables',
    description: 'Sliced or whole mushrooms, individually quick frozen.',
    tab: 'vegetables',
    shelfLife: '24 Months',
    image_url: './assets/images/products/vegetables/mashrum.png',
    status: 'Active'
  },
  {
    name: 'IQF Coriander & Green Chilli',
    category: 'IQF Vegetables',
    description: 'Fresh coriander and green chilli blend, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/coriander&greencilli.png',
    status: 'Active'
  },
  {
    name: 'IQF Mint',
    category: 'IQF Vegetables',
    description: 'Fresh mint leaves, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/mint.png',
    status: 'Active'
  },
  {
    name: 'IQF Onion',
    category: 'IQF Vegetables',
    description: 'Diced or sliced onions, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/onion.png',
    status: 'Active'
  },
  {
    name: 'IQF Tomato',
    category: 'IQF Vegetables',
    description: 'Diced tomatoes, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/tomato.png',
    status: 'Active'
  },
  {
    name: 'IQF 6mm French Fries',
    category: 'IQF Frozen',
    description: 'Premium 6mm straight cut French fries, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/6mmfrenchfries.png',
    status: 'Active'
  },
  {
    name: 'IQF 9mm French Fries',
    category: 'IQF Frozen',
    description: 'Premium 9mm straight cut French fries, individually quick frozen.',
    tab: 'iqf-frozen',
    shelfLife: '24 Months',
    image_url: './assets/images/products/iqf_frozen/9mmfrenchfries.png',
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
