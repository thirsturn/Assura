-- 1. Statuses Table
CREATE TABLE IF NOT EXISTS statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT 'gray'
);

INSERT INTO statuses (name, color) VALUES 
('Ready to Deploy', 'green'),
('Deployed', 'blue'),
('Broken', 'red'),
('In Repair', 'orange'),
('Retired', 'gray')
ON DUPLICATE KEY UPDATE name=name;

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);

INSERT INTO locations (name, address) VALUES 
('Headquarters', '123 Main St, New York, NY'),
('Warehouse A', '456 Industrial Pkwy, Jersey City, NJ'),
('Branch Office', '789 Market St, San Francisco, CA')
ON DUPLICATE KEY UPDATE name=name;

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO departments (name) VALUES 
('IT'),
('HR'),
('Finance'),
('Operations'),
('Sales')
ON DUPLICATE KEY UPDATE name=name;

-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

INSERT INTO suppliers (name, contact_person, email, phone) VALUES 
('Dell Inc.', 'John Doe', 'support@dell.com', '1-800-DELL'),
('Apple', 'Jane Smith', 'business@apple.com', '1-800-APPLE'),
('HP Enterprise', 'Bob Johnson', 'sales@hpe.com', '1-800-HPE')
ON DUPLICATE KEY UPDATE name=name;

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    category VARCHAR(50),
    description TEXT,
    image_path VARCHAR(255)
);

INSERT INTO products (name, manufacturer, model, category, description) VALUES 
('Dell XPS 15', 'Dell', 'XPS 9500', 'Laptop', 'High-performance laptop'),
('MacBook Pro 16', 'Apple', 'M1 Max', 'Laptop', 'Professional laptop for creatives'),
('HP LaserJet Pro', 'HP', 'M404n', 'Printer', 'Office laser printer')
ON DUPLICATE KEY UPDATE name=name;

-- 6. Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL UNIQUE,
    asset_name VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    product_id INT,
    status_id INT,
    location_id INT,
    department_id INT,
    supplier_id INT,
    purchase_date DATE,
    purchase_cost DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    warranty_expiration_date DATE,
    order_number VARCHAR(50),
    schedule_audit DATE,
    notes TEXT,
    image_path VARCHAR(255),
    qr_code_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Seed some initial assets
INSERT INTO assets (asset_id, asset_name, serial_number, product_id, status_id, location_id, department_id, supplier_id, purchase_date, purchase_cost, warranty_expiration_date) VALUES 
('AST-001', 'John\'s Laptop', 'SN-123456', 1, 2, 1, 1, 1, '2023-01-15', 1500.00, '2026-01-15'),
('AST-002', 'Design Workstation', 'SN-789012', 2, 1, 1, 5, 2, '2023-03-20', 2500.00, '2024-03-20'),
('AST-003', 'Office Printer', 'SN-345678', 3, 1, 2, 4, 3, '2022-11-10', 400.00, '2023-11-10')
ON DUPLICATE KEY UPDATE asset_id=asset_id;
