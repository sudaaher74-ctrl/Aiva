const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0";

const updates = [
  { oldName: 'IQF Totapuri Mango', newName: 'Totapuri Mango Dices', imageUrl: '/assets/images/products/iqf_fruits/totapurimangodices.png' },
  { oldName: 'IQF Banana', newName: 'Banana Dices', imageUrl: '/assets/images/products/iqf_fruits/bananadices.png' },
  { oldName: 'IQF Guava', newName: 'Guava Dices', imageUrl: '/assets/images/products/iqf_fruits/guavadices.png' }
];

async function updateDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  
  const db = mongoose.connection.db;
  
  for (const u of updates) {
    const result = await db.collection('products').updateOne(
      { name: u.oldName },
      { $set: { name: u.newName, image_url: u.imageUrl } }
    );
    console.log(`Updated ${u.oldName} to ${u.newName}: ${result.modifiedCount} documents modified`);
  }
  
  await mongoose.disconnect();
  console.log('Done');
}

updateDb().catch(console.error);
