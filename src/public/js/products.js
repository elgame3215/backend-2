const domain = window.location.host;
const addToCartButtons = document.querySelectorAll('.add-button');
for (let i = 0; i < addToCartButtons.length; i++) {
	const addButton = addToCartButtons[i];
	addButton.addEventListener('click', async e => {
		fetch(
			`http://${domain}/api/carts/mycart/product/${e.target.id}`,
			{ method: 'POST' }
		)
			.then(response => {
				if (response.status === 401) {
					window.location.href = `http://${domain}/login`;
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
					backgroundColor: '#007BFF',
					stopOnFocus: true,
				}).showToast();
			});
	});
}
