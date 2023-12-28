// Import Middleware for service and errors
const service = require("../services/blogs.service");

//// !--- VALIDATION for blog resources ---! ////

/**
 * isValidBlog:
 *   Utilized alongside create and update methods,
 *   where blog is passed as the request body.
 *   Blogs require a title, category, text, and img
 *   Builds a custom error message and returns with 400 status
 */
async function isValidBlog(req, res, next) {
	// Acquire blog from body of create/update request
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
	res.locals.validBlog = blog;
	return next();
}
/**
 * blogExists:
 *   Looks up blog according to param or request body
 *   Passes the blog thru res.locals if found
 *   Otherwise returns error message with 404 status
 */
async function blogExists(req, res, next) {
	// Locate ID from param or request body
	let id = "";
	if (req.params.blog_id) {
		id = req.params.blog_id;
	} else if (req.body.data.blog_id) {
		id = req.body.data.blog_id;
	}

	// Read the appropriate blog,
	// then take the first item of the list
	const blogsList = await service.read(id);
	const blog = blogsList[0];

	// Return the blog if found, or return 404 message
	if (blog) {
		res.locals.foundBlog = blog;
		return next();
	}
	next({
		status: 404,
		message: `Blog ${req.params.blog_id} cannot be found.`,
	});
}

// Export modules
module.exports = {
	isValidBlog,
	blogExists,
};
