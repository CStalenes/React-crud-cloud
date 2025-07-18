import Product from '../models/Product.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';

// Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, search = '', sortBy = 'created_at', order = 'DESC' } = req.query;
  
  const offset = (page - 1) * limit;
  const whereClause = search ? {
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } }
    ]
  } : {};

  const products = await Product.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, order.toUpperCase()]]
  });

  // For frontend compatibility, return simple array format
  res.status(200).json(products.rows);
});

// Get single product
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  
  // Return product data directly for frontend compatibility
  res.status(200).json(product);
});

// Create new product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, quantity, price } = req.body;
  
  // Use uploaded image or default placeholder
  const image = req.imageUrl || '/uploads/default-product.png';
  
  const product = await Product.create({
    name,
    quantity,
    price,
    image
  });
  
  // Return product data directly for frontend compatibility
  res.status(201).json(product);
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  
  // Store product reference for middleware
  req.product = product;
  
  // Use uploaded image if available
  if (req.imageUrl) {
    updateData.image = req.imageUrl;
  }
  
  await product.update(updateData);
  
  // Return updated product data directly for frontend compatibility
  res.status(200).json(product);
});

// Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const product = await Product.findByPk(id);
  
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  
  await product.destroy();
  
  res.status(200).json({
    message: 'Product deleted successfully'
  });
});

// Get product statistics
export const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.count();
  const totalValue = await Product.sum('price');
  const totalQuantity = await Product.sum('quantity');
  const averagePrice = await Product.findOne({
    attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']]
  });
  
  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalValue: totalValue || 0,
      totalQuantity: totalQuantity || 0,
      averagePrice: parseFloat(averagePrice?.dataValues?.avgPrice || 0).toFixed(2)
    }
  });
});

// Bulk delete products
export const deleteMultipleProducts = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError('Please provide an array of product IDs', 400);
  }
  
  const deletedCount = await Product.destroy({
    where: {
      id: {
        [Op.in]: ids
      }
    }
  });
  
  res.status(200).json({
    success: true,
    message: `${deletedCount} products deleted successfully`,
    deletedCount
  });
}); 