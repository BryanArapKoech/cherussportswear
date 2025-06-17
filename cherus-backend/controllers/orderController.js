const { Order, OrderItem, sequelize, Product } = require('../models');
const mpesaService = require('../services/mpesaService');

async function getProductPrice(productId) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error(`Product with ID ${productId} not found.`);
    return parseFloat(product.price);
}

exports.createOrder = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const { cart, shipping, paymentMethod, mpesaPhone } = req.body;

    // --- Refined Input Validation ---
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty or invalid.' });
    }
    if (!shipping || typeof shipping !== 'object' || !shipping.phone) {
        return res.status(400).json({ message: 'Valid shipping details are required.' });
    }
    if (paymentMethod !== 'mpesa') {
        return res.status(400).json({ message: 'Unsupported payment method.' });
    }
   // controllers/orderController.js
    const trimmedMpesaPhone = typeof mpesaPhone === 'string' ? mpesaPhone.trim() : '';
    // This improved regex allows an optional '+' at the start but still checks for the 254 format.
    if (!trimmedMpesaPhone || !/^\+?254\d{9}$/.test(trimmedMpesaPhone)) {
    return res.status(400).json({ message: 'A valid M-Pesa phone number is required (e.g., +254... or 254...).' });
        }

    const transaction = await sequelize.transaction();

    try {
        let calculatedTotal = 0;
        const orderItemsData = [];

        for (const item of cart) {
            if (!item.id || !item.quantity || item.quantity <= 0) {
                throw new Error('Invalid cart item data.');
            }
            const currentPrice = await getProductPrice(item.id);
            if (typeof currentPrice !== 'number') {
                 throw new Error(`Could not determine price for product ID: ${item.id}`);
            }

            calculatedTotal += currentPrice * item.quantity;
            orderItemsData.push({
                productId: String(item.id),
                productName: item.name || 'Unknown Product',
                quantity: item.quantity,
                price: currentPrice,
                size: item.size,
                color: item.color
            });
        }

        const SHIPPING_COST = 200.00;
        calculatedTotal += SHIPPING_COST;

        const newOrder = await Order.create({
            userId: userId,
            customerPhone: shipping.phone,
            customerEmail: shipping.email,
            shippingAddress: shipping,
            totalAmount: calculatedTotal,
            status: 'PENDING',
            paymentMethod: paymentMethod,
        }, { transaction });

        const itemsToCreate = orderItemsData.map(item => ({ ...item, orderId: newOrder.id }));
        await OrderItem.bulkCreate(itemsToCreate, { transaction });

        console.log(`Order ${newOrder.id} created in DB with total: ${calculatedTotal}`);

        if (paymentMethod === 'mpesa') {
            console.log(`Initiating STK for Order ${newOrder.id}, Amount: ${calculatedTotal}, Phone: ${mpesaPhone}`);
            const stkResult = await mpesaService.initiateSTKPush({
                amount: calculatedTotal,
                phoneNumber: mpesaPhone.trim(),
                orderId: newOrder.id
            });

            if (stkResult.success && stkResult.checkoutRequestID) {
                newOrder.mpesaCheckoutRequestID = stkResult.checkoutRequestID;
                await newOrder.save({ transaction });
                console.log(`Order ${newOrder.id} updated with CheckoutRequestID: ${stkResult.checkoutRequestID}`);

                // --- SUCCESS PATH ---
                await transaction.commit();
                return res.status(201).json({
                    success: true,
                    message: 'Order created successfully. Please check your phone for M-Pesa prompt.',
                    orderId: newOrder.id,
                    mpesaCheckoutRequestId: stkResult.checkoutRequestID
                });

            } else {
                 // If STK Push fails, throw an error to trigger the rollback
                const stkError = stkResult.responseDescription || 'Unknown STK initiation error';
                throw new Error(`Failed to initiate M-Pesa prompt: ${stkError}`);
            }
        }

    } catch (error) {
        // This single catch block will now handle ALL failures
        await transaction.rollback();
        console.error('Error creating order:', error.message);
        // We call next() to pass the error to the global error handler
        next(error);
    }
};

exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id; // From verifyToken middleware

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }

        const order = await Order.findOne({
            where: {
                id: orderId,
                userId: userId // CRITICAL: Ensures users can only see their own orders.
            },
            attributes: ['id', 'status'] // Only select the fields we need.
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied.' });
        }
        
        console.log(`Status '${order.status}' for Order ID ${order.id} sent to user ${userId}`);

        res.status(200).json({
            orderId: order.id,
            status: order.status
        });

    } catch (error) {
        console.error('Get Order Status Error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};