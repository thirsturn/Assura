const bcrypt = require('bcryptjs');
const db = require('../../../config/db.config');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, password, firstName, lastName, roleID, divisionID } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const [result] = await db.query(
            `INSERT INTO user (username, passwordHash, firstName, lastName, roleID, divisionID) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, passwordHash, firstName, lastName, roleID, divisionID]
        );

        res.status(201).json({
            message: 'User created successfully',
            userID: result.insertId
        });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.userID, u.username, u.firstName, u.lastName, 
                    u.isBlocked, u.isOnline, u.lastLogin,
                    r.roleName, d.divisionName
             FROM user u
             LEFT JOIN role r ON u.roleID = r.roleID
             LEFT JOIN division d ON u.divisionID = d.divisionID`
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query(
            `SELECT u.userID, u.username, u.firstName, u.lastName, 
                    u.isBlocked, u.isOnline, u.lastLogin,
                    r.roleName, d.divisionName
             FROM user u
             LEFT JOIN role r ON u.roleID = r.roleID
             LEFT JOIN division d ON u.divisionID = d.divisionID
             WHERE u.userID = ?`,
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const query = `
        SELECT 
                u.userID,
                u.username,
                u.firstName,
                u.lastName,
                u.profilePicture,
                r.roleName,
                d.divisionID,
                d.locationCode as divisionName,
                u.isBlocked,
                u.isOnline,
                u.createdAt,
                u.lastLogin
            FROM user u
            LEFT JOIN role r ON u.roleID = r.roleID
            LEFT JOIN division d ON u.divisionID = d.divisionID
            WHERE u.userID = ?
        `;

        const [rows] = await db.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// update user
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, profilePicture } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }

        const query = `
            UPDATE user 
            SET firstName = ?, lastName = ?, profilePicture = ?
            WHERE userID = ?
        `;

        await db.query(query, [firstName, lastName, profilePicture || null, userId]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
}