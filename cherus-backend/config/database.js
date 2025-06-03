require('dotenv').config(); // Load .env variables

// Configuration object expected by Sequelize CLI and used by the application
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    // Optional: Add logging, dialect options etc.
    // logging: console.log,
  },
  // Add configurations for 'test' and 'production' environments
  // Production should use environment variables set by your hosting provider
  production: {
    use_env_variable: 'DATABASE_URL', // Heroku, Render etc. often provide this
    dialect: 'postgres',
    dialectOptions: { // Example for production SSL
      ssl: {
        require: true,
        // rejectUnauthorized: false 
        rejectUnauthorized: true
      }
    },
    // logging: false,
  }
};