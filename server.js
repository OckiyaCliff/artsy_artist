const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if the dist directory exists
const distPath = path.join(__dirname, 'dist/artsy-app');
const distExists = fs.existsSync(distPath);

if (distExists) {
  console.log('Serving static files from:', distPath);
  app.use(express.static(distPath));
} else {
  console.log('Warning: dist/artsy-app directory not found. Run "npm run build" to create it.');
}

// Artsy API credentials
const clientID = process.env.ARTSY_CLIENT_ID;
const clientSecret = process.env.ARTSY_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  console.error('Error: Artsy API credentials not found in .env file');
  console.error('Please make sure ARTSY_CLIENT_ID and ARTSY_CLIENT_SECRET are set in your .env file');
}

let accessToken = null;
let tokenExpiry = null;

// Function to get Artsy API token
async function getArtsyToken() {
  try {
    // Check if token is still valid
    if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
      console.log('Using existing token (valid until:', tokenExpiry, ')');
      return accessToken;
    }

    console.log('Requesting new Artsy API token...');
    
    // Get new token
    const response = await axios({
      method: 'post',
      url: 'https://api.artsy.net/api/tokens/xapp_token',
      data: {
        client_id: clientID,
        client_secret: clientSecret
      }
    });

    console.log('Token response status:', response.status);
    
    if (response.data && response.data.token) {
      accessToken = response.data.token;
      // Set expiry time (typically 60 days, but we'll set it to expire in 24 hours to be safe)
      tokenExpiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      console.log('Successfully obtained new token, valid until:', tokenExpiry);
      return accessToken;
    } else {
      console.error('Invalid token response:', response.data);
      throw new Error('Invalid token response from Artsy API');
    }
  } catch (error) {
    console.error('Error getting Artsy token:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// API endpoint to search for artists
app.get('/api/artists/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const token = await getArtsyToken();
    const response = await axios.get(`https://api.artsy.net/api/search`, {
      headers: {
        'X-Xapp-Token': token
      },
      params: {
        q: query,
        type: 'artist',
        size: 10
      }
    });

    console.log('Artist search successful for query:', query);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching artists:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to search artists', 
      details: error.message,
      status: error.response?.status
    });
  }
});

// API endpoint to get artist details
app.get('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getArtsyToken();
    
    const response = await axios.get(`https://api.artsy.net/api/artists/${id}`, {
      headers: {
        'X-Xapp-Token': token
      }
    });

    console.log('Successfully retrieved details for artist ID:', id);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting artist details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get artist details', 
      details: error.message,
      status: error.response?.status
    });
  }
});

// API endpoint to get artist's artworks
app.get('/api/artists/:id/artworks', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getArtsyToken();
    
    const response = await axios.get(`https://api.artsy.net/api/artworks`, {
      headers: {
        'X-Xapp-Token': token
      },
      params: {
        artist_id: id,
        size: 10
      }
    });

    console.log('Successfully retrieved artworks for artist ID:', id);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting artist artworks:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get artist artworks', 
      details: error.message,
      status: error.response?.status
    });
  }
});

// API endpoint to get artwork details
app.get('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getArtsyToken();
    
    const response = await axios.get(`https://api.artsy.net/api/artworks/${id}`, {
      headers: {
        'X-Xapp-Token': token
      }
    });

    console.log('Successfully retrieved details for artwork ID:', id);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting artwork details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get artwork details', 
      details: error.message,
      status: error.response?.status
    });
  }
});

// API endpoint to get artwork categories (genes)
app.get('/api/genes', async (req, res) => {
  try {
    const { artwork_id } = req.query;
    
    if (!artwork_id) {
      return res.status(400).json({ error: 'Artwork ID is required' });
    }
    
    const token = await getArtsyToken();
    
    const response = await axios.get(`https://api.artsy.net/api/genes`, {
      headers: {
        'X-Xapp-Token': token
      },
      params: {
        artwork_id: artwork_id
      }
    });

    console.log('Successfully retrieved categories for artwork ID:', artwork_id);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting artwork categories:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get artwork categories', 
      details: error.message,
      status: error.response?.status
    });
  }
});

// Catch-all route to serve the Angular app
app.get('*', (req, res) => {
  if (distExists) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).send('Application not built. Please run "npm run build" to create the dist directory.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  if (distExists) {
    console.log(`Frontend available at http://localhost:${PORT}`);
  } else {
    console.log(`Frontend not available - dist directory missing. Run "npm run build" first.`);
  }
});
