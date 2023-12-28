// Import Middleware for service and errors
const service = require("../services/blogs.service");
const validation = require("../validation/blogs.validation");

//// !--- APPEND for create requests with incomplete blog object ---! ////

/**
 * appendData:
 *   Submitted blog objects without id, topic, or date
 *   are completed and passed thru res.locals
 */
async function appendData(req, res, next) {
	// Acquire blog object from res.locals
	const blog = res.locals.validBlog;

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
	res.locals.validBlog = blog;
	return next();
}

//// !--- HANDLERS for HTTP requests for blog resources ---! ////

/**
 * List:
 *   @returns array of all blog objects if no query provided
 *   @returns array of all blog objects matching category if category query
 *   @returns array of all blog objects matching topic if topic query
 */
async function list(req, res) {
	// Identify queries, if any
	const category = req.query.category;
	const topic = req.query.topic;

	// Assemble data array
	// Utilizes separate services for queries
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
 *   @returns array of all blog objects which are featured
 */
async function listFeatured(req, res) {
	let data = await service.listFeatured();
	res.json({ data });
}

/**
 * Create:
 *   @returns HTTP status 201 + the created blog object
 */
async function create(req, res) {
	// Locate validated blog object
	const blog = res.locals.validBlog;

	// Create blog entry utilizing service
	const data = await service.create(blog);

	// Return status and data
	res.status(201).json({ data });
}

/**
 * Read:
 *   @returns found blog object, if it exists
 */
function read(req, res) {
	// Locate validated blog object
	const data = res.locals.foundBlog;

	// Pass thru data
	res.json({ data });
}

/**
 * Update:
 *   @returns updated blog object
 */
async function update(req, res) {
	const data = await service.update(
		res.locals.validBlog,
		res.locals.foundBlog.blog_id,
	);
	res.json({ data: data[0] });
}

/**
 * Delete:
 *   @returns HTTP status 204 + the deleted (empty) blog object
 */
async function destroy(req, res, next) {
	const id = res.locals.foundBlog.blog_id;
	const data = await service.delete(id);
	res.status(204).json({ data });
}

// Export modules
module.exports = {
	list,
	listFeatured,
	create: [validation.isValidBlog, appendData, create],
	read: [validation.blogExists, read],
	update: [validation.blogExists, validation.isValidBlog, update],
	delete: [validation.blogExists, destroy],
};
