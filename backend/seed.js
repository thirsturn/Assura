const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams'
};

async function seed() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        // Seed Statuses
        console.log('Seeding Statuses...');
        const statuses = [
            ['Ready to Deploy', '#28a745'],
            ['Deployed', '#007bff'],
            ['Broken', '#dc3545'],
            ['In Repair', '#ffc107'],
            ['Retired', '#6c757d']
        ];
        for (const [name, color] of statuses) {
            await connection.query(
                'INSERT IGNORE INTO statuses (name, color) VALUES (?, ?)',
                [name, color]
            );
        }

        // Seed Locations
        console.log('Seeding Locations...');
        const locations = [
            ['Main Office', '123 Main St', 'New York', 'USA'],
            ['Warehouse A', '456 Storage Ln', 'New Jersey', 'USA'],
            ['Branch Office', '789 Branch Rd', 'London', 'UK']
        ];
        for (const [name, address, city, country] of locations) {
            await connection.query(
                'INSERT IGNORE INTO locations (name, address, city, country) VALUES (?, ?, ?, ?)',
                [name, address, city, country]
            );
        }

        // Seed Departments
        console.log('Seeding Departments...');
        const departments = [
            ['IT', 'Information Technology'],
            ['HR', 'Human Resources'],
            ['Sales', 'Sales Department'],
            ['Finance', 'Finance Department']
        ];
        for (const [name, description] of departments) {
            await connection.query(
                'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
                [name, description]
            );
        }

        // Seed Products
        console.log('Seeding Products...');
        const products = [
            ['MacBook Pro 16"', 'Apple Laptop', 'Apple'],
            ['Dell XPS 15', 'Dell Laptop', 'Dell'],
            ['ThinkPad X1', 'Lenovo Laptop', 'Lenovo'],
            ['iPhone 14', 'Apple Smartphone', 'Apple'],
            ['Samsung Galaxy S23', 'Samsung Smartphone', 'Samsung']
        ];
        for (const [name, description, manufacturer] of products) {
            await connection.query(
                'INSERT IGNORE INTO products (name, description, manufacturer) VALUES (?, ?, ?)',
                [name, description, manufacturer]
            );
        }

        // Seed Suppliers
        console.log('Seeding Suppliers...');
        const suppliers = [
            ['Tech Vendor Inc', 'John Doe', 'john@techvendor.com', '123-456-7890', '100 Tech Blvd'],
            ['Office Supplies Co', 'Jane Smith', 'jane@officesupplies.com', '098-765-4321', '200 Paper St']
        ];
        for (const [name, contact, email, phone, address] of suppliers) {
            await connection.query(
                'INSERT IGNORE INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
                [name, contact, email, phone, address]
            );
        }

        console.log('Seeding completed successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seed();
