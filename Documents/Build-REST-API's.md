# Building REST APIs with Node.js and Express

Node.js with Express.js provides an excellent foundation for building RESTful APIs.

The following sections outline best practices and patterns for implementation.

### Key Components:

- **Express Router**: For organizing routes
- **Middleware**: For cross-cutting concerns
- **Controllers**: For handling request logic
- **Models**: For data access and business logic
- **Services**: For complex business logic

Express.js is the most popular framework for building REST APIs in Node.js.

### Project Structure :
```js
- app.js # Main application file
- routes/ # Route definitions
  - users.routes.js
  - products.routes.js
- controllers/ # Request handlers
  - user.controller.js
  - product.controller.js
- models/ # Data models
  - User.js
  - Product.js
- middleware/ # Custom middleware
  - auth.middleware.js
  - validation.middleware.js
- config/ # Configuration files
  - db.config.js
  - env.config.js
- utils/ # Utility functions
  - errorHandler.utils.js
```

### Setting Up Express Router

```js
// routes/users.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Define routes for user operations
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
```
### Controllers and Models

Separating concerns between routes, controllers, and models improves code organization and maintainability:

```js
// controllers/user.controller.js
exports.getUsers = (req, res) => {
    res.json({ message: 'Returning list of users' });
}

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Returning user with ID ${userId}` });
}

exports.createUser = (req, res) => {
    const newUser = req.body;
    res.json({ message: 'User created', user: newUser });
}

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.json({ message: `User with ID ${userId} updated`, updatedUser });
}

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User with ID ${userId} deleted` });
}

```

### Error Handling

Implement consistent error handling to provide clear feedback to API consumers:

```js
// utils/errorHandler.utils.js
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
```

```js
// middleware/validation.middleware.js
const validation = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Different error responses for development and production
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Production: don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};

module.exports = { validation };
```

### Modify Content(Add) `index.js`
```js
const { validation } = require('./middleware/validation.middleware');
const { AppError } = require('./utils/errorHandler.utils');

// This route throws a custom error
app.get('/api/error-demo', (req, res, next) => {
  next(new AppError(404, 'Resource not found'));
});


// Other necessary code segments
................................
................................
................................

// Error handling middleware (must be last)
app.use(validation);
```

### Testing APIs

Testing is critical for API reliability.
Use libraries like `Jest`, `Mocha`, or `Supertest`:

```js
// tests/users.test.js
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };
      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(userData.name);
    });
    it('should validate request data', async () => {
      const invalidData = {
        email: 'not-an-email'
      };
      const res = await request(app)
        .post('/api/users')
        .send(invalidData);

      expect(res.statusCode).toBe(400);
    });
  });
});
```

### Best Practices Summary
- **Follow REST principles** and use appropriate HTTP methods
- **Use consistent naming conventions** for endpoints
- **Structure your API logically** with resource-based URLs
- **Return appropriate status codes** in responses
- **Implement proper error handling** with clear messages
- **Use pagination** for large data sets
- **Version your API** to maintain backward compatibility
- **Validate all input** to prevent security issues
- **Document your API** thoroughly
- **Write comprehensive tests** to ensure reliability
- **Use HTTPS** for all production APIs
- **Implement rate limiting** to prevent abuse




