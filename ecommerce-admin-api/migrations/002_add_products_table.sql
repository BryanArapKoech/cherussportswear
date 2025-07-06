-- migrations/002_add_products_table.sql

-- Drop the table if it exists to make this script rerunnable
DROP TABLE IF EXISTS products;

-- Create the products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    inventory_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --- SAFER ROLE SEEDING ---

-- Step 1: Handle potential name conflicts before inserting/updating.
-- This renames any existing conflicting roles to something temporary.
UPDATE roles SET name = 'product_manager_old' WHERE name = 'product_manager' AND id != 3;
UPDATE roles SET name = 'support_agent_old' WHERE name = 'support_agent' AND id != 4;

-- Step 2: Now it is safe to insert or update our required roles with the correct IDs and names.
INSERT INTO roles (id, name, permissions) 
VALUES 
    (3, 'product_manager', '{"permissions": ["read:products", "write:products"]}')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    permissions = EXCLUDED.permissions;

INSERT INTO roles (id, name, permissions)
VALUES
    (4, 'support_agent', '{"permissions": ["read:products"]}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    permissions = EXCLUDED.permissions;