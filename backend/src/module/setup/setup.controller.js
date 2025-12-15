const bcrypt = require('bcryptjs');
const db = require('../../../config/db.config');

// Seed all initial data
exports.seedDatabase = async (req, res) => {
    try {
        // 1. Create Roles
        await db.query(`
            INSERT IGNORE INTO role (roleID, roleName) VALUES 
            (1, 'Admin'),
            (2, 'Manager'),
            (3, 'Employee'),
            (4, 'Superintendent'),
            (5, 'Auditor'),
            (6, 'Accountant'),
            (7, 'Storekeeper')
        `);

        // 2. Create Permissions
        await db.query(`
            INSERT IGNORE INTO permission (permissionName, description_) VALUES
            ('user.create', 'Create new users'),
            ('user.read', 'View user information'),
            ('user.update', 'Update user information'),
            ('user.delete', 'Delete users'),
            ('asset.create', 'Create new assets'),
            ('asset.read', 'View assets'),
            ('asset.update', 'Update assets'),
            ('asset.delete', 'Delete assets'),
            ('asset.transfer', 'Transfer assets between divisions'),
            ('asset.dispose', 'Dispose assets'),
            ('division.manage', 'Manage divisions'),
            ('report.view', 'View reports'),
            ('report.generate', 'Generate reports'),
            ('audit.perform', 'Perform audits'),
            ('inventory.manage', 'Manage inventory')
        `);

        // 3. Create Divisions (FIXED: Added missing commas)
        await db.query(`
            INSERT IGNORE INTO division (divisionID, divisionName, locationCode) VALUES
            (1, 'Communication Engineering', 'CE-001'),
            (2, 'Electronics and Microelectronics', 'EM-001'),
            (3, 'Information Technology', 'IT-001'),
            (4, 'Industrial Services', 'IS-001'),
            (5, 'Space Applications', 'SA-001'),
            (6, 'Astronomy', 'A-001')
        `);

        // 4. Create Test Users
        const users = [
            { username: 'admin', password: 'admin123', firstName: 'System', lastName: 'Administrator', roleID: 1, divisionID: 1 },
            { username: 'manager_ce', password: 'manager123', firstName: 'John', lastName: 'Smith', roleID: 2, divisionID: 1 },
            { username: 'manager_em', password: 'manager123', firstName: 'Sarah', lastName: 'Johnson', roleID: 2, divisionID: 2 },
            { username: 'manager_it', password: 'manager123', firstName: 'Michael', lastName: 'Brown', roleID: 2, divisionID: 3 },
            { username: 'employee1', password: 'emp123', firstName: 'Jane', lastName: 'Doe', roleID: 3, divisionID: 1 },
            { username: 'employee2', password: 'emp123', firstName: 'Bob', lastName: 'Wilson', roleID: 3, divisionID: 2 },
            { username: 'superintendent1', password: 'super123', firstName: 'David', lastName: 'Lee', roleID: 4, divisionID: 3 },
            { username: 'auditor1', password: 'audit123', firstName: 'Alice', lastName: 'Taylor', roleID: 5, divisionID: 4 },
            { username: 'accountant1', password: 'acc123', firstName: 'Emma', lastName: 'Davis', roleID: 6, divisionID: 5 },
            { username: 'storekeeper1', password: 'store123', firstName: 'Tom', lastName: 'Harris', roleID: 7, divisionID: 6 }
        ];

        for (const user of users) {
            const passwordHash = await bcrypt.hash(user.password, 10);
            await db.query(`
                INSERT IGNORE INTO user (username, passwordHash, firstName, lastName, roleID, divisionID) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [user.username, passwordHash, user.firstName, user.lastName, user.roleID, user.divisionID]);
        }

        // 5. Assign Permissions to Roles
        // Admin gets all permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 1, permissionID FROM permission
        `);

        // Manager gets limited permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 2, permissionID FROM permission 
            WHERE permissionName IN ('user.read', 'asset.create', 'asset.read', 'asset.update', 'asset.transfer', 'report.view', 'report.generate')
        `);

        // Employee gets basic permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 3, permissionID FROM permission 
            WHERE permissionName IN ('asset.read', 'report.view')
        `);

        // Superintendent permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 4, permissionID FROM permission 
            WHERE permissionName IN ('asset.read', 'asset.update', 'asset.transfer', 'report.view', 'inventory.manage')
        `);

        // Auditor permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 5, permissionID FROM permission 
            WHERE permissionName IN ('asset.read', 'report.view', 'report.generate', 'audit.perform')
        `);

        // Accountant permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 6, permissionID FROM permission 
            WHERE permissionName IN ('asset.read', 'report.view', 'report.generate')
        `);

        // Storekeeper permissions
        await db.query(`
            INSERT IGNORE INTO rolePermission (roleID, permissionID)
            SELECT 7, permissionID FROM permission 
            WHERE permissionName IN ('asset.read', 'asset.update', 'inventory.manage')
        `);

        // 6. Set Division Heads
        await db.query(`UPDATE division SET headOfDivisionID = 2 WHERE divisionID = 1`);
        await db.query(`UPDATE division SET headOfDivisionID = 3 WHERE divisionID = 2`);
        await db.query(`UPDATE division SET headOfDivisionID = 4 WHERE divisionID = 3`);

        res.json({
            message: 'Database seeded successfully',
            data: {
                roles: ['Admin', 'Manager', 'Employee', 'Superintendent', 'Auditor', 'Accountant', 'Storekeeper'],
                divisions: ['Communication Engineering', 'Electronics and Microelectronics', 'Information Technology', 'Industrial Services', 'Space Applications', 'Astronomy'],
                users: users.map(u => ({
                    username: u.username,
                    password: u.password,
                    role: ['', 'Admin', 'Manager', 'Employee', 'Superintendent', 'Auditor', 'Accountant', 'Storekeeper'][u.roleID],
                    divisionID: u.divisionID
                }))
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ message: 'Seed failed', error: error.message });
    }
};