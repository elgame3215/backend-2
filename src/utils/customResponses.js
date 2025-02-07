import { DtoError } from '../errors/generic.errors.js';

/**
 *
 * @param {Object} data
 * @param {Response} data.res
 * @param {Number} data.status
 * @param {String | null} data.detail
 * @param {object | null} data.payload
 * @param {import("joi").AnySchema | null} data.dtoSchema
 * @returns
 */
export function sendSuccess({ res, next, code, detail, payload, dtoSchema }) {
	const response = { status: 'success' };
	if (detail) {
		response.detail = detail;
	}
	if (payload) {
		const { error, value } = dtoSchema
			.unknown(true)
			.validate(payload, { convert: true, stripUnknown: true });
		if (error) {
			return next(new DtoError(error));
		}
		response.payload = value;
	}
	return res.status(code).json(response);
}

/**
 *
 * @param {Response} res
 * @param {Number} code
 * @param {String} detail
 * @param {object | null} optionalPayload
 * @returns
 */
export function sendError({ res, code, message }) {
	return res.status(code).json({ status: 'error', message, code });
}
