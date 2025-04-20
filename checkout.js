document.addEventListener('DOMContentLoaded', function() {
    // --- Elements ---
    const form = document.getElementById('checkoutForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnSpinner = placeOrderBtn.querySelector('.spinner-border');
    const paymentOptionsDiv = document.getElementById('paymentOptions');
    const mpesaDetailsDiv = document.getElementById('mpesaDetails');
    const cardDetailsDiv = document.getElementById('cardDetails');
    const paypalDetailsDiv = document.getElementById('paypalDetails');
    const mpesaPhoneInput = document.getElementById('mpesaPhone');
    const paymentErrorDiv = document.getElementById('paymentError');

    // Summary Elements
    const summaryItemsList = document.getElementById('summaryItemsList');
    const summaryCartCount = document.getElementById('summaryCartCount');
    const summarySubtotalEl = document.getElementById('summarySubtotal');
    const summaryShippingEl = document.getElementById('summaryShipping');
    const summaryTotalEl = document.getElementById('summaryTotal');

    // --- Configuration (Replace with your actual keys/URLs) ---
    const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'; // Replace with your Stripe Test Key
    const BACKEND_URL = 'http://localhost:3000'; // Example URL for your backend server

    // --- Initialize Stripe ---
    let stripe, cardElement;
    try {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        const elements = stripe.elements();
        const style = { // Optional: Style the Stripe Element
            base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#fa755a', iconColor: '#fa755a' }
        };
        cardElement = elements.create('card', { style: style });
        cardElement.mount('#card-element'); // Mount Stripe element to the div

        // Handle real-time validation errors from the card Element.
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    } catch (error) {
        console.error("Error initializing Stripe:", error);
        // Handle error, maybe disable card payment option
        const cardOption = document.getElementById('card');
        if(cardOption) cardOption.disabled = true;
        const cardLabel = document.querySelector('label[for="card"]');
         if(cardLabel) cardLabel.innerHTML += ' <span class="text-danger small">(Unavailable)</span>';
    }

    // --- Initialize PayPal ---
    function initializePayPalButtons(totalAmount) {
         if (typeof paypal === 'undefined') {
             console.error("PayPal SDK not loaded");
             return;
         }
        // Clear previous buttons if re-initializing
         document.getElementById('paypal-button-container').innerHTML = '';

         paypal.Buttons({
             createOrder: function(data, actions) {
                 console.log("Creating PayPal order for amount:", totalAmount);
                 // **BACKEND CALL:** Ideally, call your backend here to create the PayPal order
                 // and return the order ID. The backend keeps the transaction secure.
                 // return fetch(`${BACKEND_URL}/api/paypal/create-order`, {
                 //    method: 'POST',
                 //    headers: { 'Content-Type': 'application/json' },
                 //    body: JSON.stringify({ cart: getCart(), total: totalAmount }) // Send cart/total
                 // })
                 // .then(res => res.json())
                 // .then(data => data.orderID); // Your backend returns the ID

                 // **Frontend Simulation (Insecure for Production):**
                 return actions.order.create({
                     purchase_units: [{
                         amount: {
                             value: totalAmount.toFixed(2), // Use the calculated total
                             currency_code: 'KES'
                         }
                     }]
                 });
             },
             onApprove: function(data, actions) {
                 console.log("PayPal order approved:", data);
                 // **BACKEND CALL:** Call your backend to capture/finalize the payment.
                 // Send data.orderID to your backend for verification and order completion.
                 // return fetch(`${BACKEND_URL}/api/paypal/capture-order`, {
                 //    method: 'POST',
                 //    headers: { 'Content-Type': 'application/json' },
                 //    body: JSON.stringify({ orderID: data.orderID })
                 // })
                 // .then(res => res.json())
                 // .then(orderData => {
                 //      console.log('Capture result', orderData);
                 //      handleServerResponse({ success: true, orderId: orderData.id /* or similar */ }); // Handle backend response
                 // })
                 // .catch(err => handlePaymentError("Failed to capture PayPal payment."));

                 // **Frontend Simulation:**
                 return actions.order.capture().then(function(details) {
                     console.log('PayPal capture details:', details);
                     // Simulate successful backend processing
                     handleServerResponse({ success: true, orderId: details.id, paymentMethod: 'paypal' });
                 });
             },
             onError: function(err) {
                 console.error("PayPal Button Error:", err);
                 handlePaymentError("An error occurred with PayPal.");
             }
         }).render('#paypal-button-container').catch(err => {
             console.error("Failed to render PayPal buttons:", err);
              handlePaymentError("Could not display PayPal option.");
         });
    }


    // --- Load Order Summary ---
    function loadOrderSummary() {
        const cart = getCart();
        summaryItemsList.innerHTML = ''; // Clear loading
        let subtotal = 0;

        if (cart.length === 0) {
            // Redirect back to cart or show message if cart is empty on checkout
            window.location.href = 'cart.html';
            return;
        }

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name} <span class="text-muted">(${item.quantity})</span></h6>
                    <small class="text-muted">${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}</small>
                </div>
                <span class="text-muted">${formatPrice(item.price * item.quantity)}</span>
            `;
            summaryItemsList.appendChild(li);
        });

        // Example: Fixed shipping cost
        const shippingCost = 200.00;
        const total = subtotal + shippingCost;

        summaryCartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        summarySubtotalEl.textContent = formatPrice(subtotal);
        summaryShippingEl.textContent = formatPrice(shippingCost);
        summaryTotalEl.textContent = formatPrice(total);

        // Initialize/Update PayPal buttons with the correct total
        initializePayPalButtons(total);
    }

    // --- Payment Method Display Logic ---
    paymentOptionsDiv.addEventListener('change', (event) => {
        if (event.target.name === 'paymentMethod') {
            mpesaDetailsDiv.style.display = event.target.value === 'mpesa' ? 'block' : 'none';
            cardDetailsDiv.style.display = event.target.value === 'card' ? 'block' : 'none';
            paypalDetailsDiv.style.display = event.target.value === 'paypal' ? 'block' : 'none';

            // Set required attribute for M-Pesa phone only when visible
            mpesaPhoneInput.required = (event.target.value === 'mpesa');
        }
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Basic Bootstrap validation
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated'); // Show validation styles even if initially valid

        setLoading(true); // Show spinner, disable button
        hidePaymentError();

        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const cart = getCart();
        const shippingDetails = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            county: document.getElementById('county').value,
            zip: document.getElementById('zip').value,
        };

        console.log("Placing order with method:", selectedPaymentMethod);

        // ** THIS IS WHERE BACKEND INTEGRATION HAPPENS **
        try {
            const response = await fetch(`${BACKEND_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart: cart,
                    shipping: shippingDetails,
                    paymentMethod: selectedPaymentMethod,
                    mpesaPhone: selectedPaymentMethod === 'mpesa' ? mpesaPhoneInput.value : null
                })
            });

            const orderData = await response.json();

            if (!response.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Backend should return necessary info based on payment method
            // e.g., { success: true, orderId: '123', clientSecret: 'pi_xxx_secret_xxx' } for Stripe
            // e.g., { success: true, orderId: '123', mpesaCheckoutRequestId: 'ws_CO_xxx' } for M-Pesa

            console.log("Order created on backend:", orderData);

            // --- Handle Payment Based on Method ---
            if (selectedPaymentMethod === 'card' && orderData.clientSecret) {
                 // Use Stripe.js to confirm the card payment
                 const { paymentIntent, error } = await stripe.confirmCardPayment(
                     orderData.clientSecret, // The PaymentIntent client secret from your backend
                     {
                         payment_method: {
                             card: cardElement,
                             billing_details: {
                                 name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                                 email: shippingDetails.email,
                                 phone: shippingDetails.phone,
                                 address: { // Optional but recommended
                                     line1: shippingDetails.address,
                                     line2: shippingDetails.address2,
                                     city: shippingDetails.city,
                                     state: shippingDetails.county, // Assuming county maps to state
                                     postal_code: shippingDetails.zip,
                                     country: 'KE', // Assuming Kenya
                                 },
                             },
                         },
                     }
                 );

                 if (error) {
                     console.error("Stripe card confirmation error:", error);
                     handlePaymentError(error.message || "Card payment failed. Please try again.");
                     setLoading(false);
                 } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                     console.log("Stripe PaymentIntent successful:", paymentIntent);
                     // **BACKEND CALL (Optional but good):** Notify backend payment is complete
                     // fetch(`${BACKEND_URL}/api/confirm-order/${orderData.orderId}`, { method: 'POST' });
                     handleServerResponse({ success: true, orderId: orderData.orderId, paymentMethod: 'card' });
                 } else {
                      console.warn("Stripe payment status:", paymentIntent ? paymentIntent.status : 'unknown');
                      handlePaymentError("Payment processing. We'll confirm via email or contact support.");
                      setLoading(false); // Keep user informed
                 }

            } else if (selectedPaymentMethod === 'mpesa') {
                // M-Pesa STK push was likely initiated by the backend during /api/create-order
                console.log("M-Pesa STK Push initiated. CheckoutRequestID:", orderData.mpesaCheckoutRequestId);
                // Show message to user: "Please check your phone to enter your M-Pesa PIN..."
                // You might poll your backend to check the M-Pesa transaction status or rely on webhooks
                 // For simulation, we'll just proceed to success page after a delay
                 showToast("Please check your phone and enter your M-Pesa PIN."); // Use your existing toast function
                 setTimeout(() => {
                     // In reality, you wait for backend confirmation (webhook/polling)
                     handleServerResponse({ success: true, orderId: orderData.orderId, paymentMethod: 'mpesa' });
                 }, 10000); // Simulate 10 second wait for user PIN input

            } else if (selectedPaymentMethod === 'paypal') {
                // PayPal flow is handled by the SDK's onApprove function.
                // The fetch calls inside initializePayPalButtons handle backend interaction.
                // If we reach here for PayPal, it means the user clicked "Place Order" *before* completing
                // the PayPal popup, which shouldn't ideally happen if the button is inside the form.
                // Or, if PayPal button is separate, this logic might not be needed here.
                 console.log("Proceeding with PayPal - user will complete via popup.");
                 // No immediate action needed here, SDK handles it. Button click triggered SDK.
                 // setLoading(false); // Allow user to interact with PayPal popup

            } else {
                // Handle other payment methods or unexpected scenarios
                 handlePaymentError("Selected payment method not fully configured.");
                 setLoading(false);
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            handlePaymentError(error.message || "An error occurred during checkout. Please try again.");
            setLoading(false);
        }
    });

    // --- Helper Functions ---
    function formatPrice(price) {
        return `Kshs. ${price.toFixed(2)}`;
    }

    function setLoading(isLoading) {
        if (isLoading) {
            placeOrderBtn.disabled = true;
            placeOrderBtnSpinner.style.display = 'inline-block';
            placeOrderBtn.querySelector('span:not(.spinner-border)').textContent = ' Processing...'; // Change text
        } else {
            placeOrderBtn.disabled = false;
            placeOrderBtnSpinner.style.display = 'none';
            placeOrderBtn.querySelector('span:not(.spinner-border)').textContent = 'Place Order'; // Restore text
        }
    }

    function handlePaymentError(message) {
        paymentErrorDiv.textContent = message;
        paymentErrorDiv.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight); // Scroll to show error
    }
    function hidePaymentError() {
        paymentErrorDiv.style.display = 'none';
    }

    function handleServerResponse(data) {
         console.log("Handling server response:", data);
        if (data.success) {
            // Payment successful!
            clearCart(); // Clear localStorage cart
            updateCartBadge(); // Update header badge (should show 0)
            // Redirect to a thank you page, passing order ID
            window.location.href = `thank-you.html?orderId=${data.orderId}&method=${data.paymentMethod}`;
        } else {
            // Handle payment failure specific message if available
            handlePaymentError(data.message || "Payment failed. Please check your details or try another method.");
            setLoading(false);
        }
    }

     function clearCart() {
        localStorage.removeItem('shoppingCart');
    }

    // --- Initial Load ---
    loadOrderSummary();
    // Trigger change event manually to show/hide initial payment details section
    const initialPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if(initialPaymentMethod) {
        initialPaymentMethod.dispatchEvent(new Event('change', { bubbles: true }));
    }
    updateCartBadge(); // Update header badge on checkout load

});