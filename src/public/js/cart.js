const domain = window.location.host;
const removeButtons = document.querySelectorAll('.remove-button');
for (let i = 0; i < removeButtons.length; i++) {
	const button = removeButtons[i];
	button.addEventListener('click', async e => {
		fetch(`http://${domain}/api/carts/mycart/product/${e.target.id}`, {
			method: 'DELETE',
		})
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
							? 'Producto eliminado del carrito'
							: 'Error al eliminar el producto del carrito',
					duration: 3000,
					gravity: 'bottom',
					backgroundColor: data.status == 'success' ? '#007BFF' : '#B30010',
					stopOnFocus: true,
				}).showToast();
				data.status == 'success' &&
					e.target.parentNode.parentNode.removeChild(e.target.parentNode);
			});
	});
}
