let userCartId = localStorage.getItem('userCartId');
if (!userCartId) {
	fetch('http://localhost:8080/api/carts', { method: 'POST' })
		.then(response => response.json())
		.then(data => {
			userCartId = data.addedCart._id;
			localStorage.setItem('userCartId', userCartId);
		});
}
const removeButtons = document.querySelectorAll('.remove-button');
for (let i = 0; i < removeButtons.length; i++) {
	const button = removeButtons[i];
	button.addEventListener('click', async e => {
		fetch(
			`http://localhost:8080/api/carts/${userCartId}/product/${e.target.id}`,
			{ method: 'DELETE' }
		)
			.then(response => response.json())
			.then(data => {
				Toastify({
					text:
						data.status == 'success'
							? 'Producto eliminado del carrito'
							: 'Error al eliminar el producto del carrito',
					duration: 3000,
					gravity: 'bottom',
					backgroundColor: '#007BFF',
					stopOnFocus: true,
				}).showToast();
				data.status == 'success' &&
					e.target.parentNode.parentNode.removeChild(e.target.parentNode);
			});
	});
}
