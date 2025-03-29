const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user from payload
      req.user = decoded;
      next();
    } catch (err) {
      res.clearCookie('token');
      return res.status(401).json({ msg: 'Token is invalid or expired' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ msg: 'Server error in auth middleware' });
  }
};

module.exports = auth;
