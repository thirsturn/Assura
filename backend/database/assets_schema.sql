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



-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);



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



-- 6. Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL UNIQUE,
    asset_name VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    product_id INT,
    status_id INT,

    division_id INT,
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

    FOREIGN KEY (division_id) REFERENCES division(divisionID) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);



