'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, { // OrderItem belongs to an Order
        foreignKey: 'orderId',
        as: 'order' // Alias to access order via item.order
      });
    }
  }
  OrderItem.init({
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { // Define foreign key constraint
            model: 'Orders', // Note: Plural table name by default
            key: 'id'
        }
    },
    productId: { // ID from your product catalog (could be string or integer)
        type: DataTypes.STRING,
        allowNull: false,
    },
    productName: { // Store name at time of order
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: { // Store price per item at time of order
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // Store selected size/color if applicable
    size: DataTypes.STRING,
    color: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};