export function sendSuccess(res, status, detail, optionalPayload) {
	const payload = { status: 'success', ...optionalPayload };
	if (detail) {
		payload.detail = detail;
	}
	return res.status(status).json(payload);
}

export function sendError(res, status, detail, optionalPayload) {
	return res
		.status(status)
		.json({ status: 'error', detail, ...optionalPayload });
}
