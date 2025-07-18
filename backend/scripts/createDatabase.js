/* eslint-env node */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'react_crud_db'}\``);
    console.log(`✅ Database '${process.env.DB_NAME || 'react_crud_db'}' created successfully.`);
    
    // Grant privileges (optional)
    await connection.execute(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME || 'react_crud_db'}\`.* TO '${process.env.DB_USER || 'root'}'@'localhost'`);
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted successfully.');
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
};

createDatabase(); 