// src/index.js

require('dotenv').config();
const express = require('express');
const authRoutes = require('./api/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Admin API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});