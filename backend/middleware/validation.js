import Joi from 'joi';

// Product validation schema
export const productSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 255 characters',
      'any.required': 'Product name is required'
    }),
  
  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be a positive number',
      'any.required': 'Quantity is required'
    }),
  
  price: Joi.number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),
  
  image: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Image cannot be empty'
    })
});

// Product update validation schema (all fields optional)
export const productUpdateSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.empty': 'Product name cannot be empty',
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 255 characters'
    }),
  
  quantity: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be a positive number'
    }),
  
  price: Joi.number()
    .precision(2)
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be a positive number'
    }),
  
  image: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Image cannot be empty'
    })
});

// Validation middleware
export const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors
    });
  }
  
  next();
};

export const validateProductUpdate = (req, res, next) => {
  const { error } = productUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors
    });
  }
  
  next();
};

// ID validation middleware
export const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Please provide a valid product ID'
    });
  }
  
  next();
}; 