const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../../config/db.config');
const authConfig = require('../../../config/auth.config');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // join user with role table to get role name
    const [users] = await db.query(
      `SELECT
        u.userID,
        u.username,
        u.passwordHash,
        u.firstName,
        u.lastName,
        u.isBlocked,
        u.divisionID,
        r.roleID,
        r.roleName
      FROM user u
      LEFT JOIN role r ON u.roleID = r.roleID
      WHERE u.username = ?`,
      [username]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // check whether blocked or not
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your are blocked. Inquiry in progress...' });
    }

    // Verify password 
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Update the last login and online status
    await db.query(
      `UPDATE user SET lastLogin = NOW(), isOnline = TRUE WHERE userID = ?`,
      [user.userID]
    );

    // create token for role
    const token = jwt.sign(
      {
        id: user.userID,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleName?.toLowerCase() || 'user',
        roleID: user.roleID,
        divisionID: user.divisionID
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
      { id: user.userID },
      authConfig.refreshSecret || authConfig.secret,
      { expiresIn: '1h' }
    );

    //store refresh token
    await db.query(
      `UPDATE user SET refreshToken = ? WHERE userID = ?`,
      [refreshToken, user.userID]
    );

    res.json({
      message: 'Login success...',
      token,
      refreshToken,
      user: {
        id: user.userID,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleName?.toLowerCase() || 'user',
        roleID: user.roleID,
        divisionID: user.divisionID
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }

};

exports.logout = async (req, res) => {
  try {
    const userID = req.user.id;

    // Clear refresh token and set offline
    await db.query(
      'UPDATE user SET refreshToken = NULL, isOnline = FALSE, socketId = NULL WHERE userID = ?',
      [userID]
    );

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, authConfig.refreshSecret || authConfig.secret);

    // Check if refresh token matches in DB
    const [users] = await db.query(
      `SELECT u.*, r.roleName 
             FROM user u 
             LEFT JOIN role r ON u.roleID = r.roleID 
             WHERE u.userID = ? AND u.refreshToken = ?`,
      [decoded.id, refreshToken]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = users[0];

    // Generate new access token
    const newToken = jwt.sign(
      {
        id: user.userID,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleName?.toLowerCase() || 'user',
        roleID: user.roleID,
        divisionID: user.divisionID
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.verify = (req, res) => {
  res.json({ valid: true, user: req.user });
};