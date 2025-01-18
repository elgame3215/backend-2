/**
 *
 * @param {Request} res
 * @param {Number} status
 * @param {String | null} detail opcional
 * @param {object | null} optionalPayload opcional
 * @returns
 */
export function sendSuccess(res, status, detail, optionalPayload) {
	const payload = { status: 'success', ...optionalPayload };
	if (detail) {
		payload.detail = detail;
	}
	return res.status(status).json(payload);
}

/**
 *
 * @param {Request} res
 * @param {Number} status
 * @param {String} detail
 * @param {object | null} optionalPayload
 * @returns
 */
export function sendError(res, status, detail, optionalPayload) {
	return res
		.status(status)
		.json({ status: 'error', detail, ...optionalPayload });
}
