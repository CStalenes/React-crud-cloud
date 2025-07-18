/* eslint-env node */
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from './errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError('Only image files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware to process uploaded image
export const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Generate unique filename
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Add image path to request
    req.imageUrl = `/uploads/${filename}`;
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(new ApiError('Error processing image', 500));
  }
};

// Middleware to delete old image when updating
export const deleteOldImage = async (req, res, next) => {
  if (!req.file || !req.product) {
    return next();
  }

  try {
    const oldImagePath = req.product.image;
    if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', oldImagePath);
      await fs.remove(fullPath);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
    // Continue even if deletion fails
  }
  
  next();
};

// Error handler for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image size must be less than 5MB'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Please upload only one image'
      });
    }
  }
  
  next(error);
};

export const uploadSingle = upload.single('image'); 