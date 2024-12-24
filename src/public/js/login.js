const formELement = document.getElementById('form');
formELement.addEventListener('submit', e => {
	e.preventDefault();
	const formData = new FormData(formELement);
	const data = parseFormData(formData);
	fetch(`http://${domain}/api/sessions/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	}).then(response => {
		if (response.status === 401) {
			Toastify({
				text: 'Credenciales inválidas',
				duration: 3000,
				gravity: 'bottom',
				backgroundColor: '#007BFF',
				stopOnFocus: true,
			}).showToast();
		} else {
			window.location.href = `http://${domain}`;
		}
	});
});
