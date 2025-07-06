// src/index.js

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./api/auth');
const adminRoutes = require('./api/admin');
const mfaRoutes = require('./api/mfa');
const productRoutes = require('./api/products');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const ipFilter = require('./middleware/ipFilter');
const customerRoutes = require('./api/customers');
const orderRoutes = require('./api/orders');
const settingsRoutes = require('./api/settings');
const analyticsRoutes = require('./api/analytics');
const contentRoutes = require('./api/content');


const app = express();
const PORT = process.env.PORT || 3001;


// Trust proxy headers to get the correct client IP address
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(express.json()); // To parse JSON request bodies
app.use(express.static('public')); // Serve static files from the public directory
app.use(ipFilter); 

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/mfa', authenticate, mfaRoutes);
app.use('/api/products', authenticate, productRoutes);
app.use('/api/customers', authenticate, customerRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/settings', authenticate, settingsRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);
app.use('/api/content', authenticate, contentRoutes); 



app.get('/', (req, res) => {
  res.send('Admin API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});