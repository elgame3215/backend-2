function parseFormData(formData) {
	const data = {};
	formData.entries().forEach(e => {
		const key = e[0];
		const value = e[1];
		data[key] = value;
	});
	return data;
}

// eslint-disable-next-line no-undef
const socket = io()
const submit = document.getElementById('submit');
const productsContainer = document.querySelector('.products-container')

submit.addEventListener('click', async e => {
	e.preventDefault()
	const form = document.getElementById('form');
	const formData = new FormData(form);
	const data = parseFormData(formData);
	await fetch('http://localhost:8080/api/products',
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}
	)
})

socket.on('product added', product => {
	const newProductEl = `
		<div class="product-card">
			<div class="product-info">
				<h2 class="product-title">${product.title}</h2>
				<p class="product-price">$${product.price}</p>
				<p class="product-description">${product.description}</p>
				<p class="product-stock">stock: ${product.stock}</p>
				<p class="product-category">${product.category}</p>
			</div>
			<button class="delete-button" id="${product._id}">Eliminar</button>
		</div>
		`;
	productsContainer.insertAdjacentHTML('beforeend', newProductEl)
	const deleteButton = document.getElementById(product._id);
	deleteButton.addEventListener('click', deleteProduct);
	document.querySelectorAll('.form-group input, textarea').forEach(n => n.value = '')
	Toastify({
		text: 'Producto agregado',
		duration: 3000,
		gravity: 'bottom',
		backgroundColor: '#007BFF',
		stopOnFocus: true
	}).showToast();
});

socket.on('invalid product', message => {
	Toastify({
		text: message,
		duration: 3000,
		gravity: 'bottom',
		backgroundColor: '#B30010',
		stopOnFocus: true,
	}).showToast();
})

async function deleteProduct(e) {
	const response = await fetch(`http://localhost:8080/api/products/${e.target.id}`,
		{ method: 'DELETE' }
	)
	if (response.status != 200) {
		return Toastify({
			text: 'Error al eliminar el producto',
			duration: 3000,
			gravity: 'bottom',
			backgroundColor: '#B30010',
			stopOnFocus: true
		}).showToast();
	}
	productsContainer.removeChild(e.target.parentNode);
	Toastify({
		text: 'Producto eliminado',
		duration: 3000,
		gravity: 'bottom',
		backgroundColor: '#007BFF',
		stopOnFocus: true
	}).showToast();
};
