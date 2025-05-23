'use strict';


const productsData = [
  // Shoes
  {
    name: "Adidas Ultraboost", 
    category: "shoes", 
    subcategory: "running", 
    price: 1500.00, 
    originalPrice: 1800.00, 
    description: "Comfortable running shoes with Boost technology.", 
    imageUrl: "./assets/portf_images/shoes/ADIDASBLACKSHOE_370x.jpg", 
    rating: 4.5, 
    reviews: 42, 
    stock: 50, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}, {name: 'Blue', code: 'blue'}]), 
    sizes: JSON.stringify(['40', '41', '42', '43', '44']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Nike Air Max", 
    category: "shoes", 
    subcategory: "lifestyle", 
    price: 1800.00, 
    description: "Classic Air Max style with modern comfort.", 
    imageUrl: "./assets/portf_images/shoes/nike_infinity_react_4.png", 
    rating: 4.0, 
    reviews: 28, 
    stock: 30, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Red', code: 'red'}]), 
    sizes: JSON.stringify(['41', '42', '43']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Adidas Classic", 
    category: "shoes", 
    subcategory: "casual", 
    price: 1650.00, 
    description: "Versatile and stylish casual sneakers.", 
    imageUrl: "./assets/portf_images/shoes/adidas.jpg", 
    rating: 4.0, 
    reviews: 22, 
    stock: 25, 
    colors: JSON.stringify([{name: 'Gray', code: 'gray'}, {name: 'Navy', code: 'navy'}]), 
    sizes: JSON.stringify(['40', '41', '42', '43', '44', '45']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "CASCADE ACCEL WHITE", 
    category: "shoes", 
    subcategory: "casual", 
    price: 1650.00, 
    description: "Versatile and stylish casual sneakers.", 
    imageUrl: "./assets/portf_images/shoes/CASCADEACCELWHITE_900x.jpg", 
    rating: 4.0, 
    reviews: 22, 
    stock: 15, 
    colors: JSON.stringify([{name: 'White', code: 'white'}, {name: 'Gray', code: 'gray'}]), 
    sizes: JSON.stringify(['41', '42', '43', '44']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Nike Boots", 
    category: "shoes", 
    subcategory: "sports", 
    price: 1650.00, 
    description: "Professional sports boots for enhanced performance.", 
    imageUrl: "./assets/portf_images/shoes/IMG-20250324-WA0077.jpg", 
    rating: 4.3, 
    reviews: 19, 
    stock: 20, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Red', code: 'red'}]), 
    sizes: JSON.stringify(['40', '41', '42', '43', '44']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Nike Alphafly Next 3", 
    category: "shoes", 
    subcategory: "running", 
    price: 2200.00, 
    originalPrice: 2500.00, 
    description: "Premium running shoes for professional athletes.", 
    imageUrl: "./assets/portf_images/shoes/nike-alphafly-next-3-prm-scarpe-da-running-uomo-white-hq3501-100_F_900x.jpg", 
    rating: 4.8, 
    reviews: 36, 
    stock: 15, 
    colors: JSON.stringify([{name: 'White', code: 'white'}, {name: 'Black', code: 'black'}]), 
    sizes: JSON.stringify(['40', '41', '42', '43', '44', '45']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  
  // Clothing
  {
    name: "Striped Sport T-Shirt", 
    category: "clothing", 
    subcategory: "t-shirts", 
    price: 800.00, 
    description: "Breathable cotton t-shirt for workouts.", 
    imageUrl: "./assets/portf_images/tshirts/STRRIPEDTSHIRTSS_900x.jpg", 
    rating: 3.5, 
    reviews: 19, 
    stock: 75, 
    colors: JSON.stringify([{name: 'Gray', code: 'gray'}, {name: 'White', code: 'white'}, {name: 'Green', code: 'green'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Adidas Classic Cap", 
    category: "clothing", 
    subcategory: "caps", 
    price: 500.00, 
    description: "A classic adjustable cap.", 
    imageUrl: "./assets/portf_images/caps/IMG-20250324-WA0058.jpg", 
    rating: 3.5, 
    reviews: 14, 
    stock: 40, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}, {name: 'Red', code: 'red'}]), 
    sizes: JSON.stringify(['One Size']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Under Armour Shorts", 
    category: "clothing", 
    subcategory: "shorts", 
    price: 1200.00, 
    description: "Comfortable training shorts.", 
    imageUrl: "./assets/portf_images/shorts/IMG-20250324-WA0048.jpg", 
    rating: 5.0, 
    reviews: 35, 
    stock: 25, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Navy', code: 'navy'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Track Fullsuit", 
    category: "clothing", 
    subcategory: "fullsuit", 
    price: 3500.00, 
    description: "Comfortable tracksuit for training or casual wear.", 
    imageUrl: "./assets/portf_images/tracksuits/tracksuit1.jpg", 
    rating: 4.0, 
    reviews: 15, 
    stock: 20, 
    colors: JSON.stringify([{name: 'Navy', code: 'navy'}, {name: 'Black', code: 'black'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Windbreaker Jacket", 
    category: "clothing", 
    subcategory: "jackets", 
    price: 2200.00, 
    description: "Lightweight protection against wind and light rain.", 
    imageUrl: "./assets/portf_images/jackets/windbreaker.jpg", 
    rating: 4.3, 
    reviews: 11, 
    stock: 15, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Blue', code: 'blue'}, {name: 'Red', code: 'red'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']), 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Nike Running Socks (3 Pack)", 
    category: "clothing", 
    subcategory: "socks", 
    price: 300.00, 
    originalPrice: 350.00, 
    description: "Comfortable and supportive running socks.", 
    imageUrl: "./assets/portf_images/socks/IMG-20250324-WA0044.jpg", 
    rating: 5.0, 
    reviews: 47, 
    stock: 100, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'White', code: 'white'}]), 
    sizes: JSON.stringify(['S', 'M', 'L']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Running Vest", 
    category: "clothing", 
    subcategory: "vests", 
    price: 900.00, 
    description: "Lightweight and breathable vest for running.", 
    imageUrl: "./assets/portf_images/vests/running_vest.jpg", 
    rating: 4.2, 
    reviews: 10, 
    stock: 30, 
    colors: JSON.stringify([{name: 'Yellow', code: 'yellow'}, {name: 'Orange', code: 'orange'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  
  // Equipment
  {
    name: "Standard Football Size 5", 
    category: "equipment", 
    subcategory: "balls", 
    price: 1500.00, 
    description: "Durable football for practice and matches.", 
    imageUrl: "./assets/portf_images/equipment/football.jpg", 
    rating: 4.5, 
    reviews: 30, 
    stock: 50, 
    colors: null, 
    sizes: null, 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Basketball Official Size", 
    category: "equipment", 
    subcategory: "balls", 
    price: 1800.00, 
    description: "Official size and weight basketball.", 
    imageUrl: "./assets/portf_images/equipment/basketball.jpg", 
    rating: 4.6, 
    reviews: 25, 
    stock: 40, 
    colors: null, 
    sizes: null, 
    isFeatured: true, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Portable Soccer Goal Net", 
    category: "equipment", 
    subcategory: "nets", 
    price: 2500.00, 
    description: "Easy setup portable goal net.", 
    imageUrl: "./assets/portf_images/equipment/goal_net.jpg", 
    rating: 4.0, 
    reviews: 8, 
    stock: 10, 
    colors: null, 
    sizes: null, 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Durable Sports Duffel Bag", 
    category: "equipment", 
    subcategory: "bags", 
    price: 2000.00, 
    description: "Spacious bag for all your gear.", 
    imageUrl: "./assets/portf_images/accessories/Bag-of-sports-accessories.jpg", 
    rating: 4.3, 
    reviews: 18, 
    stock: 25, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Blue', code: 'blue'}]), 
    sizes: null, 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Training Cones (Set of 10)", 
    category: "equipment", 
    subcategory: "cones", 
    price: 1000.00, 
    description: "Set of 10 marker cones for drills.", 
    imageUrl: "./assets/portf_images/equipment/IMG-20250324-WA0048.jpg", 
    rating: 4.0, 
    reviews: 12, 
    stock: 100, 
    colors: null, 
    sizes: null, 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Adjustable Ankle Support", 
    category: "equipment", 
    subcategory: "ankle-support", 
    price: 800.00, 
    description: "Provides stability and compression for ankles.", 
    imageUrl: "./assets/portf_images/equipment/ankle_support.jpg", 
    rating: 4.7, 
    reviews: 22, 
    stock: 35, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Beige', code: 'beige'}]), 
    sizes: JSON.stringify(['S', 'M', 'L']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Compression Leg Sleeve", 
    category: "equipment", 
    subcategory: "sleeve", 
    price: 700.00, 
    description: "Improves blood flow and muscle support.", 
    imageUrl: "./assets/portf_images/equipment/leg_sleeve.jpg", 
    rating: 4.4, 
    reviews: 16, 
    stock: 45, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Blue', code: 'blue'}]), 
    sizes: JSON.stringify(['S', 'M', 'L']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  },
  {
    name: "Goalkeeper Gloves", 
    category: "equipment", 
    subcategory: "gloves", 
    price: 1900.00, 
    description: "Professional grip goalkeeper gloves.", 
    imageUrl: "./assets/portf_images/equipment/goalkeeper_gloves.jpg", 
    rating: 4.1, 
    reviews: 9, 
    stock: 20, 
    colors: JSON.stringify([{name: 'Black', code: 'black'}, {name: 'Green', code: 'green'}]), 
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']), 
    isFeatured: false, 
    dateAdded: new Date(), 
    createdAt: new Date(), 
    updatedAt: new Date()
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add default values or handle potential nulls carefully
    const seedData = productsData.map(p => ({
      ...p,
      originalPrice: p.originalPrice || null,
      subcategory: p.subcategory || null,
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      stock: p.stock || 0,
      colors: p.colors || null, // Already stringified
      sizes: p.sizes || null,   // Already stringified
      isFeatured: p.isFeatured || false,
      dateAdded: p.dateAdded || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    await queryInterface.bulkInsert('Products', seedData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};