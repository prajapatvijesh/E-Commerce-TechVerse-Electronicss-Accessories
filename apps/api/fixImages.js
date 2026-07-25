const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productUpdates = [
  { name: 'Oura Ring Gen3', newImage: 'https://images.unsplash.com/photo-1599643478524-fb666453630b?q=80&w=800' },
  { name: 'DualSense Wireless Controller', newImage: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?q=80&w=800' },
  { name: 'Razer DeathAdder V3', newImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?q=80&w=800' },
  { name: 'Logitech MX Master 3S', newImage: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=800' }
];

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    for (const update of productUpdates) {
      await collection.updateMany(
        { name: update.name },
        { $set: { "images.0.url": update.newImage } }
      );
      console.log(`Updated images for ${update.name}`);
    }

    console.log('Images fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateImages();
