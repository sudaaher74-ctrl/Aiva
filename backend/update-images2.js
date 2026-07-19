const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0";

const productsData = [
  { name: 'Mango Concentrate', image_url: '/assets/images/products/pulp/totapuriconcentrate.png' },
  { name: 'Guava Concentrate', image_url: '/assets/images/products/pulp/whiteguavaconcentrate.png' },
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
