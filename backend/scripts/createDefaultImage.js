/* eslint-env node */
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDefaultImage = async () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const defaultImagePath = path.join(uploadsDir, 'default-product.png');
  
  try {
    // Ensure uploads directory exists
    await fs.ensureDir(uploadsDir);
    
    // Create a simple colored square as default image
    const width = 800;
    const height = 600;
    
    // Create SVG content
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
        <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="#9ca3af">
          No Image
        </text>
        <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
          Default Product Image
        </text>
      </svg>
    `;
    
    // Convert SVG to PNG using Sharp
    await sharp(Buffer.from(svgContent))
      .png()
      .toFile(defaultImagePath);
    
    console.log('✅ Default product image created successfully at:', defaultImagePath);
    
  } catch (error) {
    console.error('❌ Error creating default image:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultImage();
}

export default createDefaultImage; 