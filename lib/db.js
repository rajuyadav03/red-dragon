import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'reddragon';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Seed initial data if not exists
export async function seedDatabase() {
  const { db } = await connectToDatabase();
  
  // Check if data already exists
  const existingInfo = await db.collection('restaurantInfo').findOne({});
  if (existingInfo) return;

  // Create default admin
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await db.collection('admins').insertOne({
    id: 'admin-1',
    email: 'admin@reddragon.com',
    password: hashedPassword,
    createdAt: new Date()
  });

  // Create restaurant info
  await db.collection('restaurantInfo').insertOne({
    id: 'info-1',
    name: 'Red Dragon Chinese Restaurant',
    tagline: 'Best Chinese Food in Mira Road',
    phone: '+91 99458 71208',
    whatsapp: '+919945871208',
    address: 'Mira Road East, Mumbai',
    hours: '7 AM – 1 AM',
    zomato: 'https://www.zomato.com/mumbai/red-dragon-restaurant-mira-road',
    swiggy: 'https://www.swiggy.com/restaurants/red-dragon-mira-road',
    aboutText: 'Welcome to Red Dragon Chinese Restaurant, your premier destination for authentic Chinese cuisine in Mira Road. Since our establishment, we have been committed to bringing the finest flavors of China to your table. Our skilled chefs use only the freshest ingredients and traditional cooking techniques to create dishes that will transport you to the streets of Beijing.\n\nAt Red Dragon, we take pride in our signature momos, aromatic fried rice, and hand-pulled noodles. Every dish is prepared with love and dedication, ensuring an unforgettable dining experience. Whether you\'re craving a quick bite or a full family feast, we have something for everyone.\n\nOur restaurant maintains the highest standards of hygiene and quality. We source our ingredients daily from trusted suppliers, and our kitchen follows strict food safety protocols. Your health and satisfaction are our top priorities.\n\nJoin us at Red Dragon and experience the magic of authentic Chinese flavors. From our family to yours, we promise a meal you\'ll remember!',
    heroImage: 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg',
    updatedAt: new Date()
  });

  // Create categories
  const categories = [
    { id: 'cat-1', name: 'Starters', order: 1 },
    { id: 'cat-2', name: 'Momos', order: 2 },
    { id: 'cat-3', name: 'Fried Rice', order: 3 },
    { id: 'cat-4', name: 'Noodles', order: 4 },
    { id: 'cat-5', name: 'Main Course', order: 5 }
  ];
  await db.collection('categories').insertMany(categories);

  // Create dishes with featured flag
  const dishes = [
    { id: 'dish-1', name: 'Crispy Chilli Potato', price: 180, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600', category: 'cat-1', available: true, isFeatured: true, description: 'Crispy fried potato fingers tossed in spicy chilli sauce with bell peppers' },
    { id: 'dish-2', name: 'Veg Spring Rolls', price: 150, image: 'https://images.unsplash.com/photo-1548507200-ebdb56f6ba73?w=600', category: 'cat-1', available: true, isFeatured: false, description: 'Golden fried rolls stuffed with seasoned vegetables' },
    { id: 'dish-3', name: 'Chicken 65', price: 220, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600', category: 'cat-1', available: true, isFeatured: true, description: 'Spicy deep-fried chicken appetizer with curry leaves' },
    { id: 'dish-4', name: 'Steamed Veg Momos', price: 120, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', category: 'cat-2', available: true, isFeatured: true, description: 'Soft steamed dumplings filled with seasoned vegetables, served with red chutney' },
    { id: 'dish-5', name: 'Fried Chicken Momos', price: 150, image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600', category: 'cat-2', available: true, isFeatured: true, description: 'Crispy fried dumplings with juicy chicken filling' },
    { id: 'dish-6', name: 'Tandoori Momos', price: 180, image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600', category: 'cat-2', available: true, isFeatured: false, description: 'Char-grilled momos with aromatic tandoori spices' },
    { id: 'dish-7', name: 'Veg Fried Rice', price: 150, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', category: 'cat-3', available: true, isFeatured: false, description: 'Classic wok-tossed fried rice with mixed vegetables' },
    { id: 'dish-8', name: 'Chicken Fried Rice', price: 180, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600', category: 'cat-3', available: true, isFeatured: true, description: 'Fragrant fried rice with tender chicken pieces and egg' },
    { id: 'dish-9', name: 'Schezwan Fried Rice', price: 170, image: 'https://images.unsplash.com/photo-1596097635121-14b63a7c2d15?w=600', category: 'cat-3', available: true, isFeatured: false, description: 'Fiery Schezwan style fried rice with bold flavors' },
    { id: 'dish-10', name: 'Veg Hakka Noodles', price: 140, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600', category: 'cat-4', available: true, isFeatured: false, description: 'Stir-fried Hakka noodles with fresh vegetables' },
    { id: 'dish-11', name: 'Chicken Chow Mein', price: 180, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600', category: 'cat-4', available: true, isFeatured: true, description: 'Classic chow mein with tender chicken and crispy vegetables' },
    { id: 'dish-12', name: 'Singapore Noodles', price: 200, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600', category: 'cat-4', available: true, isFeatured: false, description: 'Spicy curry-flavored noodles with a kick' },
    { id: 'dish-13', name: 'Chicken Manchurian', price: 250, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600', category: 'cat-5', available: true, isFeatured: false, description: 'Indo-Chinese classic in rich manchurian gravy' },
    { id: 'dish-14', name: 'Chilli Chicken', price: 260, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600', category: 'cat-5', available: true, isFeatured: false, description: 'Spicy chicken with colorful bell peppers and onions' },
    { id: 'dish-15', name: 'Paneer Chilli', price: 220, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600', category: 'cat-5', available: true, isFeatured: false, description: 'Cottage cheese cubes in spicy Indo-Chinese chilli sauce' }
  ];
  await db.collection('dishes').insertMany(dishes);

  console.log('Database seeded successfully!');
}
