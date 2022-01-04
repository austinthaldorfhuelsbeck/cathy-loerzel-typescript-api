// Import knex object for database connection
const knex = require('../db/connection');

//// !--- SERVICES for HTTP requests for blog resources ---! ////

/**
 * List:
 *   @return array of all blog objects,
 *   sorted by order number
*/
function list() {
  return knex("blogs").select("*").orderBy("order");
}
/**
 * List Category:
 *   @input string representing category
 *   @return array of all blog objects matching category,
 *   sorted by order number
 */
function listCategory(category) {
  return knex("blogs as b")
    .select("*")
    .where({ "b.category": category })
    .orderBy("b.order");
}
/**
 * List Topic:
 *   @input string representing topic
 *   @return array of all blog objects matching topic,
 *   sorted by order number
 */
function listTopic(topic) {
  return knex("blogs as b")
    .select("*")
    .where({ "b.topic": topic })
    .orderBy("b.order")
}
/**
 * List Featured:
 *   @return array of all blog object with featured=true,
 *   sorted by order number
 */
function listFeatured() {
  return knex("blogs as b")
    .select("*")
    .where({ "b.featured": true })
    .orderBy("b.order");
}

/**
 * Create:
 *   @input blog object
 *   @return created blog object from db
 */
function create(blog) {
  return knex("blogs")
    .insert(blog)
    .returning("*")
    .then((createdBlogs) => createdBlogs[0])
}

// Export modules
module.exports = {
  list,
  listCategory,
  listTopic,
  listFeatured,
  create
}