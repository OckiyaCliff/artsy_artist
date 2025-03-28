# Artsy Artist Search Application

A web application for searching and exploring artists from the Artsy API, with user authentication and favorites management.

## Features

- **User Authentication**
  - Registration with username, email, and password
  - Login with email and password
  - Logout functionality
  - Account deletion
  - Persistent authentication across page reloads and tabs using JWT tokens
  - Gravatar integration for user profile images

- **Artist Search**
  - Search for artists by name
  - View artist details and artworks
  - Similar artists recommendations

- **Favorites Management**
  - Add artists to favorites
  - Remove artists from favorites
  - View all favorite artists

## Technology Stack

- **Frontend**
  - Angular 16
  - TypeScript
  - Bootstrap 5
  - Angular Router for navigation
  - Reactive Forms for form handling

- **Backend**
  - Node.js
  - Express.js
  - MongoDB for data storage
  - Mongoose for MongoDB object modeling
  - JWT for authentication
  - bcrypt for password hashing
  - cookie-parser for handling cookies

- **APIs**
  - Artsy API for artist and artwork data
  - Gravatar API for user profile images

## Project Structure

```
artsy-app/
├── src/                      # Angular frontend code
│   ├── app/
│   │   ├── components/       # Angular components
│   │   │   ├── auth/         # Authentication components
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── profile/
│   │   │   ├── artist/       # Artist-related components
│   │   │   └── favorites/    # Favorites component
│   │   ├── services/         # Angular services
│   │   ├── guards/           # Route guards
│   │   └── models/           # TypeScript interfaces
│   ├── environments/         # Environment configuration
│   └── assets/               # Static assets
├── models/                   # MongoDB models
├── routes/                   # Express routes
├── middleware/               # Express middleware
└── server.js                 # Express server
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Artsy API credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
ARTSY_CLIENT_ID=your_artsy_client_id
ARTSY_CLIENT_SECRET=your_artsy_client_secret
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/artsy-app.git
   cd artsy-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the Angular application
   ```
   npm run build
   ```

4. Start the server
   ```
   node server.js
   ```

5. Access the application at `http://localhost:3000`

## Authentication System

The authentication system is built using JWT tokens stored in HTTP-only cookies, providing secure authentication that persists across page reloads and browser tabs.

### Registration Process

1. User submits registration form with username, email, and password
2. Server validates the input and checks if the email is already registered
3. If valid, the password is hashed using bcrypt
4. A Gravatar URL is generated based on the user's email
5. User data is saved to MongoDB
6. A JWT token is generated and stored in a cookie
7. User is redirected to the profile page

### Login Process

1. User submits login form with email and password
2. Server validates credentials against the database
3. If valid, a JWT token is generated and stored in a cookie
4. User is redirected to the profile page

### Authentication State

The frontend tracks the authentication state using the AuthService, which:
- Checks for the presence of a valid JWT token
- Provides methods for login, logout, and registration
- Exposes an observable for components to subscribe to authentication changes

### Security Measures

- Passwords are hashed using bcrypt before storage
- JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- Sensitive routes are protected using the AuthGuard
- All API requests validate the JWT token before processing

## API Endpoints

### Authentication

- `GET /api/auth/register` - Register a new user
- `GET /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/delete` - Delete user account

### Favorites

- `GET /api/favorites` - Get user's favorite artists
- `GET /api/favorites/add` - Add artist to favorites
- `GET /api/favorites/remove` - Remove artist from favorites

### Artists

- `GET /api/artists/search` - Search for artists
- `GET /api/artists/:id` - Get artist details
- `GET /api/artists/:id/similar` - Get similar artists

## License

MIT