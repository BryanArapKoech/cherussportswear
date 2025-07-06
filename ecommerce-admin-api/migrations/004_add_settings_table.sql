-- migrations/004_add_settings_table.sql

-- Drop the table if it exists to make this script rerunnable
DROP TABLE IF EXISTS settings;

-- Create the settings table
CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the table with some default settings for testing
INSERT INTO settings (key, value, description) VALUES
    ('site_name', '"E-commerce Store"', 'The public name of the website.'),
    ('maintenance_mode', 'false', 'Enable or disable the customer-facing storefront.'),
    ('tax_rate', '0.08', 'The default sales tax rate as a decimal.'),
    ('shipping_rate', '200', 'The flat rate for standard shipping in Kshs.');

-- Add the required permission to the super_admin role
UPDATE roles
SET permissions = '{"permissions": ["*", "read:settings", "write:settings", "read:analytics"]}'
WHERE name = 'super_admin';