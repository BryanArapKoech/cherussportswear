const { Product } = require('../models');
const { Op } = require('sequelize'); // Import Operators for advanced querying

exports.getAllProducts = async (req, res, next) => {
    try {
        // --- Filtering ---
        const { category, subcategory, search, isFeatured } = req.query;
        const whereClause = {};

        if (category && category !== 'all') {
             // Simple category mapping (expand as needed like in main.js)
             if (category.toLowerCase() === 'clothing') {
                 whereClause.category = { [Op.in]: ['clothing', 'fullsuit', 'vests', 'jackets', 'shorts', 't-shirts', 'socks'] };
             } else if (category.toLowerCase() === 'accessories') {
                 whereClause.category = { [Op.in]: ['accessories', 'gloves', 'caps', 'bags'] }; // Example
             } else if (category.toLowerCase() === 'equipment') {
                 whereClause.category = { [Op.in]: ['equipment', 'balls', 'nets', 'cones', 'ankle-support', 'sleeve'] }; // Example
             } else {
                 whereClause.category = category;
             }
        }
        if (subcategory) {
            whereClause.subcategory = subcategory;
        }
        if (search) {
            const searchTerm = `%${search}%`; // Prepare for LIKE query
            whereClause[Op.or] = [ // Search in name OR description
                { name: { [Op.iLike]: searchTerm } }, // Case-insensitive like
                { description: { [Op.iLike]: searchTerm } }
            ];
        }
         if (isFeatured === 'true') { // Filter for featured products if requested
             whereClause.isFeatured = true;
         }

        // --- Sorting ---
        const { sort } = req.query;
        let orderClause = [];
        switch (sort) {
            case 'price-low':
                orderClause.push(['price', 'ASC']);
                break;
            case 'price-high':
                orderClause.push(['price', 'DESC']);
                break;
            case 'newest':
                orderClause.push(['dateAdded', 'DESC']); // Assumes dateAdded field exists
                break;
            case 'featured': // Could combine with isFeatured flag or a rating/popularity score
            default:
                // Default sort order (e.g., by date added or name)
                orderClause.push(['dateAdded', 'DESC']);
                orderClause.push(['name', 'ASC']);
        }

        // --- Pagination ---
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 8; // Default limit (e.g., 8 products per page)
        const offset = (page - 1) * limit;

        // --- Database Query ---
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            order: orderClause,
            limit: limit,
            offset: offset,
            // Add distinct: true if needed with includes later
        });

        // --- Send Response ---
        res.status(200).json({
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProducts: count,
            products: rows, // The actual product data for the current page
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        next(error); // Pass error to the handler
    }
    exports.getAllProducts = async (req, res, next) => {
        try {
            // ... (filtering and sorting setup) ...
            console.log('WHERE Clause:', JSON.stringify(whereClause, null, 2)); // Log the filter criteria
            console.log('ORDER Clause:', orderClause);                        // Log the sort criteria
            console.log('LIMIT:', limit, 'OFFSET:', offset);                 // Log pagination
    
            const { count, rows } = await Product.findAndCountAll({
                where: whereClause,
                order: orderClause,
                limit: limit,
                offset: offset,
            });
    
            console.log('DB Query Result - Count:', count);                // Log the total count found
            console.log('DB Query Result - Rows:', rows.length);           // Log how many rows returned for this page
    
            // ... (rest of the function - sending response) ...
    
        } catch (error) {
            console.error("Error fetching products:", error); // Log any caught errors
            next(error);
        }
    };
};

