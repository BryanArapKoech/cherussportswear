const { Order } = require('../models'); // Import Order model

// Controller for handling the M-Pesa STK Push Callback
exports.handleStkCallback = async (req, res, next) => {
    console.log('-------------------- M-Pesa STK Callback Received --------------------');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // Extract the main callback data
    const callbackData = req.body.Body?.stkCallback;

    if (!callbackData) {
        console.error('Invalid callback format received.');
         // Acknowledge receipt to M-Pesa even if format is bad
         return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const merchantRequestID = callbackData.MerchantRequestID;
    const checkoutRequestID = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    console.log(`Callback for CheckoutRequestID: ${checkoutRequestID}, ResultCode: ${resultCode}, ResultDesc: ${resultDesc}`);

    // Find the corresponding order using CheckoutRequestID
    const order = await Order.findOne({ where: { mpesaCheckoutRequestID: checkoutRequestID } });

    if (!order) {
        console.error(`Order not found for CheckoutRequestID: ${checkoutRequestID}`);
         // Acknowledge receipt to M-Pesa
         return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Check if order is already processed to prevent duplicate updates
    if (order.status !== 'PENDING' && order.status !== 'PAYMENT_INIT_FAILED') { // Or any status indicating it shouldn't be updated by callback
        console.warn(`Order ${order.id} status is already '${order.status}'. Ignoring duplicate callback.`);
         return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    try {
        if (resultCode === 0) {
            // --- Payment Successful ---
            console.log(`Payment successful for Order ${order.id}`);

            const metadata = callbackData.CallbackMetadata?.Item;
            let amountPaid = null;
            let mpesaReceipt = null;
            let transactionDate = null; // Safaricom uses YYYYMMDDHHmmss
            let phoneNumber = null;

            if (Array.isArray(metadata)) {
                amountPaid = metadata.find(item => item.Name === 'Amount')?.Value;
                mpesaReceipt = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
                transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
                phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
            }

            console.log(`  Amount Paid: ${amountPaid}, M-Pesa Receipt: ${mpesaReceipt}, Date: ${transactionDate}, Phone: ${phoneNumber}`);

            // --- Validation (CRUCIAL) ---
            // 1. Validate Amount: Convert DB amount to number for comparison
             const orderTotal = parseFloat(order.totalAmount);
             const paidAmount = parseFloat(amountPaid);

             if (isNaN(orderTotal) || isNaN(paidAmount) || paidAmount < orderTotal) {
                console.error(`Amount mismatch for Order ${order.id}. Expected >= ${orderTotal}, Received: ${paidAmount}`);
                // Decide how to handle amount mismatch: Maybe set status 'AMOUNT_MISMATCH' or 'UNDERPAID'
                 order.status = 'AMOUNT_MISMATCH';
                 order.mpesaReceiptNumber = mpesaReceipt || 'N/A'; // Store receipt anyway
                 // You might store the paid amount in a separate field
             } else {
                // Amount is valid or overpaid (handle overpayment if necessary)
                 order.status = 'PAID';
                 order.mpesaReceiptNumber = mpesaReceipt;
                 // You could store transactionDate too if needed
             }

            await order.save();
            console.log(`Order ${order.id} status updated to '${order.status}'`);

            // TODO: Trigger other post-payment actions (e.g., send confirmation email, notify fulfillment)

        } else {
            // --- Payment Failed or Cancelled ---
            console.log(`Payment failed/cancelled for Order ${order.id}. ResultCode: ${resultCode}, Desc: ${resultDesc}`);
            order.status = 'FAILED'; // Or specific status based on resultCode
            // Optionally store resultDesc in a separate field
            await order.save();
            console.log(`Order ${order.id} status updated to 'FAILED'`);
        }

        // --- Acknowledge Callback to M-Pesa ---
        // You MUST send a success response back to the M-Pesa API quickly.
        res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

    } catch (error) {
        console.error(`Error processing callback for Order ${order.id}:`, error);
         // Still acknowledge M-Pesa, but log the internal error
         res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
         // Consider adding internal alerting for processing failures
         next(error); // Pass to error handler for logging, etc.
    }
};

// Optional: Controller for Querying Status (if needed)
exports.queryStkStatus = async (req, res, next) => {
    // Implementation would involve calling an mpesaService.queryTransactionStatus function
    // and returning the result. Needs CheckoutRequestID.
     res.status(501).json({ message: 'Status query not implemented yet.' });
};