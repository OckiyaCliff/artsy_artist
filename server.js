const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const auth = require('./middleware/auth');

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:4200',
  credentials: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Check if the dist directory exists
const distPath = path.join(__dirname, 'dist/artsy-app/browser');
const distExists = fs.existsSync(distPath);

if (distExists) {
  console.log('Serving static files from:', distPath);
  app.use(express.static(distPath));
} else {
  console.log('Warning: dist/artsy-app/browser directory not found. Run "npm run build" to create it.');
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));

// Artsy API token management
let artsyToken = null;
let tokenExpiration = null;

async function getArtsyToken() {
  try {
    // Check if we have a valid token
    if (artsyToken && tokenExpiration && Date.now() < tokenExpiration) {
      return artsyToken;
    }

    // Get new token
    const response = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
      client_id: process.env.ARTSY_CLIENT_ID,
      client_secret: process.env.ARTSY_CLIENT_SECRET
    });

    artsyToken = response.data.token;
    tokenExpiration = Date.now() + (response.data.expires_in * 1000);
    return artsyToken;
  } catch (error) {
    console.error('Error getting Artsy token:', error);
    throw error;
  }
}

// Artist search endpoint
app.get('/api/artists/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const token = await getArtsyToken();
    const response = await axios.get(`https://api.artsy.net/api/search?q=${encodeURIComponent(query)}&type=artist`, {
      headers: {
        'X-Xapp-Token': token
      }
    });

    res.json(response.data._embedded.results);
  } catch (error) {
    console.error('Artist search error:', error);
    res.status(500).json({ msg: 'Server error during artist search' });
  }
});

// Artist details endpoint
app.get('/api/artists/:id', async (req, res) => {
  try {
    const token = await getArtsyToken();
    const response = await axios.get(`https://api.artsy.net/api/artists/${req.params.id}`, {
      headers: {
        'X-Xapp-Token': token
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Artist details error:', error);
    res.status(500).json({ msg: 'Server error getting artist details' });
  }
});

// Similar artists endpoint (protected)
app.get('/api/artists/:id/similar', auth, async (req, res) => {
  try {
    const token = await getArtsyToken();
    const response = await axios.get(`https://api.artsy.net/api/artists/${req.params.id}/similar`, {
      headers: {
        'X-Xapp-Token': token
      }
    });

    res.json(response.data._embedded.artists);
  } catch (error) {
    console.error('Similar artists error:', error);
    res.status(500).json({ msg: 'Server error getting similar artists' });
  }
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  if (distExists) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('API available at http://localhost:' + PORT + '/api');
  console.log('Frontend available at http://localhost:' + PORT);
});
