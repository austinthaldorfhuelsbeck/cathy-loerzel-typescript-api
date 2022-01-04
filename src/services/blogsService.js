// Import knex object for database connection
const knex = require('../db/connection')

// Services for HTTP requests
function list() {
  return knex("blogs").select("*").orderBy("order");
}

// Export modules
module.exports = {
  list
}