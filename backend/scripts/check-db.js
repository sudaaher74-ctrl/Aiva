const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  console.log(products.map(p => ({ name: p.name, image_url: p.image_url })));
  process.exit(0);
}
run();
