-- migrations/005_seed_sample_orders.sql

-- Create a sample customer if they don't exist
INSERT INTO customers (id, name, email, address)
VALUES (1, 'John Doe', 'john.doe@example.com', '123 Main St, Anytown, USA')
ON CONFLICT (id) DO NOTHING;

-- Create some sample orders for the customer
-- We are manually setting IDs to make them predictable for testing.
INSERT INTO orders (id, customer_id, status, total_amount, shipping_address)
VALUES
    (1, 1, 'delivered', 199.98, '123 Main St, Anytown, USA'),
    (2, 1, 'shipped', 99.99, '123 Main St, Anytown, USA'),
    (3, 1, 'processing', 299.97, '123 Main St, Anytown, USA')
ON CONFLICT (id) DO NOTHING;