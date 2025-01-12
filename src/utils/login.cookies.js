export function setLoginCookies(req, res) {
	res.cookie('authStatus', 1);
	res.cookie('username', req.user.name);
}
