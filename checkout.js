document.addEventListener('DOMContentLoaded', function() {
    // --- Elements ---
    const form = document.getElementById('checkoutForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnSpinner = placeOrderBtn.querySelector('.spinner-border');
    const placeOrderBtnText = placeOrderBtn.querySelector('span:not(.spinner-border)');
    const paymentOptionsDiv = document.getElementById('paymentOptions');
    const mpesaDetailsDiv = document.getElementById('mpesaDetails');
    // References to card and paypal details divs are kept to hide/show them,
    // but their specific JS logic is removed.
    const cardDetailsDiv = document.getElementById('cardDetails');
    const paypalDetailsDiv = document.getElementById('paypalDetails');
    const mpesaPhoneInput = document.getElementById('mpesaPhone'); // This is the 9-digit part
    const paymentErrorDiv = document.getElementById('paymentError');

    // Summary Elements
    const summaryItemsList = document.getElementById('summaryItemsList');
    const summaryCartCount = document.getElementById('summaryCartCount');
    const summarySubtotalEl = document.getElementById('summarySubtotal');
    const summaryShippingEl = document.getElementById('summaryShipping');
    const summaryTotalEl = document.getElementById('summaryTotal');

    // --- Configuration ---
    const BACKEND_URL = 'http://localhost:3000';

    // --- Load Order Summary ---
    function loadOrderSummary() {
        if (typeof getCart !== 'function') {
            console.error("getCart function is not defined.");
            if (summaryItemsList) summaryItemsList.innerHTML = '<li class="list-group-item">Error loading cart.</li>';
            return;
        }
        const cart = getCart();
        if (!summaryItemsList || !summaryCartCount || !summarySubtotalEl || !summaryShippingEl || !summaryTotalEl) {
            console.error("One or more summary elements are missing.");
            return;
        }

        summaryItemsList.innerHTML = '';
        let subtotal = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        cart.forEach(item => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity) || 0;
            subtotal += itemPrice * itemQuantity;
            itemCount += itemQuantity;

            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name} <span class="text-muted">(${itemQuantity})</span></h6>
                    <small class="text-muted">${item.size && item.size !== 'NA' ? `Size: ${item.size}` : ''} ${item.color && item.color !== 'NA' ? `Color: ${item.color}` : ''}</small>
                </div>
                <span class="text-muted">${formatPrice(itemPrice * itemQuantity)}</span>
            `;
            summaryItemsList.appendChild(li);
        });

        const shippingCost = 200.00; // Example fixed shipping
        const total = subtotal + shippingCost;

        summaryCartCount.textContent = itemCount;
        summarySubtotalEl.textContent = formatPrice(subtotal);
        summaryShippingEl.textContent = formatPrice(shippingCost);
        summaryTotalEl.textContent = formatPrice(total);
    }

    // --- Helper function to get combined M-Pesa number ---
    function getMpesaPhoneNumber() {
        if (mpesaPhoneInput && mpesaPhoneInput.value) {
            return `+254${mpesaPhoneInput.value.trim()}`;
        }
        return null;
    }

    // --- Payment Method Display Logic ---
    function setupPaymentMethodToggle() {
        if (!paymentOptionsDiv || !mpesaDetailsDiv || !cardDetailsDiv || !paypalDetailsDiv || !mpesaPhoneInput) {
            console.warn("One or more payment option elements are missing in setupPaymentMethodToggle.");
            return;
        }
        paymentOptionsDiv.addEventListener('change', (event) => {
            if (event.target.name === 'paymentMethod') {
                const selectedValue = event.target.value;
                mpesaDetailsDiv.style.display = selectedValue === 'mpesa' ? 'block' : 'none';
                // Still hide/show these divs even if their JS logic is removed
                cardDetailsDiv.style.display = selectedValue === 'card' ? 'block' : 'none';
                paypalDetailsDiv.style.display = selectedValue === 'paypal' ? 'block' : 'none';

                mpesaPhoneInput.required = (selectedValue === 'mpesa');
                hidePaymentError();
            }
        });
        const initialPaymentMethod = paymentOptionsDiv.querySelector('input[name="paymentMethod"]:checked');
        if (initialPaymentMethod) {
            initialPaymentMethod.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // --- Form Submission ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        hidePaymentError();

        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            const firstInvalid = form.querySelector(':invalid');
            firstInvalid?.focus();
            firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        form.classList.add('was-validated');

        const selectedPaymentMethod = form.elements.paymentMethod.value;
        const cart = getCart();
        const shippingDetails = getCustomerDetails();
        let mpesaFullPhoneNumber = null;

        if (selectedPaymentMethod !== 'mpesa') {
            handlePaymentError("Only M-Pesa payment is currently supported. Please select M-Pesa.");
            // Optionally, you could re-select M-Pesa radio button
            const mpesaRadio = document.getElementById('mpesa');
            if(mpesaRadio) mpesaRadio.checked = true;
            // And trigger the change event to update UI
            const changeEvent = new Event('change', { bubbles: true });
            paymentOptionsDiv.dispatchEvent(changeEvent);
            return;
        }

        // This block now only executes if M-Pesa is selected
        mpesaFullPhoneNumber = getMpesaPhoneNumber();
        if (!mpesaFullPhoneNumber || !/^\+254[17]\d{8}$/.test(mpesaFullPhoneNumber)) {
            handlePaymentError("Please enter a valid M-Pesa number (9 digits after +254, starting with 1 or 7).");
            if (mpesaPhoneInput) {
                mpesaPhoneInput.classList.add('is-invalid');
                mpesaPhoneInput.focus();
            }
            return;
        }

        setLoading(true);
        console.log("Placing order with M-Pesa. Phone:", mpesaFullPhoneNumber);

         // --- Get the token from localStorage ---
        const token = localStorage.getItem('authToken');

        if (!token) {
            handlePaymentError("You are not logged in. Please log in to place an order.");
            setLoading(false);

        // redirect to login page after a delay
            setTimeout(() => { window.location.href = 'login.html'; }, 3000);

        return;
    }

        try {
            const response = await fetch(`${BACKEND_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify({
                    cart: cart,
                    shipping: shippingDetails,
                    paymentMethod: selectedPaymentMethod, // Will be 'mpesa'
                    mpesaPhone: mpesaFullPhoneNumber
                })
            });

            const orderData = await response.json();

            if (!response.ok) {
                throw new Error(orderData.message || `Failed to create order (Status: ${response.status})`);
            }
            console.log("Order created on backend for M-Pesa:", orderData);

            // M-Pesa STK push was initiated by the backend.
            console.log("M-Pesa STK Push initiated. CheckoutRequestID:", orderData.mpesaCheckoutRequestId);
            handlePaymentError("Please check your phone and enter your M-Pesa PIN to authorize the payment. We will confirm once payment is received.");
            // User remains on the checkout page. setLoading(true) remains active.
            // No direct call to handleServerResponse for M-Pesa success here.

        } catch (error) {
            console.error("Checkout Processing Error:", error);
            handlePaymentError(error.message || "An error occurred during checkout. Please try again.");
            setLoading(false); // Reset loading on error
        }
    }

    // --- Helper Functions ---
    function formatPrice(price) {
        return `Kshs. ${Number(price).toFixed(2)}`;
    }

    function getCustomerDetails() {
        return {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || '',
            address2: document.getElementById('address2')?.value || '',
            city: document.getElementById('city')?.value || '',
            county: document.getElementById('county')?.value || '',
            zip: document.getElementById('zip')?.value || '',
        };
    }

    function setLoading(isLoading) {
        if (!placeOrderBtn || !placeOrderBtnSpinner || !placeOrderBtnText) return;
        if (isLoading) {
            placeOrderBtn.disabled = true;
            placeOrderBtnSpinner.style.display = 'inline-block';
            placeOrderBtnText.textContent = 'Processing...';
        } else {
            placeOrderBtn.disabled = false;
            placeOrderBtnSpinner.style.display = 'none';
            placeOrderBtnText.textContent = 'Place Order';
        }
    }

    function handlePaymentError(message) {
        if (!paymentErrorDiv) return;
        paymentErrorDiv.textContent = message;
        paymentErrorDiv.style.display = 'block';
        paymentErrorDiv.focus();
        paymentErrorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hidePaymentError() {
        if (paymentErrorDiv) paymentErrorDiv.style.display = 'none';
    }


    function handleServerResponse(data) {
        console.log("Handling server response (e.g., for Card/PayPal immediate success):", data);
        if (data.success) {
            if (typeof clearCart === 'function') clearCart();
            if (typeof updateCartBadge === 'function') updateCartBadge();

            const thankYouUrl = new URL('thank-you.html', window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
            thankYouUrl.searchParams.set('orderId', data.orderId);
            thankYouUrl.searchParams.set('method', data.paymentMethod);
            if (data.email) {
                thankYouUrl.searchParams.set('email', encodeURIComponent(data.email));
            }
            window.location.href = thankYouUrl.toString();
        } else {
            handlePaymentError(data.message || "Payment processing failed. Please check your details or try another method.");
            setLoading(false);
        }
    }

    // Stubs for functions presumed to be in main.js
    if (typeof getCart === 'undefined') {
        window.getCart = function() { console.warn("Used stubbed getCart"); return []; };
    }
    if (typeof clearCart === 'undefined') {
        window.clearCart = function() { localStorage.removeItem('shoppingCart'); console.warn("Used stubbed clearCart"); };
    }
    if (typeof updateCartBadge === 'undefined') {
        window.updateCartBadge = function() { console.warn("Used stubbed updateCartBadge"); };
    }

    // --- Initial Load ---
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        loadOrderSummary();
        setupPaymentMethodToggle();
    } else {
        console.error("Checkout form with ID 'checkoutForm' not found.");
    }
    if (typeof updateCartBadge === 'function') updateCartBadge();
});