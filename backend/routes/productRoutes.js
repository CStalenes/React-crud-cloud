import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  deleteMultipleProducts
} from '../controllers/productController.js';
import {
  validateProduct,
  validateProductUpdate,
  validateId
} from '../middleware/validation.js';
import {
  uploadSingle,
  processImage,
  deleteOldImage,
  handleUploadError
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Routes
router.route('/')
  .get(getProducts)                    // GET /api/products
  .post(uploadSingle, handleUploadError, processImage, validateProduct, createProduct); // POST /api/products

router.route('/stats')
  .get(getProductStats);               // GET /api/products/stats

router.route('/bulk-delete')
  .delete(deleteMultipleProducts);     // DELETE /api/products/bulk-delete

router.route('/:id')
  .get(validateId, getProduct)         // GET /api/products/:id
  .put(validateId, uploadSingle, handleUploadError, deleteOldImage, processImage, validateProductUpdate, updateProduct)  // PUT /api/products/:id
  .delete(validateId, deleteProduct);  // DELETE /api/products/:id

export default router; 