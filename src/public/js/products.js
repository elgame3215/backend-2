let userCartId = localStorage.getItem('userCartId')
const myCartButton = document.getElementById('my-cart-button')
if (!userCartId) {
	fetch('http://localhost:8080/api/carts', { method: 'POST' })
	.then(response => response.json())
	.then(data => {
		userCartId = data.addedCart._id
		localStorage.setItem('userCartId', userCartId)
		myCartButton.href = `/products/carts/${userCartId}`
	})
}
myCartButton.href = `/products/carts/${userCartId}`

const addToCartButtons = document.querySelectorAll('.add-button')
for (let i = 0; i < addToCartButtons.length; i++) {
	const addButton = addToCartButtons[i];
	addButton.addEventListener('click', async e => {
		fetch(`http://localhost:8080/api/carts/${userCartId}/product/${e.target.id}`, { method: 'POST' })
			.then(response => response.json())
			.then(data => {
				if (data.status == 'success') {
					Toastify({
						text: 'Producto agregado al carrito',
						duration: 3000,
						gravity: 'bottom',
						backgroundColor: '#007BFF',
						stopOnFocus: true
					}).showToast();
				} else {
					Toastify({
						text: 'Error al agregar el producto',
						duration: 3000,
						gravity: 'bottom',
						backgroundColor: '#007BFF',
						stopOnFocus: true
					}).showToast();
				}
			})
	})
}
