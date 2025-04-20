document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');

    function formatPrice(price) {
        return `Kshs. ${price.toFixed(2)}`;
    }

    function renderCart() {
        const cart = getCart(); // Assumes getCart() is available from main.js
        cartItemsContainer.innerHTML = ''; // Clear loading/previous items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="alert alert-info text-center">Your cart is empty. <a href="index.html">Start Shopping!</a></div>';
            cartSubtotalElement.textContent = formatPrice(0);
            cartTotalElement.textContent = formatPrice(0);
            checkoutButton.classList.add('disabled'); // Disable checkout if cart is empty
            updateCartBadge(); // Ensure badge is hidden
            return;
        }

        checkoutButton.classList.remove('disabled'); // Enable checkout button
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item', 'd-flex', 'align-items-center', 'mb-3', 'border-bottom', 'pb-3');
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">
                        ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}
                    </small>
                    <div class="mt-1">${formatPrice(item.price)}</div>
                </div>
                <div class="d-flex align-items-center me-3">
                    <button class="btn btn-outline-secondary btn-sm decrease-qty" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" class="form-control form-control-sm quantity-input mx-2" value="${item.quantity}" min="1" data-index="${index}" readonly>
                    <button class="btn btn-outline-secondary btn-sm increase-qty" data-index="${index}">+</button>
                </div>
                <div class="fw-bold me-3">${formatPrice(itemTotal)}</div>
                <button class="btn btn-outline-danger btn-sm remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Update summary
        cartSubtotalElement.textContent = formatPrice(subtotal);
        // For now, total is same as subtotal (shipping TBD)
        cartTotalElement.textContent = formatPrice(subtotal);

        // Add event listeners for quantity changes and removal
        addCartItemEventListeners();
        updateCartBadge(); // Update header badge
    }

    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
        // Could add listener for direct input change if not readonly
    }

    function handleQuantityChange(event) {
        const button = event.currentTarget;
        const index = parseInt(button.dataset.index);
        const cart = getCart();
        const item = cart[index];

        if (button.classList.contains('decrease-qty')) {
            if (item.quantity > 1) {
                item.quantity--;
            }
        } else if (button.classList.contains('increase-qty')) {
            item.quantity++;
        }

        saveCart(cart); // Assumes saveCart() is available from main.js
        renderCart(); // Re-render the cart to reflect changes
    }

    function handleRemoveItem(event) {
        const button = event.currentTarget;
        const index = parseInt(button.dataset.index);
        const cart = getCart();

        // Remove item from array
        cart.splice(index, 1);

        saveCart(cart);
        renderCart(); // Re-render the cart
    }

    // Initial render when the cart page loads
    renderCart();

});