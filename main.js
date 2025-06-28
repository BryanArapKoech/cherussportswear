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
    const quickViewModal = quickViewModalElement ? new bootstrap.Modal(quickViewModalElement) : null;
    const cartToastElement = document.getElementById('cartToast');
    const cartToast = cartToastElement ? new bootstrap.Toast(cartToastElement) : null;
    const toastMessageElement = document.getElementById('toastMessage');
    const bannerSection = document.querySelector('.banner-section');
    const bannerHr = document.querySelector('.banner-hr');
    const newProductSection = document.querySelector('.new-product-section');
    const newProductHr = document.querySelector('.new-product-hr');
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // Modal Elements
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
    let newestOfferProducts = []; // Array to hold products for the slider
    let currentOfferIndex = 0; // Current index for the slider
    let offerIntervalId; // To hold the interval ID

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
        if (!cartToast || !toastMessageElement) {
            console.warn("Toast elements not found, cannot show toast:", message);
            return;
        }
        toastMessageElement.textContent = message;
       
        cartToast.show();
    }

    // --- Cart Management  ---
   function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartBadge();
    }

    function updateCartBadge() {
        if (!cartBadge) {
            // console.warn("Cart badge element not found on this page.");
            return;
        }
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    // Refined addToCart 
    function addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
        const product = currentFetchedProducts.find(p => p.id == productId);

        if (!product) {
            console.error("Product details not found in fetched list for ID:", productId);
            showToast("Error: Could not find product details to add to cart.", "error");
            return;
        }

        const productPrice = parseFloat(product.price);
        if (isNaN(productPrice)) {
            console.error("Invalid price for product ID:", productId, product.price);
            showToast("Error: Product has an invalid price.", "error");
            return;
        }

        const cart = getCart();
        const cartItemId = `${product.id}-${selectedSize || 'NA'}-${selectedColor || 'NA'}`;
        const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                cartItemId: cartItemId,
                id: product.id,
                name: product.name,
                price: productPrice,
                quantity: quantity,
                imageUrl: product.imageUrl || './assets/placeholder-image.svg',
                size: selectedSize,
                color: selectedColor,
                category: product.category,
                subcategory: product.subcategory
            });
        }
        saveCart(cart);
        showToast(`${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} ${selectedColor ? `(Color: ${selectedColor})` : ''} added to cart!`.trim());
    }

    function animateAddToCartButton(button) {
        if (!button || button.classList.contains('disabled')) return;
        const originalHTML = button.innerHTML;

        button.innerHTML = '<i class="fas fa-check me-1"></i>Added';
        button.disabled = true;
        button.classList.remove('btn-warning');
        button.classList.add('btn-success', 'disabled');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            button.classList.remove('btn-success', 'disabled');
            button.classList.add('btn-warning');
        }, 1500);
    }

    // --- Fetching and Displaying Products ---
    async function fetchAndDisplayProducts(page = 1, category = 'all', sort = 'featured', search = '', append = false) {
        if (isLoadingMore) return;

        console.log(`Fetching: page=${page}, category=${category}, sort=${sort}, search=${search}, append=${append}`);
        if (!productsContainer) { // If this page doesn't list products, just return
            // console.log("No productsContainer found on this page. Skipping product fetch.");
            return;
        }

        if (append && loadMoreBtn && loader) {
            isLoadingMore = true;
            loader.style.display = 'inline-block';
            loadMoreBtn.style.display = 'none';
        } else if (!append) {
            productsContainer.innerHTML = '<div class="col-12 text-center p-5"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading products...</p></div>';
            currentPage = 1;
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            currentFetchedProducts = [];
        }

        const params = new URLSearchParams({ page });
        if (category && category !== 'all') params.append('category', category);
        if (sort) params.append('sort', sort);
        if (search) params.append('q', search);

        try {
            const response = await fetch(`${BACKEND_URL}/api/products?${params.toString()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
            const data = await response.json();
            console.log('Data received from API:', data);


            if (!append) productsContainer.innerHTML = ''; // Clear only if not appending

            if (data.products && data.products.length > 0) {
                currentFetchedProducts = append ? [...currentFetchedProducts, ...data.products] : data.products;
                displayProducts(data.products, productsContainer);
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
            if (!append && productsContainer) {
                productsContainer.innerHTML = '<div class="col-12 text-center text-danger"><p>Could not load products. Please check your connection or try again later.</p><small>Error: ' + error.message + '</small></div>';
            } else {
                showToast("Error loading more products.", "error");
            }
        } finally {
            if (append && loader && loadMoreBtn && loadMoreContainer) {
                isLoadingMore = false;
                loader.style.display = 'none';
                if (currentPage < totalPages && loadMoreBtn) loadMoreBtn.style.display = 'inline-block';
            }
        }
    }

    function displayProducts(productsToDisplay, container) {
        if (!productsToDisplay || productsToDisplay.length === 0) return;

        productsToDisplay.forEach(product => {
            let colorsData = [];
            try {
                if (product.colors && typeof product.colors === 'string') {
                    colorsData = JSON.parse(product.colors);
                } else if (Array.isArray(product.colors)) {
                    colorsData = product.colors;
                }
            } catch (e) { console.error("Failed to parse colors JSON for product ID " + product.id + ":", product.colors, e); }

            const originalPriceHtml = product.originalPrice ? `<span class="original-price">${formatPrice(parseFloat(product.originalPrice))}</span>` : '';
            let discountBadgeHtml = ''; // Implement discount logic if product.discount exists
            const priceClass = product.originalPrice ? 'text-danger fw-bold' : '';
            const colorsHtml = Array.isArray(colorsData) ? colorsData.map(color =>
                `<span style="background-color: ${color.code || '#ccc'}; border: ${(color.code?.toLowerCase() === '#ffffff' || color.code?.toLowerCase() === 'white') ? '1px solid #ccc' : 'none'}" title="${color.name}" class="color-swatch"></span>`
            ).join('') : '';
            

                       
            let imageUrl = product.imageUrl || 'assets/placeholder-image.svg';
            
            // Standardize the path by removing any leading './'
            if (imageUrl.startsWith('./')) {
             imageUrl = imageUrl.substring(2);
                }

            const cardHtml = `
                <div class="col">
                    <div class="card product-card h-100" data-product-id="${product.id}">
                        <div class="product-img-wrapper">
                            <img src="${imageUrl}" class="product-img card-img-top" alt="${product.name || 'Product Image'}" loading="lazy">
                            <div class="wishlist-btn" title="Add to Wishlist" data-product-id="${product.id}"><i class="far fa-heart"></i></div>
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
                            <div class="product-price-container">${originalPriceHtml}<span class="product-price ${priceClass}">${formatPrice(parseFloat(product.price))}</span></div>
                            <div class="color-options">${colorsHtml}</div>
                            <button class="btn btn-warning add-to-cart w-100 mt-auto" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
        attachProductEventListeners(container); // Attach to newly added cards within this specific container
    }

    function attachProductEventListeners(container = document) {
        if (!container) {
            console.warn("attachProductEventListeners called with a null or undefined container. Skipping.");
            return;
        }
        container.querySelectorAll('.quick-view-btn').forEach(button => {
            button.removeEventListener('click', handleQuickViewClick);
            button.addEventListener('click', handleQuickViewClick);
        });
        container.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.removeEventListener('click', handleWishlistClick);
            btn.addEventListener('click', handleWishlistClick);
        });
        // Target only buttons within product cards for this, or specifically the static one
        container.querySelectorAll('.product-card .add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCartGridStaticClick);
            button.addEventListener('click', handleAddToCartGridStaticClick);
        });
        // If .add-to-cart-static is outside a .product-card, handle it separately or ensure 'container' is specific
        if (container === document || container.classList.contains('new-product-section')) {
            container.querySelectorAll('.add-to-cart-static').forEach(button => {
                 button.removeEventListener('click', handleAddToCartGridStaticClick);
                 button.addEventListener('click', handleAddToCartGridStaticClick);
            });
        }
    }

    // --- Event Handlers ---
    function handleQuickViewClick(event) {
        if (!quickViewModalElement || !quickViewModal) {
            console.error("Quick View Modal not initialized.");
            return;
        }
        const productId = event.currentTarget.dataset.productId;
        const product = currentFetchedProducts.find(p => p.id == productId);
        if (!product) {
            console.error("Product details not found for Quick View:", productId);
            showToast("Could not load product details.", "error");
            return;
        }

        document.getElementById('modalProductTitleContent').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = formatPrice(parseFloat(product.price));
        document.getElementById('modalProductDescription').textContent = product.description || 'No description available.';
        document.getElementById('modalProductRating').innerHTML = generateStarRating(product.rating);
        document.getElementById('modalProductReviews').textContent = `(${product.reviews || 0} reviews)`;
        const imageUrl = product.imageUrl || './assets/placeholder-image.svg';
        document.getElementById('modalImage1').src = imageUrl;
        document.getElementById('modalImage1').alt = product.name;
        const carouselInner = quickViewModalElement.querySelector('#productCarousel .carousel-inner');
        if (carouselInner) carouselInner.innerHTML = `<div class="carousel-item active"><img src="${imageUrl}" class="d-block w-100" alt="${product.name}" id="modalImage1"></div>`;

        const modalOriginalPrice = quickViewModalElement.querySelector('#modalOriginalPrice');
        const modalProductPriceEl = quickViewModalElement.querySelector('#modalProductPrice'); // Use specific modal element

        if (product.originalPrice && modalOriginalPrice && modalProductPriceEl) {
            modalOriginalPrice.textContent = formatPrice(parseFloat(product.originalPrice));
            modalOriginalPrice.style.display = 'inline';
            modalProductPriceEl.classList.add('text-danger', 'fw-bold');
        } else if (modalOriginalPrice && modalProductPriceEl) {
            modalOriginalPrice.style.display = 'none';
            modalProductPriceEl.classList.remove('text-danger', 'fw-bold');
        }

        let colorsData = [];
        try { colorsData = product.colors && typeof product.colors === 'string' ? JSON.parse(product.colors) : (Array.isArray(product.colors) ? product.colors : []); }
        catch(e) { console.error("Error parsing colors for quick view:", e); }

        let sizesData = [];
        try { sizesData = product.sizes && typeof product.sizes === 'string' ? JSON.parse(product.sizes) : (Array.isArray(product.sizes) ? product.sizes : []); }
        catch(e) { console.error("Error parsing sizes for quick view:", e); }


        const colorContainer = quickViewModalElement.querySelector('#modalColorOptions');
        const colorContainerWrapper = quickViewModalElement.querySelector('#modalColorOptionsContainer');
        if (colorContainerWrapper && colorContainer) {
            if (colorsData.length > 0) {
                colorContainer.innerHTML = colorsData.map((color, index) => `
                    <input type="radio" class="btn-check color-radio" name="modalColor" id="modalColor${index}" value="${color.name}" data-color-code="${color.code || ''}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                    <label class="color-swatch large" for="modalColor${index}" style="background-color: ${color.code || '#ccc'}; border: ${(color.code?.toLowerCase() === '#ffffff' || color.code?.toLowerCase() === 'white') ? '1px solid #ccc' : 'none'}" title="${color.name}"></label>
                `).join('');
                colorContainerWrapper.style.display = 'block';
            } else {
                colorContainer.innerHTML = '';
                colorContainerWrapper.style.display = 'none';
            }
        }

        const sizeContainer = quickViewModalElement.querySelector('#modalSizeOptions');
        const sizeContainerWrapper = quickViewModalElement.querySelector('#modalSizeOptionsContainer');
        if (sizeContainerWrapper && sizeContainer) {
            if (sizesData.length > 0) {
                sizeContainer.innerHTML = sizesData.map((size, index) => `
                    <input type="radio" class="btn-check" name="modalSize" id="modalSize${index}" value="${size}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                    <label class="btn btn-outline-secondary btn-sm" for="modalSize${index}">${size}</label>
                `).join('');
                sizeContainerWrapper.style.display = 'block';
            } else {
                sizeContainer.innerHTML = '';
                sizeContainerWrapper.style.display = 'none';
            }
        }

        if(quantityInput) quantityInput.value = '1';
        if(modalAddToCartBtn) {
            modalAddToCartBtn.dataset.productId = product.id;
            modalAddToCartBtn.innerHTML = 'Add to Cart';
            modalAddToCartBtn.disabled = false;
            modalAddToCartBtn.classList.remove('btn-success', 'disabled');
            modalAddToCartBtn.classList.add('btn-warning');
        }
        const modalAddToWishlistBtn = quickViewModalElement.querySelector('#modalAddToWishlistBtn');
        if(modalAddToWishlistBtn) modalAddToWishlistBtn.dataset.productId = product.id;

        quickViewModal.show();
    }

    function handleWishlistClick(event) {
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
        addToCart(productId, 1, null, null);
        animateAddToCartButton(button);
    }

    // Modal Add to Cart Listener
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            if (!productId) {
                console.error("Product ID missing from modal add to cart button.");
                showToast("Error: Could not add item to cart.", "error");
                return;
            }
            const quantityVal = quantityInput ? parseInt(quantityInput.value) : 1;
            const selectedSizeInput = quickViewModalElement.querySelector('#modalSizeOptions input[name="modalSize"]:checked');
            const selectedSize = selectedSizeInput ? selectedSizeInput.value : null;
            const selectedColorInput = quickViewModalElement.querySelector('#modalColorOptions input[name="modalColor"]:checked');
            const selectedColorName = selectedColorInput ? selectedColorInput.value : null;
            addToCart(productId, quantityVal, selectedSize, selectedColorName);
            animateAddToCartButton(this);
            if (quickViewModal) setTimeout(() => quickViewModal.hide(), 700);
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
        // --- Offer Slideshow Functions ---
    function displayOfferProduct() {
        if (newestOfferProducts.length === 0) return;

        const offerContainer = document.getElementById('newProductOfferContent');
        if (!offerContainer) return;

        // Cycle to the next product
        currentOfferIndex = (currentOfferIndex + 1) % newestOfferProducts.length;
        const product = newestOfferProducts[currentOfferIndex];
        
        // Add product to global fetched list if not present, so addToCart works
        if (!currentFetchedProducts.find(p => p.id == product.id)) {
            currentFetchedProducts.push(product);
        }

        let imageUrl = product.imageUrl || 'assets/placeholder-image.svg';
        if (imageUrl.startsWith('./')) {
            imageUrl = imageUrl.substring(2);
        }

        const offerHtml = `
            <div class="col-md-6 text-center">
                <img src="${imageUrl}" class="img-fluid" alt="${product.name}" style="max-height: 400px; object-fit: contain;">
            </div>
            <div class="col-md-6 d-flex align-items-center">
                <div>
                    <p class="text-muted">Our Newest Product Offer</p>
                    <h1>${product.name}</h1>
                    <small>${product.description || 'A great new addition to our collection.'}</small>
                    <br>
                    <button type="button" class="btn btn-warning mt-3 add-to-cart-static" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        // Fade out, update content, then fade in
        offerContainer.style.opacity = 0;

        setTimeout(() => {
            offerContainer.innerHTML = offerHtml;
            offerContainer.style.opacity = 1;

            // Re-attach listener to the newly created button
            const newButton = offerContainer.querySelector('.add-to-cart-static');
            if (newButton) {
                newButton.addEventListener('click', handleAddToCartGridStaticClick);
            }
        }, 500); // This duration should match the CSS transition time
    }

    async function initializeNewestProductOffer() {
        const offerContainer = document.getElementById('newProductOfferContent');
        if (!offerContainer) return;

        console.log("Fetching newest products for offer slideshow...");
        try {
            const response = await fetch(`${BACKEND_URL}/api/products?sort=newest&limit=5`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                // Filter out products without a valid image URL
                newestOfferProducts = data.products.filter(p => p.imageUrl && p.imageUrl.trim() !== '');

                if (newestOfferProducts.length > 0) {
                    currentOfferIndex = -1; // Start at -1 so the first call shows index 0
                    displayOfferProduct(); // Show the first product immediately
                    
                    if (newestOfferProducts.length > 1) {
                       if (offerIntervalId) clearInterval(offerIntervalId); // Clear previous interval if any
                       offerIntervalId = setInterval(displayOfferProduct, 10000); // 10-second interval
                    }
                } else {
                     offerContainer.innerHTML = '<div class="col-12"><p>No new offers with images available.</p></div>';
                }
            } else {
                offerContainer.innerHTML = '<div class="col-12"><p>Could not load newest offers at this time.</p></div>';
            }
        } catch (error) {
            console.error("Error initializing newest product offer:", error);
            offerContainer.innerHTML = `<div class="col-12 text-danger"><p>Error loading offers: ${error.message}</p></div>`;
        }
    }

    // --- Filtering / Sorting / Pagination Setup ---
    function setupFiltersAndSorting() {
        if (filterButtonGroup) {
            filterButtonGroup.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('active')) {
                    const currentActive = filterButtonGroup.querySelector('.active');
                    if(currentActive) currentActive.classList.remove('active');
                    e.target.classList.add('active');
                    currentCategory = e.target.dataset.category || 'all';
                    currentPage = 1;
                    fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
                    updateCategoryTitle({ category: currentCategory, search: currentSearch });
                }
            });
        }
        if (sortOptionsSelect) {
            sortOptionsSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                currentPage = 1;
                fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
            });
        }
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                if (currentPage < totalPages && !isLoadingMore) { // Add !isLoadingMore check
                    fetchAndDisplayProducts(currentPage + 1, currentCategory, currentSort, currentSearch, true);
                }
            });
        }
        const searchForm = document.querySelector('.search_bar');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchInput = searchForm.querySelector('input[name="q"]');
                currentSearch = searchInput ? searchInput.value.trim() : '';
                currentPage = 1;
                currentCategory = 'all';
                 if (filterButtonGroup) {
                    const currentActive = filterButtonGroup.querySelector('.active');
                    if(currentActive) currentActive.classList.remove('active');
                    const allButton = filterButtonGroup.querySelector('[data-category="all"]');
                    if(allButton) allButton.classList.add('active');
                }
                fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
                updateCategoryTitle({ search: currentSearch });
            });
        }
    }

    // --- Get Query Params from URL ---
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category'),
            subcategory: params.get('subcategory'),
            search: params.get('q')
        };
    }

    // --- Update Category Title ---
    function updateCategoryTitle(params) {
        if (!categoryTitleElement) return;
        const { category, subcategory, search } = params;
        let title = "Products"; // Default for safety
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
            navMenu.querySelectorAll('.dropdown__item > .nav__link, .dropdown__subitem > .dropdown__link').forEach(toggle => {
                if (!toggle.dataset.mobileToggleAttached) {
                    toggle.addEventListener('click', (e) => {
                        if (navMenu.classList.contains('show-menu') && (toggle.parentElement.classList.contains('dropdown__item') || toggle.parentElement.classList.contains('dropdown__subitem'))) {
                            e.preventDefault();
                            toggle.parentElement.classList.toggle('show-mobile-submenu');
                        }
                    });
                    toggle.dataset.mobileToggleAttached = 'true';
                }
            });
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
    async function initializePage() {
        const params = getQueryParams();
        currentCategory = params.category || 'all';
        currentSearch = params.search || '';
        currentSort = sortOptionsSelect ? sortOptionsSelect.value : 'featured';
        currentPage = 1;

        if (filterButtonGroup) {
            const currentActive = filterButtonGroup.querySelector('.active');
            if(currentActive) currentActive.classList.remove('active');
            const buttonToActivate = filterButtonGroup.querySelector(`[data-category="${currentCategory}"]`) || filterButtonGroup.querySelector(`[data-category="all"]`);
            if(buttonToActivate) buttonToActivate.classList.add('active');
        }

        if (categoryTitleElement) updateCategoryTitle(params); // Update title if element exists

        // Only fetch products if a productsContainer exists (i.e., we're on a page that lists products like index.html)
        if (productsContainer) {
            await fetchAndDisplayProducts(currentPage, currentCategory, currentSort, currentSearch, false);
        }

        
        const isHomePage = !params.category && !params.subcategory && !params.search;
        if (bannerSection) bannerSection.style.display = isHomePage ? 'flex' : 'none';
        if (bannerHr) bannerHr.style.display = isHomePage ? 'block' : 'none';
        if (newProductSection && newProductHr) {
            if (isHomePage) {
                newProductSection.style.display = 'block';
                newProductHr.style.display = 'block';
                initializeNewestProductOffer();
            } else {
                newProductSection.style.display = 'none';
                newProductHr.style.display = 'none';
            }
        }

        // Always setup these as they might be on all pages with main.js
        setupHamburger();
        updateCartBadge();

        // Setup filters/sorting only if relevant elements exist on the current page
        if (filterButtonGroup || sortOptionsSelect || document.querySelector('.search_bar') || loadMoreBtn) {
            setupFiltersAndSorting();
        }

        

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // --- START Execution ---
    initializePage(); // This call sets up the current page

    
    // MAKE FUNCTIONS GLOBALLY ACCESSIBLE FOR OTHER SCRIPTS (like cart.js)
    // This is executed after all functions above are defined within this DOMContentLoaded scope.
    
    console.log("main.js: Exposing functions globally...");
    if (typeof getCart === 'function') { window.getCart = getCart; console.log(" - getCart exposed."); } else { console.error("main.js: getCart is not a function in this scope to expose."); }
    if (typeof saveCart === 'function') { window.saveCart = saveCart; console.log(" - saveCart exposed."); } else { console.error("main.js: saveCart is not a function in this scope to expose."); }
    if (typeof updateCartBadge === 'function') { window.updateCartBadge = updateCartBadge; console.log(" - updateCartBadge exposed."); } else { console.error("main.js: updateCartBadge is not a function in this scope to expose."); }
    if (typeof formatPrice === 'function') { window.formatPrice = formatPrice; console.log(" - formatPrice exposed."); } else { console.error("main.js: formatPrice is not a function in this scope to expose."); }
    if (typeof setupHamburger === 'function') { window.setupHamburger = setupHamburger; console.log(" - setupHamburger exposed."); } else { console.error("main.js: setupHamburger is not a function in this scope to expose."); }
    if (typeof showToast === 'function') { window.showToast = showToast; console.log(" - showToast exposed."); } else { console.error("main.js: showToast is not a function in this scope to expose."); }
    

}); 