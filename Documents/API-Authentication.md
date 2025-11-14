# Node.js API Authentication Guide

## What is API Authentication?

API authentication is the process of verifying the identity of clients accessing your Node.js APIs.

This comprehensive guide covers various authentication methods, security best practices, and implementation patterns to help you secure your Node.js applications effectively.

## Why API Authentication important ?

API authentication is a critical security mechanism that verifies the identity of users, applications, or systems attempting to access an API (Application Programming Interface).

### Security Benefits
- **Access control**: Restrict API access to authorized users only
- **Data Protection**: Safeguard sensitive information from unauthorized access
- **Identity Verification**: Ensure users are who they claim to be

### Business Benefits
- **Usage Analytics**: Track API usage by user/application
- **Monetization**: Implement usage-based billing models

- **Compliance**: Meet regulatory requirements (GDPR, HIPAA, etc.)

# Authentication Methods Overview

Different authentication methods serve different use cases. Here's a quick comparison:

|Method|Best For|Complexcity|Security Level|
|----|----|----|----|
|Session based|Traditional Apps|Low|Medium|
|JWT (Token based)|SPAs, Mobile Apps|Medium|High|
|API keys|Server-to-Server|Low|Low-Medium|
|OAuth 2.0|Third Party Access|High|Very High|


## Authentication Methods
There are several approaches to API authentication in Node.js

## Session-Based Authentication
Session-based authentication uses cookies to maintain user state:<br/>
[source code](../Authentications/auth/session-based-auth.js)

```js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('../config/env.config');
const fs = require('fs').promises;
const app = express();

const getUsers = async () => {
    const data = await fs.readFile('../data/users.data.json', 'utf8');
    return JSON.parse(data);
};

const saveUsers = async (users) => {
    await fs.writeFile('../data/users.data.json', JSON.stringify(users, null, 2), 'utf8');
}

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    cookie: config.session.cookie
}));

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = await getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        req.session.user = { id: user.id, username: user.username };
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const users = await getUsers();
        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = { id: users.length + 1, username, password, email };
        users.push(newUser);
        await saveUsers(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route
app.get('/protected', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ message: `Welcome ${req.session.user.username}! This is a protected route.` });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});
```

## Token-Based Authentication (JWT)
JSON Web Tokens (JWT) provide a stateless authentication mechanism that's compact and self-contained.

Unlike session-based authentication, **token-based authentication (JWT) doesn't require a server to store session data.**

This makes it ideal for stateless API architecture and microservices.

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const config = require('../config/env.config');
const jwtMiddleware = require('../middleware/jwtVerification.middleware');

const app = express();

const getUsers = async () => {
    const data = await fs.readFile('../data/users.data.json', 'utf8');
    return JSON.parse(data);
};

const saveUsers = async (users) => {
    await fs.writeFile('../data/users.data.json', JSON.stringify(users, null, 2), 'utf8');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login route - generate a JWT on successful login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = await getUsers();

    // Find user
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    try {
        //Create payload for JWT
        const payload = { id: user.id, username: user.username, email: user.email };

        // sign token
        const token = jwt.sign(payload, config.development.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route 
app.get('/protected', jwtMiddleware, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

```
**Extra files** <br/>
[JWT Middleware Source Code](../Authentications/middleware/jwtVerification.middleware.js)<br/>
[Configuration Source Code](../Authentications/config/env.config.js)<br/>

## OAuth 2.0 Authentication
OAuth 2.0 is the industry-standard protocol for authorization, enabling applications to obtain limited access to user accounts on HTTP services.

It works by delegating user authentication to the service that hosts the user account.

### OAuth 2.0 Flow Overview
1. User clicks "Login with [Provider]" in your app
2. User is redirected to the provider's login page
3. User authenticates and authorizes your app
4. Provider redirects back to your app with an authorization code
5. Your app exchanges the code for an access token
6. Your app can now access the user's data (within the authorized scope)

## Implementation with Passport.js

1. Install required packages.
```
npm install passport passport-google-oauth20 express-session
```

2. Set Up OAuth 2.0 with Google

```js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const app = express();

// Configure sessions for OAuth 2.0
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // In a real app, you'd find or create a user in your database
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google'
    };
   
    return done(null, user);
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes for Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/profile');
  }
);

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Protected route
app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});

```






