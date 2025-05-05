'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    originalPrice: DataTypes.DECIMAL,
    category: DataTypes.STRING,
    subcategory: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    reviews: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    colors: DataTypes.JSON,
    sizes: DataTypes.JSON,
    isFeatured: DataTypes.BOOLEAN,
    dateAdded: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};