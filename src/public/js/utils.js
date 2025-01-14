function parseFormData(formData) {	// eslint-disable-line no-unused-vars
	const data = {};
	formData.entries().forEach(e => {
		const key = e[0];
		const value = e[1];
		data[key] = value;
	});
	return data;
}
