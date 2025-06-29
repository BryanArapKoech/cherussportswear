-- migrations/001_initial_admin_schema.sql

-- Drop tables in reverse order of creation to handle foreign key constraints
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS roles;

-- Create the roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB
);

-- Create the admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    mfa_secret VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the audit_logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id),
    action VARCHAR(255) NOT NULL,
    target_resource VARCHAR(255),
    target_id INTEGER,
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);