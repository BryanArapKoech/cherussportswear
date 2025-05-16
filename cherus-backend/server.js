require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); 
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // Be more specific in production

// --- Middleware ---
// CORS Configuration
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed`));
      }
    },
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
  

// Body Parsers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic Logging Middleware (Optional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// --- API Routes ---
app.use('/api/orders', orderRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/products', productRoutes);

// --- Basic Health Check Route ---
app.get('/', (req, res) => {
    res.send(`Cherus Sportswear Backend API is running! Environment: ${process.env.NODE_ENV}`);
});

// --- Error Handling Middleware (MUST be last) ---
app.use(errorHandler);


// --- Database Connection & Server Start ---
const startServer = async () => {
    try {
        // Authenticate database connection
        await db.sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        
        
        if (process.env.NODE_ENV === 'development') {
             // await db.sequelize.sync({ alter: true }); // Tries to alter tables to match models
             // console.log('Database synchronized (alter).');
             // OR use migrations: npx sequelize-cli db:migrate (safer)
        }


        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
            console.log(`Allowed frontend origins (CORS): ${allowedOrigins.join(', ')}`);
            console.log(`M-Pesa Environment: ${process.env.MPESA_ENVIRONMENT}`);
            console.log(`M-Pesa Callback URL: ${process.env.MPESA_CALLBACK_URL}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
        process.exit(1); // Exit if database connection fails
    }
};

startServer();