import { isValidObjectId } from "mongoose";

export function validateCid(req, res, next) {
	const { cid } = req.params;
	if (!isValidObjectId(cid)) {
		return res.status(400).json({ status: 'error', detail: 'invalid cid' });
	}
	next();
}
export function validatePid(req, res, next) {
	const { pid } = req.params;
	if (!isValidObjectId(pid)) {
		return res.status(400).json({ status: 'error', detail: 'invalid pid' });
	}
	next();
}




