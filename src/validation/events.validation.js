// Import Middleware for service and errors
const service = require("../services/events.service");

//// !--- VALIDATION for event resources ---! ////

/**
 * isValidEvent:
 *   Utilized alongside create and update methods,
 *   where event is passed as the request body.
 *   Events require a name, date, and content
 *   Builds a custom error message and returns with 400 status
 */
async function isValidEvent(req, res, next) {
	// Acquire event from body of create/update request
	const event = { ...req.body };

	// Build custom error message
	const errors = [];
	if (!event.name) errors.push("Name required.");
	if (!event.date) errors.push("Date required.");
	if (!event.content) errors.push("Content required.");

	// Returns error or sets res.locals to pass thru
	if (errors.length) {
		return next({ status: 400, message: errors.join(" ") });
	}
	res.locals.validEvent = event;
	return next();
}
/**
 * eventExists:
 *   Looks up event according to param or request body
 *   Passes the event thru res.locals if found
 *   Otherwise returns error message with 404 status
 */
async function eventExists(req, res, next) {
	// Locate ID from param or request body
	let id = "";
	if (req.params.event_id) {
		id = req.params.event_id;
	} else {
		id = req.body.data.event_id;
	}

	// Read the appropriate event,
	// then take the first item of the list
	const eventList = await service.read(id);
	const event = eventList[0];

	// Return the blog if found, or return 404 message
	if (event) {
		res.locals.foundEvent = event;
		return next();
	}
	next({
		status: 404,
		message: `Event ${req.params.event_id} cannot be found.`,
	});
}

// Export modules
module.exports = {
	isValidEvent,
	eventExists,
};
