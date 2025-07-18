/* eslint-env node */
import { sequelize } from '../config/database.js';
import Product from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Laptop Dell XPS 13',
    quantity: 15,
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
  },
  {
    name: 'iPhone 14 Pro',
    quantity: 25,
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2044&q=80'
  },
  {
    name: 'Samsung Galaxy Watch',
    quantity: 30,
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80'
  },
  {
    name: 'Sony WH-1000XM4 Headphones',
    quantity: 20,
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    name: 'iPad Pro 12.9"',
    quantity: 12,
    price: 1099.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2086&q=80'
  },
  {
    name: 'Canon EOS R5 Camera',
    quantity: 8,
    price: 3899.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    name: 'Nintendo Switch OLED',
    quantity: 18,
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    name: 'MacBook Pro 16"',
    quantity: 10,
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized.');

    // Insert sample products
    await Product.bulkCreate(sampleProducts);
    console.log('✅ Sample products inserted successfully.');

    console.log(`📊 Database seeded with ${sampleProducts.length} products.`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedDatabase(); 