/* eslint-env node */
import { ValidationError, DatabaseError } from 'sequelize';

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Error:', err);

  // Sequelize Validation Error
  if (err instanceof ValidationError) {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors
    });
  }

  // Sequelize Database Error
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      error: 'Database Error',
      message: 'A database error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Custom API Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name || 'API Error',
      message: err.message
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Please provide a valid token'
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Custom error class
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 