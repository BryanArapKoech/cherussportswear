// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Elements ---
    const productsContainer = document.getElementById('productsContainer');
    const categoryTitleElement = document.getElementById('categoryTitle');
    const filterButtonGroup = document.querySelector('.filter-buttons');
    const sortOptionsSelect = document.getElementById('sortOptions');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loader = document.getElementById('loader');
    const cartBadge = document.getElementById('cartItemCountBadge'); // Direct ID
    const quickViewModalElement = document.getElementById('quickViewModal');
    const quickViewModal = quickViewModalElement ? new bootstrap.Modal(quickViewModalElement) : null; // Handle if modal doesn't exist
    const cartToastElement = document.getElementById('cartToast');
    const cartToast = cartToastElement ? new bootstrap.Toast(cartToastElement) : null; // Handle if toast doesn't exist
    const toastMessageElement = document.getElementById('toastMessage');
    const bannerSection = document.querySelector('.banner-section');
    const bannerHr = document.querySelector('.banner-hr');
    const newProductSection = document.querySelector('.new-product-section');
    const newProductHr = document.querySelector('.new-product-hr');
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    // Modal Elements (assuming they exist)
    const decreaseQtyBtn = document.getElementById('decreaseQuantity');
    const increaseQtyBtn = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantityInput');
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

    // --- State ---
    let currentPage = 1;
    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentSearch = '';
    let isLoadingMore = false;
    let totalPages = 1;
    let currentFetchedProducts = []; // Store fetched products for quick view/add to cart

    const BACKEND_URL = 'http://localhost:3000'; // Make sure this matches your backend

    // --- Utility Functions ---
    function formatPrice(price) {
        return `Kshs. ${Number(price).toFixed(2)}`;
    }

    function generateStarRating(rating) {
        let stars = '';
        const ratingNum = parseFloat(rating) || 0; // Ensure number
        const fullStars = Math.floor(ratingNum);
        const halfStar = ratingNum % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for(let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for(let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }

    function showToast(message, type = 'success') {
        if (!cartToast || !toastMessageElement) return;
        // Optional: Customize header/icon based on type
        toastMessageElement.textContent = message;
        cartToast.show();
    }

    // --- Cart Management (Keep these or import if separate) ---
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartBadge();
    }

    function updateCartBadge() {
        if (!cartBadge) return;
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    // --- Refactored addToCart ---
    // Now relies on currentFetchedProducts or fetches details if needed (more robust)
    function addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
        const cart = getCart();
        // Find product details from the *currently fetched* products
        const product = currentFetchedProducts.find(p => p.id == productId);

        if (!product) {
            // Fallback: Optionally fetch product details if not found in current list
            // This makes it more robust if called from somewhere unexpected,
            // but adds an extra network request. For now, we'll log an error.
            console.error("Product details not found in fetched list for ID:", productId);
            showToast("Error: Could not find product details to add to cart.", "error");
            return;
            /* --- Alternative: Fetch on demand (requires backend endpoint) ---
            fetch(`${BACKEND_URL}/api/products/${productId}`)
                .then(response => response.json())
                .then(fetchedProduct => {
                    if (!fetchedProduct) throw new Error('Product not found on server');
                    // ... proceed with adding fetchedProduct details to cart ...
                    _addToCartInternal(fetchedProduct, cart, quantity, selectedSize, selectedColor);
                })
                .catch(error => {
                    console.error("Error fetching product details for cart:", error);
                    showToast("Error adding item to cart.", "error");
                });
            return; // Exit initial flow
            */
        }

        _addToCartInternal(product, cart, quantity, selectedSize, selectedColor);
    }

    // Internal helper to handle the actual cart logic once product details are known
    function _addToCartInternal(product, cart, quantity, selectedSize, selectedColor) {
        const cartItemId = `${product.id}${selectedSize ? '-' + selectedSize : '-NA'}${selectedColor ? '-' + selectedColor : '-NA'}`;
        const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                cartItemId: cartItemId,
                id: product.id,
                name: product.name,
                price: parseFloat(product.price), // Ensure number
                quantity: quantity,
                imageUrl: product.imageUrl || './assets/placeholder-image.svg',
                size: selectedSize,
                color: selectedColor
            });
        }
        saveCart(cart);
        showToast(`${product.name} added to cart!`);
    }


    function animateAddToCartButton(button) {
        if (!button || button.classList.contains('disabled')) return;
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check me-1"></i>Added';
        button.disabled = true;
        button.classList.remove('btn-warning');
        button.classList.add('btn-success', 'disabled');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('btn-success', 'disabled');
            button.classList.add('btn-warning');
        }, 1500);
    }

    // --- Fetching and Displaying Products ---
    async function fetchAndDisplayProducts(page = 1, category = 'all', sort = 'featured', search = '', append = false) {
        if (isLoadingMore) return;

        console.log(`Fetching: page=${page}, category=${category}, sort=${sort}, search=${search}, append=${append}`);
        if (!productsContainer) return; // Don't proceed if container doesn't exist

        if (append && loadMoreBtn && loader) {
            isLoadingMore = true;
            loader.style.display = 'inline-block';
            loadMoreBtn.style.display = 'none';
        } else if (!append) {
            productsContainer.innerHTML = '<div class="col-12 text-center p-5"><div class="spinner-border text-warning"></div><p>Loading...</p></div>';
            currentPage = 1;
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            currentFetchedProducts = []; // Clear stored products on new fetch
        }

        const params = new URLSearchParams({ page });
        if (category && category !== 'all') params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('q', search);

        try {
            const response = await fetch(`${BACKEND_URL}/api/products?${params.toString()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (!append) productsContainer.innerHTML = '';

            if (data.products && data.products.length > 0) {
                // Add newly fetched products to our stored list
                currentFetchedProducts = append ? [...currentFetchedProducts, ...data.products] : data.products;
                displayProducts(data.products, productsContainer); // Display only the newly fetched ones for appending
                currentPage = data.currentPage;
                totalPages = data.totalPages;
                if (loadMoreContainer) loadMoreContainer.style.display = currentPage < totalPages ? 'block' : 'none';
            } else if (!append) {
                productsContainer.innerHTML = '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>';
                if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            } else {
                console.log("No more products to append.");
                if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            if (!append) {
                productsContainer.innerHTML = '<div class="col-12 text-center text-danger">Could not load products. Please try again later.</div>';
            } else {
                showToast("Error loading more products.", "error");
            }
        } finally {
            if (append && loader && loadMoreBtn && loadMoreContainer) {
                isLoadingMore = false;
                loader.style.display = 'none';
                if (currentPage < totalPages) loadMoreBtn.style.display = 'inline-block';
            }
        }
    }

    // Display Products (Renders cards from data)
    function displayProducts(productsToDisplay, container) {
        // This function now assumes it receives an array of product objects
        // and just renders them. It doesn't clear the container itself.
        if (!productsToDisplay || productsToDisplay.length === 0) {
            // No products *in this batch*, might still have previous ones if appending
            return;
        }

        productsToDisplay.forEach(product => {
            let colorsData = null;
            try { colorsData = product.colors && typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors; } catch (e) { console.error("Failed to parse colors JSON", product.colors); }

            const originalPriceHtml = product.originalPrice ? `<span class="original-price">${formatPrice(parseFloat(product.originalPrice))}</span>` : '';
            let discountBadgeHtml = ''; // Logic to calculate/display discount if needed
            const priceClass = product.originalPrice ? 'text-danger fw-bold' : '';
            const colorsHtml = Array.isArray(colorsData) ? colorsData.map(color =>
                `<span style="background-color: ${color.code}; border: ${color.code?.toLowerCase() === '#ffffff' || color.code?.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'}" title="${color.name}" class="color-swatch"></span>`
            ).join('') : '';
            const imageUrl = product.imageUrl || './assets/placeholder-image.svg';

            const cardHtml = `
                <div class="col">
                    <div class="card product-card h-100" data-product-id="${product.id}">
                        <div class="product-img-wrapper">
                            <img src="${imageUrl}" class="product-img card-img-top" alt="${product.name || 'Product Image'}" loading="lazy">
                            <div class="wishlist-btn" title="Add to Wishlist" data-product-id="${product.id}">
                                <i class="far fa-heart"></i>
                            </div>
                            ${discountBadgeHtml}
                            <button class="btn btn-sm quick-view-btn" data-product-id="${product.id}">Quick View</button>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="product-category">${product.subcategory || product.category || 'N/A'}</div>
                            <h5 class="card-title flex-grow-1">${product.name || 'Product Name'}</h5>
                            <div class="mb-2">
                                <span class="star-rating">${generateStarRating(product.rating)}</span>
                                <span class="text-muted small">(${product.reviews || 0} reviews)</span>
                            </div>
                            <div class="product-price-container">
                                ${originalPriceHtml}
                                <span class="product-price ${priceClass}">${formatPrice(parseFloat(product.price))}</span>
                            </div>
                            <div class="color-options">${colorsHtml}</div>
                            <button class="btn btn-warning add-to-cart w-100 mt-auto" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Re-attach event listeners to the *newly added* elements within the container
        attachProductEventListeners(container);
    }


    // Attach listeners only to elements within the specified container (or document if null)
    function attachProductEventListeners(container = document) {
        // Quick View Buttons
        container.querySelectorAll('.quick-view-btn').forEach(button => {
            button.removeEventListener('click', handleQuickViewClick);
            button.addEventListener('click', handleQuickViewClick);
        });

        // Wishlist Buttons
        container.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.removeEventListener('click', handleWishlistClick);
            btn.addEventListener('click', handleWishlistClick);
        });

        // Add to Cart Buttons (Grid & Static - if static exists)
        container.querySelectorAll('.product-card .add-to-cart, .add-to-cart-static').forEach(button => {
            button.removeEventListener('click', handleAddToCartGridStaticClick);
            button.addEventListener('click', handleAddToCartGridStaticClick);
        });
    }

    // --- Event Handlers ---
    // Refactored handleQuickViewClick to use stored fetched data
    function handleQuickViewClick(event) {
        if (!quickViewModal) return;
        const productId = event.currentTarget.dataset.productId;
        // Find product in the data we already fetched and stored
        const product = currentFetchedProducts.find(p => p.id == productId);

        if (!product) {
            console.error("Product details not found in current fetched data for Quick View:", productId);
            showToast("Could not load product details.", "error");
            return;
        }

        // Populate Modal (similar logic, but use the 'product' object)
        document.getElementById('modalProductTitleContent').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = formatPrice(parseFloat(product.price));
        document.getElementById('modalProductDescription').textContent = product.description || 'No description available.';
        document.getElementById('modalProductRating').innerHTML = generateStarRating(product.rating);
        document.getElementById('modalProductReviews').textContent = `(${product.reviews || 0} reviews)`;
        const imageUrl = product.imageUrl || './assets/placeholder-image.svg';
        document.getElementById('modalImage1').src = imageUrl;
        document.getElementById('modalImage1').alt = product.name;
         // Reset carousel if needed
         const carouselInner = document.querySelector('#productCarousel .carousel-inner');
         carouselInner.innerHTML = `<div class="carousel-item active"><img src="${imageUrl}" class="d-block w-100" alt="${product.name}" id="modalImage1"></div>`;


        const modalOriginalPrice = document.getElementById('modalOriginalPrice');
        if (product.originalPrice) {
            modalOriginalPrice.textContent = formatPrice(parseFloat(product.originalPrice));
            modalOriginalPrice.style.display = 'inline';
            document.getElementById('modalProductPrice').classList.add('text-danger', 'fw-bold');
        } else {
            modalOriginalPrice.style.display = 'none';
            document.getElementById('modalProductPrice').classList.remove('text-danger', 'fw-bold');
        }

        // Parse colors/sizes which might be JSON strings from DB
         let colorsData = null;
         try { colorsData = product.colors && typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors; } catch (e) { console.error("Failed to parse colors JSON", product.colors); }
         let sizesData = null;
         try { sizesData = product.sizes && typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes; } catch (e) { console.error("Failed to parse sizes JSON", product.sizes); }


        const colorContainer = document.getElementById('modalColorOptions');
        const colorContainerWrapper = document.getElementById('modalColorOptionsContainer');
        if (Array.isArray(colorsData) && colorsData.length > 0) {
            colorContainer.innerHTML = colorsData.map((color, index) => `
                <input type="radio" class="btn-check color-radio" name="modalColor" id="modalColor${index}" value="${color.name}" data-color-code="${color.code}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                <label class="color-swatch large" for="modalColor${index}" style="background-color: ${color.code}; border: ${color.code?.toLowerCase() === '#ffffff' || color.code?.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'}" title="${color.name}"></label>
            `).join('');
            colorContainerWrapper.style.display = 'block';
        } else {
            colorContainer.innerHTML = '';
            colorContainerWrapper.style.display = 'none';
        }

        const sizeContainer = document.getElementById('modalSizeOptions');
        const sizeContainerWrapper = document.getElementById('modalSizeOptionsContainer');
        if (Array.isArray(sizesData) && sizesData.length > 0) {
             sizeContainer.innerHTML = sizesData.map((size, index) => `
                <input type="radio" class="btn-check" name="modalSize" id="modalSize${index}" value="${size}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                <label class="btn btn-outline-secondary btn-sm" for="modalSize${index}">${size}</label>
            `).join('');
            sizeContainerWrapper.style.display = 'block';
        } else {
             sizeContainer.innerHTML = '';
             sizeContainerWrapper.style.display = 'none';
        }

        if(quantityInput) quantityInput.value = '1'; // Reset quantity

        // Update modal button data attributes
        if(modalAddToCartBtn) modalAddToCartBtn.dataset.productId = product.id;
        document.getElementById('modalAddToWishlistBtn').dataset.productId = product.id;

        quickViewModal.show();
    }

    function handleWishlistClick(event) {
        // Keep existing simulation or implement real logic
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far'); icon.classList.add('fas', 'text-danger');
            button.title = "Remove from Wishlist"; showToast("Added to Wishlist (Simulation)");
        } else {
            icon.classList.remove('fas', 'text-danger'); icon.classList.add('far');
            button.title = "Add to Wishlist"; showToast("Removed from Wishlist (Simulation).");
        }
        event.stopPropagation();
    }

    function handleAddToCartGridStaticClick(event) {
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        addToCart(productId, 1, null, null); // Call refactored addToCart
        animateAddToCartButton(button);
    }

    // Modal Add to Cart Listener (ensure it's attached once)
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const quantity = parseInt(quantityInput.value) || 1;
            const selectedSizeInput = document.querySelector('#modalSizeOptions input[name="modalSize"]:checked');
            const selectedSize = selectedSizeInput ? selectedSizeInput.value : null;
            const selectedColorInput = document.querySelector('#modalColorOptions input[name="modalColor"]:checked');
            const selectedColor = selectedColorInput ? selectedColorInput.value : null;

            addToCart(productId, quantity, selectedSize, selectedColor); // Call refactored addToCart
            animateAddToCartButton(this);
            if (quickViewModal) setTimeout(() => quickViewModal.hide(), 500);
        });
    }

    // Modal Quantity Controls Listener
    if (decreaseQtyBtn && increaseQtyBtn && quantityInput) {
        decreaseQtyBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) quantityInput.value = currentValue - 1;
        });
        increaseQtyBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

    // --- Filtering / Sorting / Pagination Setup ---
    function setupFiltersAndSorting() {
        // Filter Buttons
        if (filterButtonGroup) {
            filterButtonGroup.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('active')) {
                    filterButtonGroup.querySelector('.active')?.classList.remove('active');
                    e.target.classList.add('active');
                    currentCategory = e.target.dataset.category || 'all';
                    currentPage = 1; // Reset page
                    fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
                    updateCategoryTitle({ category: currentCategory, search: currentSearch });
                }
            });
        }
        // Sorting Dropdown
        if (sortOptionsSelect) {
            sortOptionsSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                currentPage = 1; // Reset page
                fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
            });
        }
        // Load More Button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    fetchAndDisplayProducts(currentPage + 1, currentCategory, currentSort, currentSearch, true);
                }
            });
        }
         // Search Form (Example - assuming a form with id="searchForm" and input name="q")
         const searchForm = document.querySelector('.search_bar'); // Use existing search bar form
         if (searchForm) {
             searchForm.addEventListener('submit', (e) => {
                 e.preventDefault(); // Prevent default form submission
                 const searchInput = searchForm.querySelector('input[name="q"]');
                 currentSearch = searchInput ? searchInput.value.trim() : '';
                 currentPage = 1; // Reset page
                 currentCategory = 'all'; // Reset category on new search
                 // Update active filter button to 'all'
                  if (filterButtonGroup) {
                     filterButtonGroup.querySelector('.active')?.classList.remove('active');
                     filterButtonGroup.querySelector('[data-category="all"]')?.classList.add('active');
                 }
                 fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
                 updateCategoryTitle({ search: currentSearch }); // Update title for search results
             });
         }

    }

    // --- Get Query Params from URL ---
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category'),
            subcategory: params.get('subcategory'), // If you use subcategory filtering
            search: params.get('q') // Match search input name
        };
    }

    // --- Update Category Title ---
    function updateCategoryTitle(params) {
        if (!categoryTitleElement) return;
        const { category, subcategory, search } = params;
        let title = "Products";
        if (search) {
            title = `Search Results for "${search}"`;
        } else if (category && category !== 'all') {
            title = category.charAt(0).toUpperCase() + category.slice(1);
            if (subcategory) title += ` / ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
            if (category.toLowerCase() === 't-shirts') title = 'T-Shirts';
            if (category.toLowerCase() === 'fullsuit') title = 'Fullsuits';
        } else {
            title = "Featured Products";
        }
        categoryTitleElement.textContent = title;
    }


    // --- Hamburger Menu Setup ---
    function setupHamburger() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('show-menu');
                hamburger.classList.toggle('active');
            });
            // Add mobile dropdown toggles
             navMenu.querySelectorAll('.dropdown__item > .nav__link, .dropdown__subitem > .dropdown__link').forEach(toggle => {
                 // Check if a listener already exists (simple way)
                 if (!toggle.dataset.mobileToggleAttached) {
                     toggle.addEventListener('click', (e) => {
                         if (navMenu.classList.contains('show-menu') && (toggle.parentElement.classList.contains('dropdown__item') || toggle.parentElement.classList.contains('dropdown__subitem'))) {
                             e.preventDefault();
                             toggle.parentElement.classList.toggle('show-mobile-submenu');
                         }
                     });
                     toggle.dataset.mobileToggleAttached = 'true'; // Mark as attached
                 }
             });
            // Close menu clicking outside
            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('show-menu') && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('show-menu');
                    hamburger.classList.remove('active');
                    navMenu.querySelectorAll('.show-mobile-submenu').forEach(el => el.classList.remove('show-mobile-submenu'));
                }
            });
        }
    }

    // --- Initial Page Load Logic ---
    function initializePage() {
        const params = getQueryParams();
        currentCategory = params.category || 'all';
        currentSearch = params.search || '';
        currentSort = sortOptionsSelect ? sortOptionsSelect.value : 'featured';
        currentPage = 1;

        if (filterButtonGroup) {
            filterButtonGroup.querySelector('.active')?.classList.remove('active');
            const buttonToActivate = filterButtonGroup.querySelector(`[data-category="${currentCategory}"]`) || filterButtonGroup.querySelector(`[data-category="all"]`);
            buttonToActivate?.classList.add('active');
        }

        updateCategoryTitle(params);
        fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);

        const isHomePage = !params.category && !params.subcategory && !params.search;
        if (bannerSection) bannerSection.style.display = isHomePage ? 'flex' : 'none';
        if (bannerHr) bannerHr.style.display = isHomePage ? 'block' : 'none';
        if (newProductSection) newProductSection.style.display = isHomePage ? 'flex' : 'none'; // Assuming flex display for this section
        if (newProductHr) newProductHr.style.display = isHomePage ? 'block' : 'none';

        setupHamburger();
        setupFiltersAndSorting();
        updateCartBadge(); // Initial cart badge
        // Initial attachment of listeners to any static elements if needed
         attachProductEventListeners(document.querySelector('.new-product-section')); // Attach to static section if it exists


         // Initialize tooltips (if used)
         const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
         tooltipTriggerList.map(function (tooltipTriggerEl) {
            // Ensure tooltips are properly destroyed before re-initializing if content changes drastically
            const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            return new bootstrap.Tooltip(tooltipTriggerEl);
         });
    }

    // --- START Execution ---
    initializePage();

}); // End DOMContentLoaded