const { Product } = require('../models');
const { Op } = require('sequelize'); // For more complex queries like search

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
            whereClause.category = category;
        }
        if (subcategory) {
            whereClause.subcategory = subcategory;
        }
        if (searchQuery) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchQuery}%` } }, // Case-insensitive search
                { description: { [Op.iLike]: `%${searchQuery}%` } },
                { category: { [Op.iLike]: `%${searchQuery}%` } },
                { subcategory: { [Op.iLike]: `%${searchQuery}%` } },
            ];
        }

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