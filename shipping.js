document.addEventListener('DOMContentLoaded', function() {
    const authCheckDiv = document.getElementById('auth-check');
    const shippingContentDiv = document.getElementById('shipping-content');
    const shippingForm = document.getElementById('shippingForm');
    const summaryItemsList = document.getElementById('summaryItemsList');
    const summaryCartCount = document.getElementById('summaryCartCount');

    // --- 1. Check if user is logged in ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Not logged in, show error and redirect to login
        authCheckDiv.innerHTML = `
            <div class="alert alert-danger">
                You must be logged in to proceed to checkout. Redirecting you to the login page...
            </div>`;
        setTimeout(() => {
            // Save the current page to redirect back to after login
            localStorage.setItem('redirectAfterLogin', 'shipping.html');
            window.location.href = 'login.html';
        }, 3000);
        return;
    }

    // --- 2. If logged in, show the form ---
    authCheckDiv.style.display = 'none';
    shippingContentDiv.style.display = 'block';

    // --- 3. Load Cart Summary ---
    function loadOrderSummary() {
        const cart = getCart();
        if (cart.length === 0) {
            // If cart is empty, redirect back to the main cart page
            window.location.href = 'cart.html';
            return;
        }

        summaryItemsList.innerHTML = '';
        let itemCount = 0;
        cart.forEach(item => {
            itemCount += item.quantity;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between lh-sm';
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name} (${item.quantity})</h6>
                    <small class="text-muted">${item.size || ''} ${item.color || ''}</small>
                </div>
                <span class="text-muted">${formatPrice(item.price * item.quantity)}</span>
            `;
            summaryItemsList.appendChild(li);
        });
        summaryCartCount.textContent = itemCount;
    }

    // --- 4. Handle Form Submission ---
    shippingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect shipping data
        const shippingDetails = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value
        };

        // Save to localStorage to pass to the next step
        localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));

        // Redirect to the payment page
        window.location.href = 'payment.html';
    });
    
    // --- Initial Load ---
    loadOrderSummary();
    
    // Pre-fill form from previous session if available
    const savedShipping = localStorage.getItem('shippingDetails');
    if(savedShipping) {
        const details = JSON.parse(savedShipping);
        Object.keys(details).forEach(key => {
            const input = document.getElementById(key);
            if(input) input.value = details[key];
        });
    }
});