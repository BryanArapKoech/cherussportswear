require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); 
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// --- Middleware ---
const authMiddleware = require('./middleware/authMiddleware');


// --- START: Helmet Security Headers ---

app.use(helmet());

// Content Security Policy (CSP) configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // By default, only allow content from the same origin
      scriptSrc: [
        "'self'", // Allow scripts from own origin
        "https://cdn.jsdelivr.net", // For Bootstrap JS (from login.html)
        "https://cdnjs.cloudflare.com" // For Font Awesome (from login.html)
        // Add other trusted CDNs or script sources frontend uses them.
       
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", 
        "https://cdn.jsdelivr.net", 
        "https://cdnjs.cloudflare.com", 
        "https://fonts.googleapis.com", // For Remixicon fonts 
        "https://cdn.jsdelivr.net" 
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com", // For Google Fonts (Remixicon)
        "https://cdn.jsdelivr.net", // For Remixicon fonts 
        "https://cdnjs.cloudflare.com" // For Font Awesome fonts
      ],
      imgSrc: ["'self'", "data:"], // Allow images from own origin and data URIs. 
      connectSrc: [
        "'self'", // Allow XHR/fetch to own origin
        
        // For M-Pesa sandbox/production, if calls are made from frontend:
        // 'https://sandbox.safaricom.co.ke',
        // 'https://api.safaricom.co.ke'
      ],
      frameSrc: ["'none'"], 
      objectSrc: ["'none'"], // Disallow <object>, <embed>, <applet>
      
    },
  })
);
// --- END: Helmet Security Headers ---


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

// Basic Logging Middleware 
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// --- START: Rate Limiting Configuration ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs to /api/auth/login
    message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // keyGenerator: (req, res) => req.ip, 
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: { success: false, message: 'Too many accounts created from this IP, please try again after an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// --- END: Rate Limiting Configuration ---

// --- API Routes ---
app.use('/api/orders', orderRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

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
             // await db.sequelize.sync({ alter: true }); 
             // console.log('Database synchronized (alter).');
             
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