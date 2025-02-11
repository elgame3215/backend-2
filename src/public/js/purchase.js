async function purchase() {
	let response = await fetch('/api/sessions/current');
	const { payload: user } = await response.json();
	response = await fetch(`/api/carts/${user.cart}/purchase`, {
		method: 'POST',
	});
	Toastify({
		text: response.ok
			? 'Compra realizada con éxito!'
			: 'Error al terminar la compra',
		duration: 3000,
		gravity: 'bottom',
		backgroundColor: response.ok ? '#007BFF' : '#B30010',
		stopOnFocus: true,
	}).showToast();
}
