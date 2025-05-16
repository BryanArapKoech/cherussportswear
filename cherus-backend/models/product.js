'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(10, 2), // e.g., 10 digits total, 2 after decimal
      allowNull: false,
    },
    originalPrice: DataTypes.DECIMAL(10, 2),
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    rating: DataTypes.FLOAT, // Or DataTypes.DECIMAL(2,1) for more control
    reviews: DataTypes.INTEGER,
    colors: DataTypes.JSON, // Stores array of objects or strings
    sizes: DataTypes.JSON,  // Stores array of strings
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};