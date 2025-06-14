document.addEventListener('DOMContentLoaded', function() {
    // --- Get all DOM Elements ---
    const shippingDetailsReview = document.getElementById('shippingDetailsReview');
    const summaryItemsList = document.getElementById('summaryItemsList');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');
    const paymentForm = document.getElementById('paymentForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const paymentError = document.getElementById('paymentError');
    const placeOrderBtnSpinner = document.getElementById('placeOrderBtnSpinner');
    const loaderOverlay = document.getElementById('loader-overlay');
    const paymentContent = document.getElementById('payment-content');

    // --- 1. Load data and validate session ---
    const token = localStorage.getItem('authToken');
    const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails'));
    const cart = getCart();

    if (!token) {
        alert("Authentication error. Redirecting to login.");
        window.location.href = 'login.html';
        return;
    }
    if (!shippingDetails) {
        alert("Shipping details not found. Please complete the shipping step.");
        window.location.href = 'shipping.html';
        return;
    }
    if (cart.length === 0) {
        alert("Your cart is empty.");
        window.location.href = 'index.html';
        return;
    }

    // --- 2. Render the page with the loaded data ---
    function renderPage() {
        // Render shipping details
        shippingDetailsReview.innerHTML = `
            <strong>${shippingDetails.firstName} ${shippingDetails.lastName}</strong><br>
            ${shippingDetails.address}, ${shippingDetails.city}<br>
            ${shippingDetails.email}<br>
            ${shippingDetails.phone}
        `;

        // Render order summary
        summaryItemsList.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <strong>${formatPrice(itemTotal)}</strong>
            `;
            summaryItemsList.appendChild(li);
        });

        const shippingCost = 200.00;
        const total = subtotal + shippingCost;
        
        summarySubtotal.textContent = formatPrice(subtotal);
        summaryShipping.textContent = formatPrice(shippingCost);
        summaryTotal.textContent = formatPrice(total);
    }
    
    // --- 3. Handle the final order submission ---
    paymentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const mpesaPhone = document.getElementById('mpesaPhone').value;
        if (!mpesaPhone) {
            paymentError.textContent = 'Please enter your M-Pesa phone number.';
            paymentError.style.display = 'block';
            return;
        }

        // Disable button and show spinner
        placeOrderBtn.disabled = true;
        placeOrderBtnSpinner.style.display = 'inline-block';
        paymentError.style.display = 'none';

        const orderData = {
            cart: cart,
            shipping: shippingDetails,
            paymentMethod: 'mpesa',
            mpesaPhone: mpesaPhone
        };
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // THE AUTHENTICATED API CALL
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) {
                // If API returns an error (like 401, 400, 500)
                throw new Error(result.message || 'An unknown error occurred.');
            }
            
            // --- SUCCESS ---
            // Clear cart and shipping details from storage
            localStorage.removeItem('shoppingCart');
            localStorage.removeItem('shippingDetails');
            updateCartBadge(); // Update badge to 0

        // Redirect to the thank-you page, passing the orderId and method as URL parameters
            window.location.href = `thank-you.html?orderId=${result.orderId}&method=mpesa`;
           

        } catch (error) {
            paymentError.textContent = error.message;
            paymentError.style.display = 'block';
            placeOrderBtn.disabled = false;
            placeOrderBtnSpinner.style.display = 'none';
        }
    });

    // --- Initial Page Load ---
    renderPage();
});