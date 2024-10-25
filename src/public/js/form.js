const submit = document.getElementById('submit');
const endpoint = 'http://localhost:8080/api/products'
submit.addEventListener('submit', e => {
	e.preventDefault()
	const form = document.getElementById('form');
	const formData = new FormData(form)
	console.log(formData);
	
	// fetch(endpoint, {method: 'POST', formData})
})