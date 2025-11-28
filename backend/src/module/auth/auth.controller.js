const db = require('../../../config/db.config'); // Adjust path based on your structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    // We assume your table is named 'user' based on your sql file
    const [rows] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate Token
    // SECRET should technically be in .env, but for now:
    const token = jwt.sign(
      { id: user.userID, role: user.roleID, division: user.divisionID },
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // 4. Send Response
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.userID,
        username: user.username,
        roleId: user.roleID,
        divisionId: user.divisionID
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};