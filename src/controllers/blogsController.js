// Import Middleware for service and errors
const service = require('../services/blogsService');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');


//// !--- VALIDATION for blog resources ---! ////

/**
 * isValidBlog:
 *   Utilized alongside create method,
 *   where blog is passed as the request body.
 *   Blogs require a title, category, text, and img
 *   Builds a custom error message and returns with 400 status
 */
async function isValidBlog(req, res, next) {
  // Acquire blog from body of create request
  const blog = { ...req.body };

  // Build custom error message
  let message = "";
  if (!blog.title) message += "Title required. ";
  if (!blog.category) message += "Category required. ";
  if (!blog.text) message += "Description required. ";
  if (!blog.img) message += "Image required. ";

  // Returns error or sets res.locals to pass thru
  if (message !== "") {
    return next({ status: 400, message });
  }
  res.locals.blog = blog;
  return next();
}

//// !--- APPEND for create requests with incomplete blog object ---! ////

/**
 * appendData:
 *   Submitted blog objects without id, topic, or date
 *   are completed and passed thru res.locals
 */
async function appendData(req, res, next) {
  // Acquire blog object from res.locals
  const { blog } = res.locals;

  // Append an ID created from title if no ID provided
  if (!blog.blog_id) {
    blog.blog_id = blog.title.replace(/\s/g, "-").toLowerCase();
  }

  // Append topic "general" if no topic provided
  if (!blog.topic) blog.topic = "general";

  // Append today's date if no date provided
  if (!blog.date) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    blog.date = today;
  }

  // Pass thru completed blog object
  res.locals.blog = blog;
  return next();
}

//// !--- HANDLERS for HTTP requests for blog resources ---! ////

/**
 * List:
 *   @return array of all blog objects if no query provided
 *   @return array of all blog objects matching category if category query
 *   @return array of all blog objects matching topic if topic query
*/
async function list(req, res) {
  // Identify queries, if any
  const category = req.query.category;
  const topic = req.query.topic;

  // Assemble data array
  // Utilizes seperate services for queries
  let data = [];
  if (category) {
    data = await service.listCategory(category);
  } else if (topic) {
    data = await service.listTopic(topic);
  } else {
    data = await service.list();
  }

  // Return data
  res.json({ data });
}
/**
 * List Featured:
 *   @return array of all blog objects which are featured
 */
async function listFeatured(req, res) {
  let data = await service.listFeatured();
  res.json({ data });
}

/**
 * Create:
 *   @return HTTP status 201 + the created blog object
 */
async function create(req, res) {
  // Locate validated blog object
  const { blog } = res.locals;

  // Create blog entry utilizing service
  const data = await service.create(blog);

  // Return status and data
  res.status(201).json({ data });
}

// Export modules
module.exports = {
  list: [asyncErrorBoundary(list)],
  listFeatured: [asyncErrorBoundary(listFeatured)],
  create: [asyncErrorBoundary(isValidBlog), appendData, create]
}