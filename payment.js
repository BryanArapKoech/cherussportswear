
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
    const loaderOverlay = document.getElementById('loader-overlay'); // Assuming this exists for loading
    
    // --- 1. Load data and validate session ---
    const token = localStorage.getItem('authToken');
    const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails'));
    const cart = getCart(); // Assumes getCart() is globally available from another script

    if (!token || !shippingDetails || cart.length === 0) {
        alert("There was an issue with your session or cart. Redirecting home.");
        window.location.href = 'index.html';
        return;
    }

    // --- 2. Render the page with the loaded data ---
    function renderPage() {
        shippingDetailsReview.innerHTML = `
            <strong>${shippingDetails.firstName} ${shippingDetails.lastName}</strong><br>
            ${shippingDetails.address}, ${shippingDetails.city}<br>
            ${shippingDetails.email}<br>
            ${shippingDetails.phone}
        `;

        let subtotal = 0;
        summaryItemsList.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between';
            li.innerHTML = `<span>${item.name} (x${item.quantity})</span><strong>${formatPrice(itemTotal)}</strong>`;
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
        if (loaderOverlay) loaderOverlay.style.display = 'flex'; // Show full page loader

        const orderData = {
            cart: cart,
            shipping: shippingDetails,
            paymentMethod: 'mpesa',
            mpesaPhone: mpesaPhone
        };
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/orders/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to create order.');
            
            // --- POLLING LOGIC---
            document.getElementById('payment-content').style.display = 'none';

        // Show and populate the polling status message
        const pollingContainer = document.getElementById('polling-status-container');
        pollingContainer.style.display = 'block';
        pollingContainer.innerHTML = `
            <div class="alert alert-info">
                <div class="spinner-border my-3" role="status"></div>
                <h4>STK Push Sent</h4>
                <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
                <p><em>This page will automatically update once the payment is confirmed.</em></p>
            </div>
        `;
        
        const orderId = result.orderId;
        const poller = setInterval(async () => {
            try {
                const statusResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    if (statusData.status === 'PAID') {
                        clearInterval(poller);
                        window.location.href = `thank-you.html?orderId=${orderId}&status=success`;
                    } else if (statusData.status !== 'PENDING') {
                        clearInterval(poller);
                        window.location.href = `thank-you.html?orderId=${orderId}&status=failed&reason=${statusData.status}`;
                    }
                }
            } catch (pollError) {
                console.error("Polling error:", pollError);
                clearInterval(poller);
                pollingContainer.innerHTML = `<div class="alert alert-danger">Could not confirm payment status. Please check your email for confirmation or contact support.</div>`;
            }
        }, 5000);

        setTimeout(() => {
            if (pollingContainer.style.display === 'block') {
                 clearInterval(poller);
                 pollingContainer.innerHTML = `<div class="alert alert-warning">Payment confirmation timed out. Please check your email or contact support to verify your order status.</div>`;
            }
        }, 60000);

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
