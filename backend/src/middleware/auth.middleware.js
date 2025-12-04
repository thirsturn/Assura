const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.config');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, authConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// role based access by role name
exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const userRole = req.user.role?.toLowerCase();
        const allowed = allowedRoles.map(r => r.toLowerCase());

        if (!allowed.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

// Permission-based access (for fine-grained control)
exports.requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const db = require('../../config/db.config');
            
            const [permissions] = await db.query(
                `SELECT p.permissionName 
                 FROM permission p
                 JOIN rolePermission rp ON p.permissionID = rp.permissionID
                 WHERE rp.roleID = ?`,
                [req.user.roleID]
            );

            const hasPermission = permissions.some(
                p => p.permissionName.toLowerCase() === permissionName.toLowerCase()
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};