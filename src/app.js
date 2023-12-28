// Import Dependencies
const express = require('express');
const cors = require('cors');
// Import Route handlers
const blogsRoute = require('./routes/blogs.route');
const eventsRoute = require('./routes/events.route');
// Import Error handlers
const notFound = require('./errors/notFound');
const errorHandler = require('./errors/errorHandler');

// Define app
const app = express();

// Middleware for CORS and Express
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Route handlers
app.use('/blogs', blogsRoute);
app.use('/events', eventsRoute);

// Eroor handlers
app.use(notFound);
app.use(errorHandler);

// Export module
module.exports = app;