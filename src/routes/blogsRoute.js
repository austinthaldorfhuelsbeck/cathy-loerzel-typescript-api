// Import Dependencies
const router = require('express').Router();

// Import Middleware for controller and errors
const controller = require('../controllers/blogsController')
const methodNotAllowed = require('../errors/methodNotAllowed');

// Route Definitions
router.route('/').get(controller.list).all(methodNotAllowed);

// Export module
module.exports = router