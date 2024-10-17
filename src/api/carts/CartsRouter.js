import { CartsManager } from "../../managers/Carts-Manager.js";
import { Router } from "express";

export const router = Router()

router.post('/', async (req, res) => {
	const operation = await CartsManager.addCart();
	return res.status(operation.statusCode).json(operation)
});

router.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	if (isNaN(cid)) {
		return res.status(400).json({ error: 'El ID debe ser numérico' })
	}
	const operation = await CartsManager.getCartById(cid);
	const { succeed, cart, statusCode } = operation;
	if (!succeed) {
		return res.status(statusCode).json({error:'Carrito no encontrado'})
	}
	return res.status(statusCode).json(cart.products)
})