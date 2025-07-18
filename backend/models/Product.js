import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name is required'
      },
      len: {
        args: [2, 255],
        msg: 'Product name must be between 2 and 255 characters'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Quantity must be an integer'
      },
      min: {
        args: [0],
        msg: 'Quantity must be a positive number'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      },
      min: {
        args: [0],
        msg: 'Price must be a positive number'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '/uploads/default-product.png',
    validate: {
      notEmpty: {
        msg: 'Image path is required'
      }
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance methods
Product.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Convert id to _id for frontend compatibility
  values._id = values.id;
  delete values.id;
  return values;
};

export default Product; 