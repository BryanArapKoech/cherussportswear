const { Product, Sequelize } = require('../models'); // Ensure Sequelize is imported for Op
const { Op } = Sequelize; // For more complex queries like search

// Fetch all products with pagination, filtering, and sorting
exports.getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Products per page
        const offset = (page - 1) * limit;

        const { category, subcategory, sort, q: searchQuery } = req.query;

        let whereClause = {};
        let orderClause = [];

        // Filtering
        if (category && category !== 'all') {
            whereClause.category = { [Op.iLike]: category }; // Made category filtering case-insensitive
        }
        if (subcategory) {
            whereClause.subcategory = { [Op.iLike]: subcategory }; // Made subcategory filtering case-insensitive
        }

        // --- SEARCH LOGIC ---
        if (searchQuery && searchQuery.trim() !== '') { // Ensure searchQuery is not empty after trimming
            const searchTerm = `%${searchQuery.trim()}%`; // Prepare for LIKE query (case-insensitive due to Op.iLike)
            const plainSearchTermForTags = searchQuery.trim(); // For tag matching, might not need wildcards if searching for exact tag presence

            // Initialize the OR conditions array for search
            const searchConditions = [
                { name: { [Op.iLike]: searchTerm } },
                { description: { [Op.iLike]: searchTerm } },
                { category: { [Op.iLike]: searchTerm } },
                { subcategory: { [Op.iLike]: searchTerm } },
                // { brand: { [Op.iLike]: searchTerm } } // <-- ADDED: Search by brand
            ];

            whereClause[Op.or] = searchConditions;
        }
        // --- END OF SEARCH LOGIC ---


        // Sorting
        switch (sort) {
            case 'price-low':
                orderClause.push(['price', 'ASC']);
                break;
            case 'price-high':
                orderClause.push(['price', 'DESC']);
                break;
            case 'newest':
                orderClause.push(['createdAt', 'DESC']); // Assumes timestamps are enabled
                break;
            case 'featured': // You might sort by isFeatured then by another criteria
                orderClause.push(['isFeatured', 'DESC'], ['createdAt', 'DESC']);
                break;
            default:
                orderClause.push(['createdAt', 'DESC']); // Default sort
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            order: orderClause,
            limit: limit,
            offset: offset,
        });

        res.status(200).json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProducts: count
        });
    } catch (error) {
        console.error("Error in getAllProducts controller:", error); // Added specific error logging
        next(error);
    }
};

// Fetch a single product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// (Admin only - for later) Create a new product
exports.createProduct = async (req, res, next) => {
    try {
        // Add validation for req.body here
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};