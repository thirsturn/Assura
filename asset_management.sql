-- Create Database
CREATE DATABASE IF NOT EXISTS asset_management;
USE asset_management;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS statuses;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS suppliers;

-- Create Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Statuses table
CREATE TABLE statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Locations table
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Assets table
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255),
    serial_number VARCHAR(100),
    product_id INT,
    status_id INT,
    location_id INT,
    department_id INT,
    supplier_id INT,
    purchase_date DATE,
    purchase_cost DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    warranty_expiration_date DATE,
    order_number VARCHAR(100),
    schedule_audit VARCHAR(50),
    notes TEXT,
    image_path VARCHAR(500),
    qr_code_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Insert sample data for Products
INSERT INTO products (name, description, manufacturer) VALUES
('iPad Pro', '12.9-inch iPad Pro', 'Apple'),
('XPS 13', 'Dell XPS 13 Laptop', 'Dell'),
('ThinkPad E15 G4', 'Lenovo ThinkPad E15', 'Lenovo'),
('iPhone 16 Pro Max', 'iPhone 16 Pro Max', 'Apple'),
('MacBook Pro', '16-inch MacBook Pro', 'Apple');

-- Insert sample data for Statuses
INSERT INTO statuses (name, color) VALUES
('Ready to Deploy', '#00C9A7'),
('Deployed', '#2196F3'),
('Broken', '#F44336'),
('In Repair', '#FF9800'),
('Retired', '#9E9E9E');

-- Insert sample data for Locations
INSERT INTO locations (name, address, city, country) VALUES
('Singapore Office', '1 Marina Boulevard', 'Singapore', 'Singapore'),
('Palo Alto Office', '1600 Amphitheatre Parkway', 'Palo Alto', 'USA'),
('Berlin Office', 'Unter den Linden 1', 'Berlin', 'Germany'),
('Tokyo Office', '1-1 Marunouchi', 'Tokyo', 'Japan');

-- Insert sample data for Departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology'),
('HR', 'Human Resources'),
('Finance', 'Finance Department'),
('Marketing', 'Marketing Department'),
('Operations', 'Operations Department');

-- Insert sample data for Suppliers
INSERT INTO suppliers (name, contact_person, email, phone) VALUES
('Apple Inc.', 'John Doe', 'john@apple.com', '+1-800-275-2273'),
('Dell Technologies', 'Jane Smith', 'jane@dell.com', '+1-800-289-3355'),
('Lenovo', 'Mike Johnson', 'mike@lenovo.com', '+1-855-253-6686'),
('HP Inc.', 'Sarah Wilson', 'sarah@hp.com', '+1-800-474-6836');

-- Verify data
SELECT 'Products' as Table_Name, COUNT(*) as Count FROM products
UNION ALL
SELECT 'Statuses', COUNT(*) FROM statuses
UNION ALL
SELECT 'Locations', COUNT(*) FROM locations
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers;