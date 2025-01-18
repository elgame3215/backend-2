const form = document.getElementById('register-form');
form.addEventListener('submit', e => {
	e.preventDefault();
	const formData = new FormData(form);
	const data = parseFormData(formData);
	fetch('/api/sessions/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			Toastify({
				text: data.detail,
				duration: 3000,
				gravity: 'bottom',
				backgroundColor: '#007BFF',
				stopOnFocus: true,
			}).showToast();
			if (data.status == 'success') {
				localStorage.setItem('username', data.username);
				setTimeout(() => {
					window.location.href = `/`;
				}, 1500);
			}
		});
});
