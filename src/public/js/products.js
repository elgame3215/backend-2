const addToCartButtons = document.querySelectorAll('.add-button');
for (let i = 0; i < addToCartButtons.length; i++) {
	const addButton = addToCartButtons[i];
	addButton.addEventListener('click', async e => {
		fetch(`/api/carts/my-cart/product/${e.target.id}`, {
			method: 'POST',
		})
			.then(response => {
				if (response.status === 401) {
					window.location.href = '/login';
				} else {
					return response.json();
				}
			})
			.then(data => {
				Toastify({
					text:
						data.status == 'success'
							? 'Producto agregado al carrito'
							: 'Error al agregar el producto',
					duration: 3000,
					gravity: 'bottom',
					style: {
						marginBottom: '30px',
					},
					backgroundColor: '#007BFF',
					stopOnFocus: true,
				}).showToast();
			});
	});
}
