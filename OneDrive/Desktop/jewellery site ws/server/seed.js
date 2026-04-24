import connectDB from './db/connection.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

await connectDB();

const count = await Product.countDocuments();

const seedProducts = [
  { name: 'Royal Gold Ring', weight: 5.2, making_charges: 3500, category: 'Rings', image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a44ca?w=400&h=500&fit=crop', description: 'Elegant 22K gold ring with intricate craftsmanship.' },
  { name: 'Eternal Necklace', weight: 12.5, making_charges: 8500, category: 'Necklaces', image_url: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1515562149417-8b8c2b0c5b3c?w=400&h=500&fit=crop', description: 'Timeless necklace for every occasion.' },
  { name: 'Dewdrop Earrings', weight: 3.8, making_charges: 2200, category: 'Earrings', image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9abac038?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1617038224557-69d61629fd8e?w=400&h=500&fit=crop', description: 'Delicate dewdrop-shaped gold earrings.' },
  { name: 'Classic Bracelet', weight: 8.0, making_charges: 4800, category: 'Bracelets', image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220e?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1573408301185-9146fe261cdc?w=400&h=500&fit=crop', description: 'Sleek bracelet with a modern touch.' },
  { name: 'Mystic Pendant', weight: 4.5, making_charges: 3000, category: 'Pendants', image_url: 'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop', description: 'Enchanting pendant with mystical design.' },
  { name: 'Wedding Band', weight: 6.0, making_charges: 4000, category: 'Rings', image_url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=500&fit=crop', hover_image_url: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=400&h=500&fit=crop', description: 'Classic wedding band for your special day.' },
];

if (count === 0) {
  await Product.insertMany(seedProducts);
  console.log('Seeded 6 products');
} else {
  for (const sp of seedProducts) {
    await Product.updateOne(
      { name: sp.name },
      { $set: sp }
    );
  }
  console.log('Updated existing products with fresh images');
}
process.exit(0);
