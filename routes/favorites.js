const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const axios = require('axios');

// Function to get Artsy API token (reused from server.js)
async function getArtsyToken() {
  try {
    // Check if token is still valid
    if (global.accessToken && global.tokenExpiry && new Date() < global.tokenExpiry) {
      return global.accessToken;
    }

    // Get new token
    const response = await axios({
      method: 'post',
      url: 'https://api.artsy.net/api/tokens/xapp_token',
      data: {
        client_id: process.env.ARTSY_CLIENT_ID,
        client_secret: process.env.ARTSY_CLIENT_SECRET
      }
    });
    
    if (response.data && response.data.token) {
      global.accessToken = response.data.token;
      // Set expiry time (typically 60 days, but we'll set it to expire in 24 hours to be safe)
      global.tokenExpiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      return global.accessToken;
    } else {
      throw new Error('Invalid token response from Artsy API');
    }
  } catch (error) {
    console.error('Error getting Artsy token:', error.message);
    throw error;
  }
}

// Get user's favorite artists with details
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get details for each favorite artist from Artsy API
    const artistDetails = await Promise.all(
      user.favorites.map(async (artistId) => {
        try {
          const token = await getArtsyToken();
          const response = await axios.get(`https://api.artsy.net/api/artists/${artistId}`, {
            headers: {
              'X-Xapp-Token': token
            }
          });
          return {
            id: artistId,
            name: response.data.name,
            nationality: response.data.nationality,
            birthday: response.data.birthday,
            thumbnail: response.data._links.thumbnail?.href
          };
        } catch (error) {
          console.error(`Error fetching artist ${artistId}:`, error);
          return {
            id: artistId,
            name: 'Unknown Artist',
            error: 'Failed to load artist details'
          };
        }
      })
    );

    res.json(artistDetails);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ msg: 'Server error getting favorites' });
  }
});

// Add artist to favorites
router.post('/add', auth, async (req, res) => {
  try {
    const { artistId } = req.body;
    if (!artistId) {
      return res.status(400).json({ msg: 'Artist ID is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if artist is already in favorites
    if (user.favorites.includes(artistId)) {
      return res.status(400).json({ msg: 'Artist already in favorites' });
    }

    user.favorites.push(artistId);
    await user.save();

    res.json({ msg: 'Artist added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ msg: 'Server error adding to favorites' });
  }
});

// Remove artist from favorites
router.post('/remove', auth, async (req, res) => {
  try {
    const { artistId } = req.body;
    if (!artistId) {
      return res.status(400).json({ msg: 'Artist ID is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const index = user.favorites.indexOf(artistId);
    if (index === -1) {
      return res.status(400).json({ msg: 'Artist not in favorites' });
    }

    user.favorites.splice(index, 1);
    await user.save();

    res.json({ msg: 'Artist removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ msg: 'Server error removing from favorites' });
  }
});

module.exports = router;
