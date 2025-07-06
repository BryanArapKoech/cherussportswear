-- migrations/003_add_customers_orders.sql

-- Drop tables in reverse order of creation to handle foreign key constraints
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;

-- Create the customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'processing', -- e.g., processing, shipped, delivered, cancelled
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL
);

-- Create a junction table for order items (many-to-many relationship between orders and products)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Seed roles with order-related permissions
INSERT INTO roles (id, name, permissions) 
VALUES 
    (5, 'order_manager', '{"permissions": ["read:orders", "write:orders", "read:customers", "read:products"]}')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    permissions = EXCLUDED.permissions;

-- Update support_agent to be able to read orders and customers
UPDATE roles SET permissions = '{"permissions": ["read:products", "read:orders", "read:customers"]}'
WHERE name = 'support_agent';