// Import Middleware for service and errors
const service = require('../services/blogsService');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// Handlers for HTTP requests
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

// Export modules
module.exports = {
  list: [asyncErrorBoundary(list)]
}