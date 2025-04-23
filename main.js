// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Product Data (Replace with API call later) ---
    const allProducts = [
        // Shoes
        { id: 1, name: "Adidas Ultraboost", category: "shoes", subcategory: "running", price: 1500, originalPrice: 1800, discount: 20, imageUrl: "./assets/portf images/carousel/ADIDASBLACKSHOE_370x.jpg", rating: 4.5, reviews: 42, colors: [{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}, {name: 'Blue', code: 'blue'}], description: "Comfortable running shoes with Boost technology." },
        { id: 2, name: "Nike Air Max", category: "shoes", subcategory: "lifestyle", price: 1800, imageUrl: "./assets/portf images/nike_infinity_react_4.png", rating: 4, reviews: 28, colors: [{name: 'Black', code: 'black'}, {name: 'Red', code: 'red'}], description: "Classic Air Max style with modern comfort." },
        { id: 3, name: "Adidas", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/adidas.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 4, name: "CASCADE ACCEL WHITE", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/CASCADEACCELWHITE_900x.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 5, name: "Quality shoes", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0046.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 6, name: "New Balance 574", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0047.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 7, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0066.jpg", rating: 4, reviews: 22, colors: [{name: 'Green', code: 'green'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 8, name: "Nike black", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0067.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 9, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0069.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 10, name: "New Balance 574", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0072.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 11, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0074.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 12, name: "Nike boots", category: "shoes", subcategory: "sports", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0077.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 13, name: "Sport boots", category: "shoes", subcategory: "sports", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0078.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 14, name: "Nike boots", category: "shoes", subcategory: "sport", price: 1650, imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0085.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 15, name: "Isaac Wendland", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/isaac-wendland-YbubEOFyKZU-unsplash-1536x1024.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 16, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/nike.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 17, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/nike_design2.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 18, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/nike1.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 19, name: "Nike", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/nike3.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 20, name: "Nike Alphafly Next 3", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/nike-alphafly-next-3-prm-scarpe-da-running-uomo-white-hq3501-100_F_900x.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 21, name: "YOnex", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "./assets/portf_images/shoes/STRIDER2_900x.jpg", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        { id: 22, name: "New Balance 574", category: "shoes", subcategory: "casual", price: 1650, imageUrl: "../assets/portf_images/shoes/WhatsApp_Image_2021-11-13_at_10.30.10_1944x.webp", rating: 4, reviews: 22, colors: [{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}], description: "Versatile and stylish casual sneakers." },
        

        // Fullsuits
        { id: 60, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 61, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 62, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 63, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 64, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 65, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 66, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 67, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },
        { id: 68, name: "Track Fullsuit", category: "fullsuit", price: 3500, imageUrl: "./assets/placeholder.png", rating: 4, reviews: 15, colors: [{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}], description: "Comfortable tracksuit for training or casual wear." },

        // Vests
        { id: 101, name: "Running Vest", category: "vests", price: 900, imageUrl: "./assets/placeholder.png", rating: 4.2, reviews: 10, colors: [{name: 'Yellow', code: 'yellow'}, {name: 'Orange', code: 'orange'}], description: "Lightweight and breathable vest for running." },
        // Equipment - Balls
        { id: 150, name: "Standard Football Size 5", category: "equipment", subcategory: "balls", price: 1500, imageUrl: "./assets/placeholder.png", rating: 4.5, reviews: 30, description: "Durable football for practice and matches." },
        { id: 151, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 152, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 153, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 154, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 155, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 156, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 157, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 158, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 159, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 160, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 161, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 162, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 163, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 164, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        { id: 165, name: "Basketball Official Size", category: "equipment", subcategory: "balls", price: 1800, imageUrl: "./assets/placeholder.png", rating: 4.6, reviews: 25, description: "Official size and weight basketball." },
        // Equipment - Nets
        { id: 214, name: "Portable Soccer Goal Net", category: "equipment", subcategory: "nets", price: 2500, imageUrl: "./assets/placeholder.png", rating: 4.0, reviews: 8, description: "Easy setup portable goal net." },
        // Equipment - Bags
        { id: 215, name: "Durable Sports Duffel Bag", category: "equipment", subcategory: "bags", price: 2000, imageUrl: "./assets/portf images/accesories/Bag-of-sports-accessories.jpg", rating: 4.3, reviews: 18, description: "Spacious bag for all your gear." },
        // Equipment - Cones
        { id: 216, name: "Training Cones (Set of 10)", category: "equipment", subcategory: "cones", price: 1000, imageUrl: "./assets/portf images/IMG-20250324-WA0048.jpg", rating: 4.0, reviews: 12, description: "Set of 10 marker cones for drills." }, // Used existing image
        // Equipment - Ankle Support
        { id: 217, name: "Adjustable Ankle Support", category: "equipment", subcategory: "ankle-support", price: 800, imageUrl: "./assets/placeholder.png", rating: 4.7, reviews: 22, description: "Provides stability and compression for ankles." },
        // Equipment - Sleeve
        { id: 218, name: "Compression Leg Sleeve", category: "equipment", subcategory: "sleeve", price: 700, imageUrl: "./assets/placeholder.png", rating: 4.4, reviews: 16, description: "Improves blood flow and muscle support." },
        // Gloves
        { id: 219, name: "Goalkeeper Gloves", category: "gloves", price: 1900, imageUrl: "./assets/placeholder.png", rating: 4.1, reviews: 9, description: "Professional grip goalkeeper gloves." },
        // Jackets
        { id: 308, name: "Reebok Classic Hoodie", category: "jackets", price: 1800, imageUrl: "./assets/portf images/nike-alphafly-next-3-prm-scarpe-da-running-uomo-white-hq3501-100_F_900x.jpg", rating: 3, reviews: 12, colors: [{name: 'Gray', code: 'gray'}, {name: 'Black', code: 'black'}], description: "Comfortable and stylish hoodie." },
        { id: 320, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 420, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 250, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 203, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 207, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2036, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 209, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 420, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 520, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 620, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 720, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 820, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 920, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 1020, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2010, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2065, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2650, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 207, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2032, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2052, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2012, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2980, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2009, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 20098, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },{ id: 20, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2091, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },{ id: 20, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },
        { id: 2132, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },{ id: 20, name: "Windbreaker Jacket", category: "jackets", price: 2200, imageUrl: "./assets/placeholder.png", rating: 4.3, reviews: 11, description: "Lightweight protection against wind and light rain." },

        // Caps
        { id: 67, name: "Adidas Classic Cap", category: "caps", price: 500, imageUrl: "./assets/portf images/IMG-20250324-WA0058.jpg", rating: 3.5, reviews: 14, colors: [{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}, {name: 'Red', code: 'red'}], description: "A classic adjustable cap." },
        // Shorts
        { id: 4989, name: "Under Armour Shorts", category: "shorts", price: 1200, imageUrl: "./assets/portf images/IMG-20250324-WA0048.jpg", rating: 5, reviews: 35, discount: 'New', colors: [{name: 'Black', code: 'black'}, {name: 'Navy', code: 'navy'}], description: "Comfortable training shorts." },
        // T-shirts
        { id: 3979, name: "Puma Sport T-Shirt", category: "t-shirts", price: 800, imageUrl: "./assets/portf images/STRRIPEDTSHIRTSS_900x.jpg", rating: 3.5, reviews: 19, colors: [{name: 'Gray', code: 'gray'}, {name: 'White', code: 'white'}, {name: 'Green', code: 'green'}], description: "Breathable cotton t-shirt for workouts." },
        // Socks
        { id: 7087, name: "Nike Running Socks (3 Pack)", category: "socks", price: 300, originalPrice: 350, discount: 15, imageUrl: "./assets/portf images/IMG-20250324-WA0044.jpg", rating: 5, reviews: 47, colors: [{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}], description: "Comfortable and supportive running socks." },
        // Add more products as needed... remember to use './assets/placeholder.png' if you don't have an image yet.
    ];
    // --- End Product Data ---


    const productsContainer = document.getElementById('productsContainer');
    const categoryTitleElement = document.getElementById('categoryTitle');
    const quickViewModalElement = document.getElementById('quickViewModal');
    const quickViewModal = new bootstrap.Modal(quickViewModalElement);
    const cartToastElement = document.getElementById('cartToast');
    const cartToast = new bootstrap.Toast(cartToastElement);
    const toastMessageElement = document.getElementById('toastMessage');
    const bannerSection = document.querySelector('.banner-section'); // Select banner section
    const bannerHr = document.querySelector('.banner-hr'); // Select HR below banner
    const newProductSection = document.querySelector('.new-product-section'); // Select new product section
    const newProductHr = document.querySelector('.new-product-hr'); // Select HR below new product section


    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside (if navMenu is open)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('show-menu') && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show-menu');
                hamburger.classList.remove('active');
            }
        });

        // Close menu when clicking a link inside (optional, good for SPAs)
        navMenu.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 // Only close if it's not a dropdown toggle
                 if (!link.closest('.dropdown__item') || link.classList.contains('dropdown__link') || link.classList.contains('dropdown__sublink')) {
                    // Don't close immediately if it has a URL parameter - let the page load handle it
                    if (!link.href.includes('?')) { 
                        navMenu.classList.remove('show-menu');
                        hamburger.classList.remove('active');
                    }
                 }
             });
         });
    }

    // --- Dropdown Menu Logic ---
    // (Assuming your existing CSS handles the hover/click for dropdowns)
    // If you need JS for click-based dropdowns, you'd add that logic here.

    // --- Carousel ---
    const carouselElement = document.getElementById('cherusCarousel');
    if (carouselElement) {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            wrap: true,
            pause: 'hover'
        });

        const playPauseBtn = document.getElementById('carouselPlayPause');
        if (playPauseBtn) {
            let isPlaying = true;
            playPauseBtn.addEventListener('click', function() {
                if (isPlaying) {
                    carousel.pause();
                    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    isPlaying = false;
                } else {
                    carousel.cycle();
                    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    isPlaying = true;
                }
            });
        }
    }


    // --- Filtering and Display Logic ---

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category'),
            subcategory: params.get('subcategory'),
            search: params.get('search') // Example: add search later
        };
    }

    function filterProducts(products, params) {
        const { category, subcategory, search } = params;

        if (!category && !subcategory && !search) {
            // If no filters, return all (or maybe featured - adjust as needed)
            return products.slice(0, 8); // Show initial set or all
        }

        return products.filter(product => {
            let match = true;
            if (category && product.category.toLowerCase() !== category.toLowerCase()) {
                match = false;
            }
            if (match && subcategory && product.subcategory?.toLowerCase() !== subcategory.toLowerCase()) { // Check if subcategory exists
                match = false;
            }
            if (match && search) {
                const searchTerm = search.toLowerCase();
                match = product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm) ||
                        (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm));
            }
            return match;
        });
    }

    function generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for(let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for(let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
    }

    function displayProducts(productsToDisplay, container) {
        container.innerHTML = ''; // Clear previous content or loading indicator

        if (productsToDisplay.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>';
            return;
        }

        productsToDisplay.forEach(product => {
            const originalPriceHtml = product.originalPrice ? `<span class="original-price text-muted text-decoration-line-through me-2">Kshs. ${product.originalPrice.toFixed(2)}</span>` : '';
            const discountBadgeHtml = product.discount ? `<div class="discount-badge">${product.discount === 'New' ? 'New' : `-${product.discount}%`}</div>` : '';
            const priceClass = product.discount && product.discount !== 'New' ? 'text-danger fw-bold' : '';

            const colorsHtml = product.colors ? product.colors.map(color =>
                `<span style="background-color: ${color.code}; border: ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'}" title="${color.name}" class="color-swatch"></span>`
            ).join('') : '';

            const cardHtml = `
                <div class="col">
                    <div class="card product-card h-100" data-product-id="${product.id}">
                        <div class="product-img-wrapper">
                            <img src="${product.imageUrl}" class="product-img card-img-top" alt="${product.name}">
                            <div class="wishlist-btn" title="Add to Wishlist">
                                <i class="far fa-heart"></i> <!-- 'far' for empty, 'fas' for filled -->
                            </div>
                            ${discountBadgeHtml}
                            <button class="btn btn-sm btn-light quick-view-btn" data-bs-toggle="modal" data-bs-target="#quickViewModal" data-product-id="${product.id}">Quick View</button>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="product-category text-muted small mb-1">${product.categoryDisplay || product.category}</div>
                            <h5 class="card-title flex-grow-1">${product.name}</h5>
                            <div class="mb-2">
                                <span class="star-rating">
                                    ${generateStarRating(product.rating)}
                                </span>
                                <span class="text-muted small">(${product.reviews} reviews)</span>
                            </div>
                            <div class="mb-2 product-price-container">
                                ${originalPriceHtml}
                                <span class="product-price ${priceClass}">Kshs. ${product.price.toFixed(2)}</span>
                            </div>
                            <div class="color-options mb-3">
                                ${colorsHtml}
                            </div>
                            <button class="btn btn-warning add-to-cart w-100 mt-auto">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });

        // After adding products, re-attach event listeners to the new elements
        attachProductEventListeners();
    }

    // --- Function to Attach Event Listeners to Dynamic Elements ---
    function attachProductEventListeners() {
        // Quick View Buttons
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            // Remove potential duplicate listeners before adding
            button.removeEventListener('click', handleQuickViewClick);
            button.addEventListener('click', handleQuickViewClick);
        });

        // Wishlist Buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.removeEventListener('click', handleWishlistClick);
            btn.addEventListener('click', handleWishlistClick);
        });

        // Add to Cart Buttons (in product grid)
        document.querySelectorAll('.add-to-cart').forEach(button => {
             button.removeEventListener('click', handleAddToCartClick);
            button.addEventListener('click', handleAddToCartClick);
        });

        // Add to cart from static section (if kept)
        document.querySelectorAll('.add-to-cart-static').forEach(button => {
            button.removeEventListener('click', handleAddToCartClick); // Can use the same handler
            button.addEventListener('click', handleAddToCartClick);
        });
    }

    // --- Event Handlers ---
    function handleQuickViewClick(event) {
        const productId = event.currentTarget.dataset.productId;
        const product = allProducts.find(p => p.id == productId); // Use == for potential type difference

        if (!product) {
            console.error("Product not found for Quick View:", productId);
            return;
        }

        // Populate Modal
        document.getElementById('modalProductTitleContent').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `Kshs. ${product.price.toFixed(2)}`;
        document.getElementById('modalProductDescription').textContent = product.description || 'No description available.';
        document.getElementById('modalProductRating').innerHTML = generateStarRating(product.rating);
        document.getElementById('modalProductReviews').textContent = `(${product.reviews} reviews)`;
        document.getElementById('modalImage1').src = product.imageUrl;
        document.getElementById('modalImage1').alt = product.name;

        // Handle original price
        const modalOriginalPrice = document.getElementById('modalOriginalPrice');
        if (product.originalPrice) {
            modalOriginalPrice.textContent = `Kshs. ${product.originalPrice.toFixed(2)}`;
            modalOriginalPrice.style.display = 'inline';
            document.getElementById('modalProductPrice').classList.add('text-danger', 'fw-bold');
        } else {
            modalOriginalPrice.style.display = 'none';
            document.getElementById('modalProductPrice').classList.remove('text-danger', 'fw-bold');
        }

        // Handle Colors (example)
        const colorContainer = document.getElementById('modalColorOptions');
        const colorContainerWrapper = document.getElementById('modalColorOptionsContainer');
        if (product.colors && product.colors.length > 0) {
            colorContainer.innerHTML = product.colors.map(color =>
                `<span style="background-color: ${color.code}; border: ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'}" title="${color.name}" class="color-swatch large"></span>`
            ).join('');
            colorContainerWrapper.style.display = 'block';
        } else {
            colorContainer.innerHTML = '';
            colorContainerWrapper.style.display = 'none';
        }

        // Handle Sizes (example - assuming sizes are in product data)
        const sizeContainer = document.getElementById('modalSizeOptions');
        const sizeContainerWrapper = document.getElementById('modalSizeOptionsContainer');
        if (product.sizes && product.sizes.length > 0) {
             sizeContainer.innerHTML = product.sizes.map((size, index) => `
                <input type="radio" class="btn-check" name="modalSize" id="modalSize${index}" value="${size}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                <label class="btn btn-outline-secondary" for="modalSize${index}">${size}</label>
            `).join('');
            sizeContainerWrapper.style.display = 'block';
        } else {
             sizeContainer.innerHTML = '';
             sizeContainerWrapper.style.display = 'none';
        }

        // Reset quantity
        document.getElementById('quantityInput').value = '1';

        // Update modal buttons' data attributes if needed for cart/wishlist logic
        document.getElementById('modalAddToCartBtn').dataset.productId = product.id;
        document.getElementById('modalAddToWishlistBtn').dataset.productId = product.id;

        // Show the modal (the data-bs-toggle attribute already handles this, but calling show() ensures it if triggered purely by JS)
        // quickViewModal.show(); // Usually not needed if using data-bs-toggle/target
    }

    function handleWishlistClick(event) {
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        // In a real app, you'd add/remove from a user's wishlist (local storage or server)
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-danger'); // Add text-danger for red color
            button.title = "Remove from Wishlist";
            showToast("Added to Wishlist!");
        } else {
            icon.classList.remove('fas', 'text-danger');
            icon.classList.add('far');
            button.title = "Add to Wishlist";
            showToast("Removed from Wishlist.");
        }
        // Prevent event bubbling if necessary
        event.stopPropagation();
    }

    function handleAddToCartClick(event) {
        const button = event.currentTarget;
        const card = button.closest('.product-card, .new-product-section'); // Find the parent card or section
        let productId, productName, productPrice;

        if (card.classList.contains('product-card')) {
            // From product grid
            productId = card.dataset.productId;
            const product = allProducts.find(p => p.id == productId);
            if (!product) return; // Should not happen if data is consistent
            productName = product.name;
            productPrice = product.price;
        } else if (card.classList.contains('new-product-section')) {
            // From the static "New Product" section
            productId = button.dataset.productId; // Use a data attribute on the button itself
            productName = card.querySelector('h1').textContent;
            productPrice = 2500; // Hardcoded for this example, ideally get from data attribute too
        } else {
            console.error("Could not determine product details for Add to Cart");
            return;
        }

        // In a real app, you'd add the item (productId, quantity) to the cart (local storage, session, or server)
        console.log(`Adding to cart: ID ${productId}, Name: ${productName}, Price: ${productPrice}`);
        showToast(`${productName} added to cart!`);

        // Animate button (optional)
        button.innerHTML = '<i class="fas fa-check me-2"></i>Added';
        button.classList.remove('btn-warning');
        button.classList.add('btn-success', 'disabled'); // Add disabled temporarily

        setTimeout(() => {
            button.innerHTML = 'Add to Cart';
            button.classList.remove('btn-success', 'disabled');
            button.classList.add('btn-warning');
        }, 2000);
    }

     // --- Modal Quantity Controls ---
     const decreaseQtyBtn = document.getElementById('decreaseQuantity');
     const increaseQtyBtn = document.getElementById('increaseQuantity');
     const quantityInput = document.getElementById('quantityInput');

     if (decreaseQtyBtn && increaseQtyBtn && quantityInput) {
         decreaseQtyBtn.addEventListener('click', () => {
             let currentValue = parseInt(quantityInput.value);
             if (currentValue > 1) {
                 quantityInput.value = currentValue - 1;
             }
         });

         increaseQtyBtn.addEventListener('click', () => {
             let currentValue = parseInt(quantityInput.value);
             quantityInput.value = currentValue + 1;
         });
     }

    // --- Toast Notification ---
    function showToast(message) {
        toastMessageElement.textContent = message;
        cartToast.show();
    }

    // --- Initial Page Load Logic ---
    function initializePage() {
        const params = getQueryParams();
        const filtered = filterProducts(allProducts, params);

        // Update Title
        if (params.category) {
            let title = params.category.charAt(0).toUpperCase() + params.category.slice(1);
            if (params.subcategory) {
                title += ` / ${params.subcategory.charAt(0).toUpperCase() + params.subcategory.slice(1)}`;
            }
             // Special case for 't-shirts'
             if (params.category.toLowerCase() === 't-shirts') {
                title = 'T-Shirts';
            }
            categoryTitleElement.textContent = title;
            // Optionally hide banner/new product section if viewing a specific category
            if (bannerSection) bannerSection.style.display = 'none';
            if (bannerHr) bannerHr.style.display = 'none';
            if (newProductSection) newProductSection.style.display = 'none';
            if (newProductHr) newProductHr.style.display = 'none';

        } else {
            categoryTitleElement.textContent = "Featured Products";
            // Show banner/new product section on the main landing page
            if (bannerSection) bannerSection.style.display = 'flex'; // Or 'block' depending on original style
             if (bannerHr) bannerHr.style.display = 'block';
            if (newProductSection) newProductSection.style.display = 'block'; // Or 'flex'
            if (newProductHr) newProductHr.style.display = 'block';
        }

        displayProducts(filtered, productsContainer);

        // Initialize tooltips for dynamically added elements
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });

    }

    // Run the initialization logic when the page loads
    initializePage();

    // Note: The 'Load More' button logic is currently commented out as it's not
    // fully implemented with the static data. You would typically use it with API calls.
    /*
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        // ... (Load more logic would go here, likely involving slicing the allProducts array or making another API call) ...
    });
    */

}); // End DOMContentLoaded



// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Product Data ---
    const allProducts = [
        // ... (your existing product data) ...
        { id: 1, name: "Adidas Ultraboost", category: "shoes", subcategory: "running", price: 1500, originalPrice: 1800, discount: 20, imageUrl: "./assets/portf images/carousel/ADIDASBLACKSHOE_370x.jpg", rating: 4.5, reviews: 42, colors: [{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}, {name: 'Blue', code: 'blue'}], description: "Comfortable running shoes with Boost technology.", sizes: ['40', '41', '42', '43', '44'] }, // Added sizes example
        { id: 2, name: "Nike Air Max", category: "shoes", subcategory: "lifestyle", price: 1800, imageUrl: "./assets/portf images/nike_infinity_react_4.png", rating: 4, reviews: 28, colors: [{name: 'Black', code: 'black'}, {name: 'Red', code: 'red'}], description: "Classic Air Max style with modern comfort.", sizes: ['41', '42', '43'] },
        // ... Add 'sizes' array to other relevant products
        { id: 'static-nike', name: "Nike infinity React", category: "shoes", price: 2500, imageUrl: "./assets/portf images/nike_infinity_react_4.png", rating: 4, reviews: 5, description: "Fitness shoe combining style with comfort.", sizes: ['40', '41', '42', '43', '44'] }, // Add static product here too if needed
        // ... rest of your products
    ];
    // --- End Product Data ---

    // --- DOM Elements ---
    const productsContainer = document.getElementById('productsContainer');
    const categoryTitleElement = document.getElementById('categoryTitle');
    const quickViewModalElement = document.getElementById('quickViewModal');
    const quickViewModal = new bootstrap.Modal(quickViewModalElement);
    const cartToastElement = document.getElementById('cartToast');
    const cartToast = new bootstrap.Toast(cartToastElement);
    const toastMessageElement = document.getElementById('toastMessage');
    const bannerSection = document.querySelector('.banner-section');
    const bannerHr = document.querySelector('.banner-hr');
    const newProductSection = document.querySelector('.new-product-section');
    const newProductHr = document.querySelector('.new-product-hr');
    const cartBadge = document.querySelector('.nav__link i.fa-shopping-bag + .cart-badge'); // Add a span for the badge in HTML

    // --- Cart Management ---
    function getCart() {
        // Retrieves cart from localStorage or returns an empty array
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        // Saves the cart array to localStorage
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartBadge(); // Update the visual badge count
    }

    function addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
        const cart = getCart();
        // Find the specific product details (needed for price, name, image)
        // Make sure your 'static-nike' product ID is handled or consistent
        const product = allProducts.find(p => p.id == productId); // Use == for potential type difference
        if (!product) {
            console.error("Product not found:", productId);
            return; // Don't add if product details aren't found
        }

        // Create a unique ID for cart items if size/color matter
        // Example: '1-42-Black'
        const cartItemId = `${productId}${selectedSize ? '-' + selectedSize : ''}${selectedColor ? '-' + selectedColor : ''}`;

        const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
            // Item already exists (same product, size, color), update quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({
                cartItemId: cartItemId, // Use the unique ID
                id: product.id,         // Original product ID
                name: product.name,
                price: product.price,
                quantity: quantity,
                imageUrl: product.imageUrl, // Store image for cart page
                size: selectedSize,
                color: selectedColor
            });
        }
        saveCart(cart);
        showToast(`${product.name} added to cart!`);

         // Optional: Animate button (as you had before)
         const button = document.querySelector(`[data-product-id="${productId}"].add-to-cart, [data-product-id="${productId}"].add-to-cart-static, #modalAddToCartBtn[data-product-id="${productId}"]`);
         if(button && !button.classList.contains('modal-add-to-cart-btn')) { // Avoid animation conflict if modal button triggered it
             animateAddToCartButton(button);
         }
    }

    function updateCartBadge() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badgeElement = document.getElementById('cartItemCountBadge'); // Get the badge span

        if (badgeElement) {
            if (totalItems > 0) {
                badgeElement.textContent = totalItems;
                badgeElement.style.display = 'inline-block'; // Show badge
            } else {
                badgeElement.style.display = 'none'; // Hide badge if cart is empty
            }
        }
         console.log("Cart badge updated:", totalItems);
    }

     function animateAddToCartButton(button) {
         if (!button) return;
         const originalText = button.textContent; // Store original text if needed
         button.innerHTML = '<i class="fas fa-check me-1"></i>Added';
         button.classList.remove('btn-warning');
         button.classList.add('btn-success', 'disabled');

         setTimeout(() => {
             button.innerHTML = originalText === 'Add to Cart' ? 'Add to Cart' : '<i class="far fa-heart"></i> Add to Wishlist'; // Restore appropriate text
             button.classList.remove('btn-success', 'disabled');
             button.classList.add('btn-warning'); // Or original classes
             // Make sure modal button text is correct
             if (button.id === 'modalAddToCartBtn') button.innerHTML = 'Add to Cart';
         }, 1500);
     }


    // --- Function to Attach Event Listeners ---
    function attachProductEventListeners() {
        // Quick View Buttons
        document.querySelectorAll('.quick-view-btn').forEach(button => {
            button.removeEventListener('click', handleQuickViewClick);
            button.addEventListener('click', handleQuickViewClick);
        });

        // Wishlist Buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.removeEventListener('click', handleWishlistClick);
            btn.addEventListener('click', handleWishlistClick);
        });

        // Add to Cart Buttons (Grid)
        document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCartGridClick); // Use specific handler
            button.addEventListener('click', handleAddToCartGridClick);
        });

        // Add to Cart (Static Section)
        document.querySelectorAll('.add-to-cart-static').forEach(button => {
            button.removeEventListener('click', handleAddToCartStaticClick); // Use specific handler
            button.addEventListener('click', handleAddToCartStaticClick);
        });

         // Add to Cart (Modal) - Listener attached separately below
    }

    // --- Event Handlers ---

    function handleQuickViewClick(event) {
        const productId = event.currentTarget.dataset.productId;
        const product = allProducts.find(p => p.id == productId);

        if (!product) return;

        // Populate Modal (keep existing population logic)
        document.getElementById('modalProductTitleContent').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `Kshs. ${product.price.toFixed(2)}`;
        // ... (rest of your modal population code) ...

        // Handle Sizes in Modal
        const sizeContainer = document.getElementById('modalSizeOptions');
        const sizeContainerWrapper = document.getElementById('modalSizeOptionsContainer');
        if (product.sizes && product.sizes.length > 0) {
             sizeContainer.innerHTML = product.sizes.map((size, index) => `
                <input type="radio" class="btn-check" name="modalSize" id="modalSize${index}" value="${size}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                <label class="btn btn-outline-secondary" for="modalSize${index}">${size}</label>
            `).join('');
            sizeContainerWrapper.style.display = 'block';
        } else {
             sizeContainer.innerHTML = '';
             sizeContainerWrapper.style.display = 'none';
        }

        // Handle Colors in Modal
        const colorContainer = document.getElementById('modalColorOptions');
        const colorContainerWrapper = document.getElementById('modalColorOptionsContainer');
         if (product.colors && product.colors.length > 0) {
             colorContainer.innerHTML = product.colors.map((color, index) => `
                 <input type="radio" class="btn-check color-radio" name="modalColor" id="modalColor${index}" value="${color.name}" data-color-code="${color.code}" autocomplete="off" ${index === 0 ? 'checked' : ''}>
                 <label class="color-swatch large" for="modalColor${index}" style="background-color: ${color.code}; border: ${color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === 'white' ? '1px solid #ccc' : 'none'}" title="${color.name}"></label>
             `).join('');
             colorContainerWrapper.style.display = 'block';
         } else {
             colorContainer.innerHTML = '';
             colorContainerWrapper.style.display = 'none';
         }


        // Reset quantity
        document.getElementById('quantityInput').value = '1';

        // Update modal buttons' data attributes
        document.getElementById('modalAddToCartBtn').dataset.productId = product.id;
        document.getElementById('modalAddToWishlistBtn').dataset.productId = product.id;
        document.getElementById('modalAddToCartBtn').classList.add('modal-add-to-cart-btn'); // Add class to identify modal button

        // Ensure modal Add to Cart listener is present (attach here)
        const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
        modalAddToCartBtn.removeEventListener('click', handleAddToCartModalClick); // Remove previous if any
        modalAddToCartBtn.addEventListener('click', handleAddToCartModalClick); // Add fresh listener
    }

    function handleWishlistClick(event) {
        // ... (keep existing wishlist logic) ...
        showToast("Wishlist functionality not fully implemented yet."); // Placeholder message
        event.stopPropagation();
    }

    function handleAddToCartGridClick(event) {
        const button = event.currentTarget;
        const card = button.closest('.product-card');
        const productId = card.dataset.productId;
        // For grid items, size/color are usually chosen on product page or modal
        // For this simplified version, we add without size/color
        addToCart(productId, 1);
        animateAddToCartButton(button); // Animate this specific button
    }
     function handleAddToCartStaticClick(event) {
         const button = event.currentTarget;
         const productId = button.dataset.productId; // Should be 'static-nike'
         // Add the static product - assuming no size/color selection here
         addToCart(productId, 1);
         animateAddToCartButton(button); // Animate this specific button
     }

    function handleAddToCartModalClick(event) {
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const quantity = parseInt(document.getElementById('quantityInput').value) || 1;

        // Get selected size (if available)
        const selectedSizeInput = document.querySelector('#modalSizeOptions input[name="modalSize"]:checked');
        const selectedSize = selectedSizeInput ? selectedSizeInput.value : null;

        // Get selected color (if available)
        const selectedColorInput = document.querySelector('#modalColorOptions input[name="modalColor"]:checked');
        const selectedColor = selectedColorInput ? selectedColorInput.value : null;

        addToCart(productId, quantity, selectedSize, selectedColor);
        animateAddToCartButton(button); // Animate modal button
        quickViewModal.hide(); // Optionally close modal after adding
    }


     

    // --- Toast Notification ---
    function showToast(message) {
        toastMessageElement.textContent = message;
        cartToast.show();
    }

    // --- Initial Page Load Logic ---
    function initializePage() {
        const params = getQueryParams();
        // Pre-process products to have a display category (e.g., capitalize)
        const processedProducts = allProducts.map(p => ({
            ...p,
            categoryDisplay: p.category.charAt(0).toUpperCase() + p.category.slice(1)
        }));

        const filtered = filterProducts(processedProducts, params);

        // Update Title logic (keep existing)
        if (params.category) {
           // ... (title update logic) ...
             // Optionally hide banner/new product section
            if (bannerSection) bannerSection.style.display = 'none';
            if (bannerHr) bannerHr.style.display = 'none';
            if (newProductSection) newProductSection.style.display = 'none';
            if (newProductHr) newProductHr.style.display = 'none';
        } else {
            categoryTitleElement.textContent = "Featured Products";
            // Show banner/new product section
             if (bannerSection) bannerSection.style.display = 'flex'; // Or 'block'
             if (bannerHr) bannerHr.style.display = 'block';
            if (newProductSection) newProductSection.style.display = 'flex'; // Or 'block' depending on layout
            if (newProductHr) newProductHr.style.display = 'block';
        }

        displayProducts(filtered, productsContainer);

        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });

        updateCartBadge(); // Initial cart badge update on page load
    }

    // Run the initialization logic when the page loads
    initializePage();

    // Load More (keep commented out or implement pagination/infinite scroll later)
    /*
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        // ...
    });
    */

}); // End DOMContentLoaded