const { Order, OrderItem, sequelize } = require('../models'); // Import models and sequelize for transactions
const mpesaService = require('../services/mpesaService');
const { v4: uuidv4 } = require('uuid'); // For unique order refs if needed beyond DB id

// --- IMPORTANT: Server-side Product Price Lookup ---
// In a real app, fetch current prices from your product database/service here.
// DO NOT trust prices sent from the frontend.
async function getProductPrice(productId) {
    // Placeholder: Replace with actual database lookup
    console.warn(`WARN: Using placeholder price for productId: ${productId}`);
    // Example: Simulate fetching price based on ID pattern
    if (productId === 'static-nike') return 2500.00;
    if (productId >= 1 && productId <= 22) return 1650.00; // Example range
    if (productId == 1) return 1500.00;
    if (productId == 2) return 1800.00;
    if (productId == 20) return 2800.00;
    if (productId == 60) return 3500.00;
     if (productId == 4989) return 1200.00;
     if (productId == 7087) return 300.00; // Example price for socks
    // Add more specific IDs or implement DB lookup
    return 1000.00; // Default fallback placeholder
}

exports.createOrder = async (req, res, next) => {
    const { cart, shipping, paymentMethod, mpesaPhone } = req.body;

    // --- Input Validation ---
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty or invalid.' });
    }
    if (!shipping || typeof shipping !== 'object') {
        return res.status(400).json({ message: 'Shipping details are missing or invalid.' });
    }
    if (!shipping.phone) { // Primary phone for order
        return res.status(400).json({ message: 'Shipping phone number is required.' });
    }
    if (paymentMethod !== 'mpesa') {
         
         return res.status(400).json({ message: 'Unsupported payment method.' });
    }
     if (!mpesaPhone || !/^\+?254\d{9}$/.test(mpesaPhone.trim())) {
        transaction.rollback(); // Rollback if already started and mpesaPhone is invalid

         return res.status(400).json({ message: 'Valid Kenyan M-Pesa phone number is required for payment (Expected +254xxxxxxxxx or or +2541XXXXXXXX).).' });
     }
    

    const transaction = await sequelize.transaction(); // Start DB transaction

    try {
        let calculatedTotal = 0;
        const orderItemsData = [];

        // --- Calculate Total & Prepare Order Items (SERVER-SIDE) ---
        for (const item of cart) {
            if (!item.id || !item.quantity || item.quantity <= 0) {
                throw new Error('Invalid cart item data.');
            }
            const currentPrice = await getProductPrice(item.id); // Fetch current price securely
            if (typeof currentPrice !== 'number') {
                 throw new Error(`Could not determine price for product ID: ${item.id}`);
            }

            calculatedTotal += currentPrice * item.quantity;
            orderItemsData.push({
                // orderId will be set after order creation
                productId: String(item.id), // Ensure string if model expects string
                productName: item.name || 'Unknown Product',
                quantity: item.quantity,
                price: currentPrice, // Use the server-verified price
                size: item.size,    // Include variants if sent
                color: item.color
            });
        }

        // --- Add Shipping Cost (Example) ---
        const SHIPPING_COST = 200.00; // Define your shipping logic/cost here
        calculatedTotal += SHIPPING_COST;

        // --- Create Order in Database ---
        const newOrder = await Order.create({
            customerPhone: shipping.phone, // Primary contact
            customerEmail: shipping.email,
            shippingAddress: shipping, // Store the whole shipping object
            totalAmount: calculatedTotal,
            status: 'PENDING',
            paymentMethod: paymentMethod,
             // mpesaCheckoutRequestID will be added after STK push attempt
        }, { transaction });

        // --- Create Order Items in Database ---
        // Add orderId to each item and bulk create
        const itemsToCreate = orderItemsData.map(item => ({ ...item, orderId: newOrder.id }));
        await OrderItem.bulkCreate(itemsToCreate, { transaction });

        console.log(`Order ${newOrder.id} created in DB with total: ${calculatedTotal}`);

        // --- Initiate M-Pesa STK Push ---
        if (paymentMethod === 'mpesa') {
            console.log(`Initiating STK for Order ${newOrder.id}, Amount: ${calculatedTotal}, Phone: ${mpesaPhone}`);
        const stkResult = await mpesaService.initiateSTKPush({
            amount: calculatedTotal,
            phoneNumber: mpesaPhone.trim(),
            orderId: newOrder.id // Pass the DB Order ID as AccountReference
        });

        // --- Update Order with CheckoutRequestID ---
        if (stkResult.success && stkResult.checkoutRequestID) {
            newOrder.mpesaCheckoutRequestID = stkResult.checkoutRequestID;
            await newOrder.save({ transaction });
            console.log(`Order ${newOrder.id} updated with CheckoutRequestID: ${stkResult.checkoutRequestID}`);
        } else {
             // Even if STK initiation fails, we still created the order (status PENDING)
             // Log the failure reason from stkResult if available
             console.error(`STK Push initiation seemed to fail for Order ${newOrder.id}. STK Result:`, stkResult);
             // You might want to update order status to 'PAYMENT_INIT_FAILED' here
             // Throwing error here will rollback DB changes, which might not be desired
             // Let's commit the order but return an indication of STK failure
             await transaction.commit(); // Commit the PENDING order
             return res.status(500).json({
                 message: `Order created (ID: ${newOrder.id}) but failed to initiate M-Pesa prompt. Please try paying again later or contact support.`,
                 error: stkResult.responseDescription || 'Unknown STK initiation error',
                 orderId: newOrder.id // Still return orderId
             });
        }

        // --- Commit Database Transaction ---
        await transaction.commit();

        // --- Send Response to Frontend ---
         // IMPORTANT: Only send back necessary info. Do NOT send secrets.
        res.status(201).json({
            success: true,
            message: 'Order created successfully. Please check your phone for M-Pesa prompt.',
            orderId: newOrder.id,
            mpesaCheckoutRequestId: stkResult.checkoutRequestID // Send this back
        });

    }  } catch (error) {
    await transaction.rollback(); // Rollback DB changes on error
    console.error('Error creating order:', error);
    next(error); // Pass to error-handling middleware
  }
}; // 
