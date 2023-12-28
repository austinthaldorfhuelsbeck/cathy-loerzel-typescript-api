// Import Middleware for service and errors
const service = require("../services/events.service");
const validation = require("../validation/events.validation");

//// !--- HANDLERS for HTTP requests for blog resources ---! ////

/**
 * List:
 *   @returns array of all event objects or as specified by query
 */
async function list(req, res) {
	const type = req.query.type;
	const data = type ? await service.listType(type) : await service.list();
	res.json({ data });
}

/**
 * Create:
 *   @returns HTTP status 201 + the created event object
 */
async function create(req, res) {
	// Locate validated event object
	const event = res.locals.validEvent;

	// Create event entry utilizing service
	const data = await service.create(event);

	// Return status and data
	res.status(201).json({ data });
}

/**
 * Read:
 *   @returns found event object, if it exists
 */
function read(req, res) {
	// Locate validated event object
	const data = res.locals.foundEvent;
	res.json({ data });
}

/**
 * Update:
 *   @returns updated event object
 */
async function update(req, res) {
	const data = await service.update(
		res.locals.validEvent,
		res.locals.foundEvent.event_id,
	);
	res.json({ data });
}

/**
 * Delete:
 *   @returns HTTP status 204 + the deleted (empty) event object
 */
async function destroy(req, res, next) {
	const id = res.locals.foundEvent.event_id;
	const data = await service.delete(id);
	res.status(204).json({ data });
}

// Export modules
module.exports = {
	list,
	create: [validation.isValidEvent, create],
	read: [validation.eventExists, read],
	update: [validation.eventExists, validation.isValidEvent, update],
	delete: [validation.eventExists, destroy],
};
