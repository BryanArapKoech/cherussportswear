-- migrations/007_add_indexes.sql

-- Index on admins table for fast email lookups during login
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Index on foreign key in the admins table
CREATE INDEX IF NOT EXISTS idx_admins_role_id ON admins(role_id);

-- Indexes on foreign keys in the audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Index on products table for fast SKU lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Indexes on foreign keys in the orders table
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Indexes on foreign keys in the order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);