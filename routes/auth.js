const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Registration endpoint (GET /api/auth/register)
router.get('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.query;

    // Validate required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create new user
    user = new User({
      fullname,
      email: email.toLowerCase(),
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login endpoint (GET /api/auth/login)
router.get('/login', async (req, res) => {
  try {
    const { email, password } = req.query;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// Get current user endpoint (GET /api/auth/me)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ msg: 'Server error getting user data' });
  }
});

// Logout endpoint (GET /api/auth/logout)
router.get('/logout', auth, async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ msg: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ msg: 'Server error during logout' });
  }
});

// Delete account endpoint (GET /api/auth/delete)
router.get('/delete', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.clearCookie('token');
    res.json({ msg: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ msg: 'Server error deleting account' });
  }
});

module.exports = router;
