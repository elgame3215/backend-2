const socket = io()

const submit = document.getElementById('submit');
const endpoint = 'http://localhost:8080/api/products'
let formData
let req
submit.addEventListener('click', e => {
	e.preventDefault()
	let data = {};
	const form = document.getElementById('form');
	formData = new FormData(form)
	formData.entries().forEach(e => {
		const key = e[0];
		const value = e[1];
		data[key] = value;
	})
	
	console.log(JSON.stringify(data));
})
