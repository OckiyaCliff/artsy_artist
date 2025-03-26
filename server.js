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

// Mock data for artists
const mockArtists = [
  {
    id: 'pablo-picasso',
    name: 'Pablo Picasso',
    birthday: '1881',
    deathday: '1973',
    nationality: 'Spanish',
    biography: 'Pablo Picasso was a Spanish painter, sculptor, printmaker, ceramicist, and theatre designer who spent most of his adult life in France. One of the most influential artists of the 20th century, he is known for co-founding the Cubist movement.',
    imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/i3rCA3IaKE-cLBnc-U5swQ/large.jpg'
  },
  {
    id: 'vincent-van-gogh',
    name: 'Vincent van Gogh',
    birthday: '1853',
    deathday: '1890',
    nationality: 'Dutch',
    biography: 'Vincent Willem van Gogh was a Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.',
    imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/F9DTHbYXeqTqFW2vJjjbEQ/large.jpg'
  },
  {
    id: 'claude-monet',
    name: 'Claude Monet',
    birthday: '1840',
    deathday: '1926',
    nationality: 'French',
    biography: 'Claude Monet was a French painter and founder of impressionist painting who is seen as a key precursor to modernism, especially in his attempts to paint nature as he perceived it.',
    imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/IG8ZLvVmZgQiTn2zK0Bp8w/large.jpg'
  },
  {
    id: 'leonardo-da-vinci',
    name: 'Leonardo da Vinci',
    birthday: '1452',
    deathday: '1519',
    nationality: 'Italian',
    biography: 'Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor, and architect.',
    imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/0-QXL43Ox2QgwZ0nNtQlUQ/large.jpg'
  },
  {
    id: 'frida-kahlo',
    name: 'Frida Kahlo',
    birthday: '1907',
    deathday: '1954',
    nationality: 'Mexican',
    biography: 'Frida Kahlo was a Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.',
    imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/c5mj0_9eQ9cgFiz4XrF8WA/large.jpg'
  }
];

// Mock data for artworks
const mockArtworks = {
  'pablo-picasso': [
    {
      id: 'picasso-guernica',
      title: 'Guernica',
      date: '1937',
      medium: 'Oil on canvas',
      dimensions: '349.3 × 776.6 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/ixwMXu7J_RHhpY-w4kDNpA/large.jpg'
    },
    {
      id: 'picasso-les-demoiselles',
      title: 'Les Demoiselles d\'Avignon',
      date: '1907',
      medium: 'Oil on canvas',
      dimensions: '243.9 × 233.7 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/l6t_jrJQm8QwlrKr0XNE8w/large.jpg'
    }
  ],
  'vincent-van-gogh': [
    {
      id: 'van-gogh-starry-night',
      title: 'The Starry Night',
      date: '1889',
      medium: 'Oil on canvas',
      dimensions: '73.7 × 92.1 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/qJ8Xy2O4cVVMoTAkUmUEEA/large.jpg'
    },
    {
      id: 'van-gogh-sunflowers',
      title: 'Sunflowers',
      date: '1888',
      medium: 'Oil on canvas',
      dimensions: '92.1 × 73 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/Z2rT5Ck9_qYdnkCnOW9Qpw/large.jpg'
    }
  ],
  'claude-monet': [
    {
      id: 'monet-water-lilies',
      title: 'Water Lilies',
      date: '1919',
      medium: 'Oil on canvas',
      dimensions: '100 × 200 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/qJ8Xy2O4cVVMoTAkUmUEEA/large.jpg'
    },
    {
      id: 'monet-impression-sunrise',
      title: 'Impression, Sunrise',
      date: '1872',
      medium: 'Oil on canvas',
      dimensions: '48 × 63 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/3M95JnbrJXN-X3KYYgg-vw/large.jpg'
    }
  ],
  'leonardo-da-vinci': [
    {
      id: 'da-vinci-mona-lisa',
      title: 'Mona Lisa',
      date: '1503-1519',
      medium: 'Oil on poplar panel',
      dimensions: '77 × 53 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/miBQR7tQdJWpuPfJaGzlYA/large.jpg'
    },
    {
      id: 'da-vinci-last-supper',
      title: 'The Last Supper',
      date: '1495-1498',
      medium: 'Tempera on gesso, pitch, and mastic',
      dimensions: '460 × 880 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/jImHPm-B_7sKGdUjJlfJHg/large.jpg'
    }
  ],
  'frida-kahlo': [
    {
      id: 'kahlo-two-fridas',
      title: 'The Two Fridas',
      date: '1939',
      medium: 'Oil on canvas',
      dimensions: '173.5 × 173 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/wJ6Xt_R2aV-rKfzwrr0cXw/large.jpg'
    },
    {
      id: 'kahlo-self-portrait',
      title: 'Self-Portrait with Thorn Necklace and Hummingbird',
      date: '1940',
      medium: 'Oil on canvas',
      dimensions: '61.25 × 47 cm',
      imageUrl: 'https://d32dm0rphc51dk.cloudfront.net/0-QXL43Ox2QgwZ0nNtQlUQ/large.jpg'
    }
  ]
};

// API endpoint to search for artists
app.get('/api/artists/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Filter mock artists based on the query
    const filteredArtists = mockArtists.filter(artist => 
      artist.name.toLowerCase().includes(query.toLowerCase()) || 
      artist.nationality.toLowerCase().includes(query.toLowerCase())
    );

    // Format the response to match the expected format
    const response = {
      _embedded: {
        results: filteredArtists.map(artist => ({
          ...artist,
          type: 'Artist'
        }))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching artists:', error.message);
    res.status(500).json({ error: 'Failed to search artists', details: error.message });
  }
});

// API endpoint to get artist details
app.get('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artist = mockArtists.find(a => a.id === id);
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.json(artist);
  } catch (error) {
    console.error('Error getting artist details:', error.message);
    res.status(500).json({ error: 'Failed to get artist details', details: error.message });
  }
});

// API endpoint to get artist's artworks
app.get('/api/artists/:id/artworks', async (req, res) => {
  try {
    const { id } = req.params;
    const artworks = mockArtworks[id] || [];
    
    // Format the response to match the expected format
    const response = {
      _embedded: {
        artworks: artworks
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting artist artworks:', error.message);
    res.status(500).json({ error: 'Failed to get artist artworks', details: error.message });
  }
});

// API endpoint to get artwork details
app.get('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the artwork in all artists' artworks
    let artwork = null;
    for (const artistId in mockArtworks) {
      const found = mockArtworks[artistId].find(a => a.id === id);
      if (found) {
        artwork = found;
        break;
      }
    }
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    res.json(artwork);
  } catch (error) {
    console.error('Error getting artwork details:', error.message);
    res.status(500).json({ error: 'Failed to get artwork details', details: error.message });
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
