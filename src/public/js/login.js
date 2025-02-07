const formELement = document.getElementById('form');
const githubBtn = document.getElementById('github-login-btn');
formELement.addEventListener('submit', e => {
	e.preventDefault();
	const formData = new FormData(formELement);
	const data = parseFormData(formData);
	fetch('/api/sessions/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
		.then(response => {
			if (response.status === 401) {
				Toastify({
					text: 'Credenciales inválidas',
					duration: 3000,
					gravity: 'bottom',
					backgroundColor: '#007BFF',
					stopOnFocus: true,
				}).showToast();
			} else {
				return response.json();
			}
		})
		.then(data => {
			const [name] = data.payload.first_name.split(' ');
			localStorage.setItem('username', name);
			window.location.href = '/';
		});
});

githubBtn.addEventListener('click', () => {
	window.location.href = `/api/sessions/github`;
});
