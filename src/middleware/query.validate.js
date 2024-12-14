export function validateQuery(req, res, next) {
	const { limit, page, sort, query } = req.query;
	req.query.limit = !isNaN(limit) ? limit : undefined;
	req.query.page = !isNaN(page) ? page : undefined;
	req.query.sort = sort == "asc" || sort == "desc" ? sort : undefined;
	req.query.query = query ? String(query).toLowerCase() : undefined;
	return next();
}