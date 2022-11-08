// Import Dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const supertokens = require('supertokens-node');
const { middleware } = require("supertokens-node/framework/express");
const { errorHandler } = require("supertokens-node/framework/express");
// Import Route handlers
const blogsRoute = require('./routes/blogsRoute');
const eventsRoute = require('./routes/eventsRoute');
const testimonialsRoute = require('./routes/testimonialsRoute');
// Import Error handlers
const notFound = require('./errors/notFound');
const errorHandlerGeneric = require('./errors/errorHandler');
const { error } = require('console');

// Utilize environment variables
dotenv.config();

// Define app
const app = express();

// Middleware for CORS and Express
app.use(
  cors({
    origin: process.env.DASHBOARD_BASE_URL,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);
app.use(middleware());
app.use(express.json());

// Route handlers
app.use('/blogs', blogsRoute);
app.use('/events', eventsRoute);
app.use('/testimonials', testimonialsRoute);

// Error handlers
app.use(notFound);
app.use(errorHandler);
app.use(errorHandlerGeneric);

// Export module
module.exports = app;