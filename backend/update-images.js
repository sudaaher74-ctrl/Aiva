const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0";

const productsData = [
  { name: 'Alphonso Mango Pulp', image_url: '/assets/images/products/pulp/alphansso.png' },
  { name: 'Totapuri Mango Pulp', image_url: '/assets/images/products/pulp/totapurimango.png' },
  { name: 'Kesar Mango Pulp', image_url: '/assets/images/products/pulp/kesarmango.png' },
  { name: 'Papaya Pulp', image_url: '/assets/images/products/pulp/papaya.png' },
  { name: 'Pink/White Guava Pulp', image_url: '/assets/images/products/pulp/pinkguava.png' },
  { name: 'Banana Pulp', image_url: '/assets/images/products/pulp/banana.png' },
  { name: 'Tomato Paste', image_url: '/assets/images/products/pulp/tomamtopaste.png' },
  { name: 'Totapuri Mango Concentrate', image_url: '/assets/images/products/pulp/totapuriconcentrate.png' },
  { name: 'White Guava Concentrate', image_url: '/assets/images/products/pulp/whiteguavaconcentrate.png' },
  { name: 'Banana Concentrate', image_url: '/assets/images/products/pulp/bananaconcentrate.png' },
  { name: 'Pink Guava Pulp', image_url: '/assets/images/products/pulp/pinkguava.png' }
];

async function updateDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  
  const db = mongoose.connection.db;
  
  for (const p of productsData) {
    const result = await db.collection('products').updateOne(
      { name: p.name },
      { $set: { image_url: p.image_url } }
    );
    console.log(`Updated ${p.name}: ${result.modifiedCount} documents`);
  }
  
  await mongoose.disconnect();
  console.log('Done');
}

updateDb().catch(console.error);
