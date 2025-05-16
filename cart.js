document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const cartShippingElement = document.getElementById('cartShipping'); // Get shipping element
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');

    // Ensure main.js functions are available (getCart, saveCart, updateCartBadge, formatPrice)
    if (typeof getCart !== 'function' || typeof saveCart !== 'function' || typeof updateCartBadge !== 'function' || typeof formatPrice !== 'function') {
        console.error("Core functions (getCart, saveCart, updateCartBadge, formatPrice) not found. Ensure main.js is loaded before cart.js and provides these.");
        if(cartItemsContainer) cartItemsContainer.innerHTML = '<div class="alert alert-danger">Error loading cart functionality. Please refresh.</div>';
        return;
    }
    // Hamburger menu setup for cart page (if header is part of cart.html)
    if (typeof setupHamburger === 'function') {
        setupHamburger();
    }


    function renderCart() {
        const cart = getCart();
        if (!cartItemsContainer || !cartSubtotalElement || !cartTotalElement || !checkoutButton || !cartShippingElement) {
            console.error("One or more cart DOM elements are missing.");
            return;
        }
        cartItemsContainer.innerHTML = ''; // Clear previous items or loading message

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="alert alert-info text-center" role="alert">
                    Your shopping cart is currently empty.
                    <hr>
                    <a href="index.html" class="alert-link fw-bold">Start Shopping!</a>
                </div>`;
            cartSubtotalElement.textContent = formatPrice(0);
            cartShippingElement.textContent = formatPrice(0); // Or "N/A"
            cartTotalElement.textContent = formatPrice(0);
            checkoutButton.classList.add('disabled');
            updateCartBadge(); // Ensure badge is correctly hidden or 0
            return;
        }

        checkoutButton.classList.remove('disabled');
        let subtotal = 0;

        cart.forEach(item => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity) || 1;
            const itemTotal = itemPrice * itemQuantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item', 'd-flex', 'align-items-center', 'mb-3', 'border-bottom', 'pb-3');
            itemElement.dataset.cartItemId = item.cartItemId; // Use the unique cartItemId

            let variantDetails = [];
            if (item.size && item.size !== 'NA') variantDetails.push(`Size: ${item.size}`);
            if (item.color && item.color !== 'NA') variantDetails.push(`Color: ${item.color}`);

            itemElement.innerHTML = `
                <img src="${item.imageUrl || './assets/placeholder-image.svg'}" alt="${item.name || 'Product'}" class="me-3">
                <div class="flex-grow-1 cart-item-details">
                    <h6 class="mb-1">${item.name || 'Product Name'}</h6>
                    ${variantDetails.length > 0 ? `<small class="text-muted d-block">${variantDetails.join(', ')}</small>` : ''}
                    <div class="mt-1 fw-bold">${formatPrice(itemPrice)}</div>
                </div>
                <div class="d-flex align-items-center mx-sm-3 mx-1">
                    <button class="btn btn-outline-secondary btn-sm decrease-qty" data-cart-item-id="${item.cartItemId}" ${itemQuantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" class="form-control form-control-sm quantity-input mx-2" value="${itemQuantity}" min="1" data-cart-item-id="${item.cartItemId}" readonly>
                    <button class="btn btn-outline-secondary btn-sm increase-qty" data-cart-item-id="${item.cartItemId}">+</button>
                </div>
                <div class="fw-bold me-sm-3 me-1" style="min-width: 90px; text-align: right;">${formatPrice(itemTotal)}</div>
                <button class="btn btn-outline-danger btn-sm remove-item" title="Remove item" data-cart-item-id="${item.cartItemId}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartSubtotalElement.textContent = formatPrice(subtotal);
        // Shipping logic: For now, placeholder. Could be calculated based on subtotal, weight, or fixed.
        const shippingCost = 0; // Placeholder - "Calculated at Checkout"
        cartShippingElement.textContent = shippingCost > 0 ? formatPrice(shippingCost) : "Calculated at Checkout";
        cartTotalElement.textContent = formatPrice(subtotal + shippingCost);

        addCartItemEventListeners();
        updateCartBadge();
    }

    function addCartItemEventListeners() {
        cartItemsContainer.addEventListener('click', function(event) {
            const button = event.target.closest('button'); // Get the button element if a child (like icon) was clicked
            if (!button) return;

            const cartItemId = button.dataset.cartItemId;
            if (!cartItemId) return;

            if (button.classList.contains('decrease-qty')) {
                updateItemQuantity(cartItemId, -1);
            } else if (button.classList.contains('increase-qty')) {
                updateItemQuantity(cartItemId, 1);
            } else if (button.classList.contains('remove-item')) {
                removeItemFromCart(cartItemId);
            }
        });
    }

    function updateItemQuantity(cartItemId, change) {
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

        if (itemIndex > -1) {
            const newQuantity = cart[itemIndex].quantity + change;
            if (newQuantity >= 1) { // Do not allow quantity to go below 1
                cart[itemIndex].quantity = newQuantity;
                saveCart(cart);
                renderCart();
            } else if (newQuantity === 0) {
                // Optional: if quantity becomes 0 by decrementing, remove the item
                // removeItemFromCart(cartItemId);
                // Or simply do nothing if the button is disabled correctly at quantity 1
                console.log("Item quantity reached 0, not removing automatically. Use remove button.");
            }
        }
    }

    function removeItemFromCart(cartItemId) {
        let cart = getCart();
        const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
        if (updatedCart.length < cart.length) { // Check if item was actually removed
            saveCart(updatedCart);
            renderCart();
            showToast("Item removed from cart.", "info"); // Use your toast function if available in main.js
        }
    }
    // Function to show toast (if not globally available from main.js, define a local one or import)
    function showToast(message, type = 'success') {
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast && cartToastElement && toastMessageElement) {
            toastMessageElement.textContent = message;
            // You might want to change toast class based on type (e.g., bg-success, bg-danger)
            const toast = bootstrap.Toast.getInstance(cartToastElement) || new bootstrap.Toast(cartToastElement);
            toast.show();
        } else {
            console.log(`Toast: ${message} (Type: ${type})`); // Fallback
        }
    }


    // Initial render when the cart page loads
    renderCart();
    updateCartBadge(); // Also update badge on initial load of cart page
});