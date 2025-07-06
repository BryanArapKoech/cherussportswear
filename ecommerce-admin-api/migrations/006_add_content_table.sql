-- migrations/006_add_content_table.sql

DROP TABLE IF EXISTS marketing_content;

CREATE TABLE marketing_content (
    slug VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body_html TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed with some sample pages
INSERT INTO marketing_content (slug, title, body_html) VALUES
    ('homepage-banner', 'Homepage Promotional Banner', '<h1>SummerSpecial Sale!</h1><p>Get 20% off all sneakers this week!</p>'),
    ('holiday-sale', 'Holiday Sale Page', '<h2>Our Biggest Holiday Sale Ever!</h2><p>Details coming soon.</p>');

-- Add the required permissions to the super_admin role
UPDATE roles
SET permissions = '{"permissions": ["*", "read:settings", "write:settings", "read:analytics", "read:content", "write:content"]}'
WHERE name = 'super_admin';