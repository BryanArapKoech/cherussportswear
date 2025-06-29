// src/index.js

require('dotenv').config();
const express = require('express');

const authRoutes = require('./api/auth');
const adminRoutes = require('./api/admin');
const authenticate = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/admin', authenticate, adminRoutes);

app.get('/', (req, res) => {
  res.send('Admin API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});