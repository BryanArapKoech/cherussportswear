document.addEventListener('DOMContentLoaded', function() {
    // --- Get all DOM Elements ---
    const BACKEND_URL = 'http://localhost:3000';
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

    placeOrderBtn.disabled = true;
    placeOrderBtnSpinner.style.display = 'inline-block';
    paymentError.style.display = 'none';

    const orderData = {
        cart: cart,
        shipping: shippingDetails,
        paymentMethod: 'mpesa',
        mpesaPhone: mpesaPhone
    };
    
    let response; // Define response here to access it in the catch block
    try {
        response = await fetch(`${BACKEND_URL}/api/orders/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (!response.ok) {
            // This makes sure that even if the server returns a 4xx or 5xx error,
            // we treat it as an error and jump to the catch block.
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        // --- SUCCESS ---
        localStorage.removeItem('shoppingCart');
        localStorage.removeItem('shippingDetails');
        updateCartBadge();
        window.location.href = `thank-you.html?orderId=${result.orderId}&method=mpesa`;

    } catch (error) {
        // Check if the error is from a 401 Unauthorized response
        if (response && response.status === 401) {
            localStorage.removeItem('authToken'); // Clear the expired token
            localStorage.removeItem('shippingDetails'); // Also clear stale data
            
            // Inform the user and redirect to the login page
            alert('Your session has expired. Please log in again to continue.');
            window.location.href = 'login.html';
        } else {
            // Handle all other errors (network issues, validation errors, etc.)
            paymentError.textContent = error.message;
            paymentError.style.display = 'block';
            placeOrderBtn.disabled = false;
            placeOrderBtnSpinner.style.display = 'none';
        }
    }
});

    // --- Initial Page Load ---
    renderPage();
});