// Import the Express module
const express = require('express');
const userRoutes = require('./routes/users.routes');
const { validation } = require('./middleware/validation.middleware');
const { AppError } = require('./utils/errorHandler.utils');

// Create an Express application
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello, World! The server is running.');
});

// Import user routes
app.use('/api/users', userRoutes);

// This route throws a custom error
app.get('/api/error-demo', (req, res, next) => {
  next(new AppError(404, 'Resource not found'));
});

// Error handling middleware (must be last)
app.use(validation);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});