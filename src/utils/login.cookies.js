export function setLoginCookies(req, res) {
	res.cookie('username', req.user.name);
	res.cookie('authStatus', 1);
}