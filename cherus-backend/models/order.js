'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderItem, { // Order has many OrderItems
        foreignKey: 'orderId',
        as: 'items', // Alias to access items via order.items
        onDelete: 'CASCADE' // Delete items if order is deleted
      });
    }
  }
  Order.init({
    // customerName: DataTypes.STRING, // No need, get from shipping JSON
    customerPhone: { // Store the primary phone used for order
         type: DataTypes.STRING,
         allowNull: false,
    },
    customerEmail: DataTypes.STRING, // Optional but good for confirmation
    shippingAddress: { // Store structured shipping details
        type: DataTypes.JSON,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2), // Adjust precision as needed
        allowNull: false,
    },
    status: { // e.g., PENDING, PAID, FAILED, SHIPPED, DELIVERED, CANCELLED
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PENDING',
    },
    paymentMethod: { // e.g., 'mpesa', 'card', 'paypal'
         type: DataTypes.STRING,
         allowNull: false,
    },
    mpesaCheckoutRequestID: { // To link M-Pesa callback to the order
         type: DataTypes.STRING,
         unique: true, // Ensure uniqueness
         allowNull: true, // Null until STK push is initiated
    },
    mpesaReceiptNumber: { // Store the M-Pesa transaction code on success
         type: DataTypes.STRING,
         allowNull: true,
    },
    // Add other fields like shippingCost, discountAmount etc. if needed
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};